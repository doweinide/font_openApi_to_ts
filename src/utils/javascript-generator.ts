// JavaScript 代码生成器
import { filterByTags } from './openapi-parser'

import type {
  FileTreeNode,
  GenerateOptions,
  GenerateResult,
  GeneratedFile,
  GeneratorConfig,
  OpenAPIDocument,
  OperationObject,
  ParameterObject,
  SchemaObject,
} from '@/types/openapi'

/**
 * 生成 JavaScript 代码
 * @param options 生成选项
 * @returns 生成结果
 */
export function generateJavaScriptCode(
  options: GenerateOptions,
): GenerateResult {
  const { config, openApiDoc } = options

  // 根据配置过滤文档
  const filteredDoc =
    config.outputTags.length > 0
      ? filterByTags(openApiDoc, config.outputTags)
      : openApiDoc

  const files: GeneratedFile[] = []
  const generator = new JavaScriptGenerator(filteredDoc, config)

  // 生成类型文件
  if (config.separateTypes) {
    files.push(generator.generateTypesFile())
  }

  // 生成工具文件
  if (config.generateUtils) {
    files.push(generator.generateUtilsFile())
  }

  // 按标签生成 API 文件
  const apiFiles = generator.generateApiFiles()
  files.push(...apiFiles)

  // 生成索引文件
  if (config.generateIndex) {
    files.push(generator.generateIndexFile(apiFiles))
  }

  // 生成文件结构树
  const structure = generateFileStructure(files)

  return {
    files,
    structure,
  }
}

/**
 * JavaScript 代码生成器类
 */
class JavaScriptGenerator {
  private doc: OpenAPIDocument
  private config: GeneratorConfig

  constructor(doc: OpenAPIDocument, config: GeneratorConfig) {
    this.doc = doc
    this.config = config
  }

  /**
   * 生成类型文件
   */
  generateTypesFile(): GeneratedFile {
    const types: string[] = []

    if (this.config.includeComments) {
      types.push('// TypeScript 类型定义文件')
      types.push('// 此文件包含所有 API 相关的类型定义\n')
    }

    // 生成基础类型定义
    types.push('export interface ApiResponse<T = any> {')
    types.push('  code: number // 响应状态码')
    types.push('  message: string // 响应消息')
    types.push('  data: T // 响应数据')
    types.push('}')
    types.push('')

    types.push('export interface RequestConfig {')
    types.push('  url: string // 请求URL')
    types.push('  method: string // 请求方法')
    types.push('  params?: any // 查询参数')
    types.push('  data?: any // 请求体数据')
    types.push('  headers?: any // 请求头')
    types.push('}')
    types.push('')

    // 从 OpenAPI schemas 生成类型定义
    if (this.doc.components?.schemas) {
      Object.entries(this.doc.components.schemas).forEach(([name, schema]) => {
        const typeDefinition = this.generateTypeScriptInterface(name, schema)
        if (typeDefinition) {
          types.push(typeDefinition)
          types.push('')
        }
      })
    }

    // 为每个操作生成请求和响应类型
    const operationTypes = this.generateOperationTypes()
    types.push(...operationTypes)

    return {
      content: types.join('\n'),
      path: 'types.ts',
      type: 'typescript',
    }
  }

  /**
   * 生成工具文件
   */
  generateUtilsFile(): GeneratedFile {
    const lines: string[] = []
    
    lines.push(this.config.importTemplate)
    lines.push('')
    lines.push('// 创建 axios 实例')
    lines.push('const api = axios.create({')
    lines.push(`  baseURL: '${this.config.baseURL}',`)
    lines.push('  timeout: 10000,')
    lines.push('});')
    lines.push('')
    lines.push('// 请求拦截器')
    lines.push('api.interceptors.request.use(')
    lines.push('  (config) => {')
    lines.push('    // 在这里添加认证 token 等')
    lines.push('    return config;')
    lines.push('  },')
    lines.push('  (error) => {')
    lines.push('    return Promise.reject(error);')
    lines.push('  }')
    lines.push(');')
    lines.push('')
    lines.push('// 响应拦截器')
    lines.push('api.interceptors.response.use(')
    lines.push('  (response) => {')
    lines.push('    return response.data;')
    lines.push('  },')
    lines.push('  (error) => {')
    lines.push('    return Promise.reject(error);')
    lines.push('  }')
    lines.push(');')
    lines.push('')
    lines.push('// 导出请求方法')
    lines.push('export const request = {')
    lines.push('  get: (url, config) => api.get(url, config),')
    lines.push('  post: (url, data, config) => api.post(url, data, config),')
    lines.push('  put: (url, data, config) => api.put(url, data, config),')
    lines.push('  delete: (url, config) => api.delete(url, config),')
    lines.push('  patch: (url, data, config) => api.patch(url, data, config),')
    lines.push('};')
    lines.push('')
    lines.push('export default api;')

    return {
      content: lines.join('\n'),
      path: 'utils.js',
      type: 'javascript',
    }
  }

  /**
   * 生成 API 文件
   */
  generateApiFiles(): GeneratedFile[] {
    const files: GeneratedFile[] = []
    const tagGroups = this.groupOperationsByTag()

    Object.entries(tagGroups).forEach(([tag, operations]) => {
      // 修复过滤逻辑：如果没有配置outputTags，生成所有标签
      // 如果配置了outputTags，只生成指定的tags，但default标签总是生成
      const shouldGenerate =
        this.config.outputTags.length === 0 || // 没有配置过滤，生成所有
        this.config.outputTags.includes(tag) || // 在过滤列表中
        tag === 'default' // default标签总是生成

      if (!shouldGenerate) {
        return
      }
      const content = this.generateApiFileContent(tag, operations)
      const fileName = this.formatFileName(tag)

      // 检查是否为中文tag，如果是则生成文件夹结构
      if (this.isChinese(tag)) {
        files.push({
          content,
          path: `${fileName}/index.js`,
          type: 'javascript',
        })
      } else {
        files.push({
          content,
          path: `${fileName}.js`,
          type: 'javascript',
        })
      }
    })

    return files
  }

  /**
   * 生成索引文件
   */
  generateIndexFile(apiFiles: GeneratedFile[]): GeneratedFile {
    const exports: string[] = []

    if (this.config.includeComments) {
      exports.push('// 统一导出文件\n')
    }

    // 导出工具
    if (this.config.generateUtils) {
      exports.push('export * from "./utils/request.js";')
    }

    // 导出 API 文件
    apiFiles.forEach(file => {
      const fileName = file.path.replace('.js', '')
      exports.push(`export * from "./${fileName}.js";`)
    })

    return {
      content: exports.join('\n'),
      path: 'index.js',
      type: 'javascript',
    }
  }

  /**
   * 按标签分组操作
   */
  private groupOperationsByTag(): Record<
    string,
    Array<{ path: string; method: string; operation: OperationObject }>
  > {
    const groups: Record<
      string,
      Array<{ path: string; method: string; operation: OperationObject }>
    > = {}
    const processedOperations = new Set<string>()

    Object.entries(this.doc.paths).forEach(([path, pathItem]) => {
      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const

      methods.forEach(method => {
        const operation = pathItem[method]
        if (operation) {
          const operationKey = `${method}:${path}`

          // 防止重复处理同一个操作
          if (processedOperations.has(operationKey)) {
            return
          }
          processedOperations.add(operationKey)

          const tags =
            operation.tags && operation.tags.length > 0
              ? operation.tags
              : ['default']

          // 如果一个操作有多个标签，只使用第一个标签来避免重复
          const primaryTag = tags[0]

          if (!groups[primaryTag]) {
            groups[primaryTag] = []
          }
          groups[primaryTag].push({ method, operation, path })
        }
      })
    })

    return groups
  }

  /**
   * 生成 API 文件内容
   */
  private generateApiFileContent(
    tag: string,
    operations: Array<{
      path: string
      method: string
      operation: OperationObject
    }>,
  ): string {
    const content: string[] = []

    // 添加导入语句
    content.push(this.config.importTemplate)
    content.push('')

    // 生成函数
    operations.forEach(({ method, operation, path }) => {
      const functionCode = this.generateApiFunction(path, method, operation)
      content.push(functionCode)
      content.push('')
    })

    return content.join('\n')
  }

  /**
   * 生成 API 函数
   */
  private generateApiFunction(
    path: string,
    method: string,
    operation: OperationObject,
  ): string {
    // 基于完整路径和方法生成函数名
    const functionName = this.generateFunctionNameFromPath(path, method)

    // 构建参数
    const hasParams = operation.parameters?.length || operation.requestBody
    const paramName = hasParams ? 'params' : ''

    // 构建函数签名
    const signature = this.config.useAsync
      ? `export const ${functionName} = async (${paramName}) => {`
      : `export function ${functionName}(${paramName}) {`

    const lines: string[] = []

    // 添加完整的JSDoc注释
    if (this.config.includeComments) {
      const jsdocComment = this.generateJSDocComment(functionName, operation, hasParams)
      lines.push(jsdocComment)
    }

    lines.push(signature)

    // 构建请求配置
    const requestConfig = this.buildRequestConfig(path, method, operation)
    lines.push('  const response = await request({')
    lines.push(`    url: '${path}',`)
    lines.push(`    method: '${method.toUpperCase()}',`)

    if (requestConfig.params) {
      lines.push(`    params: ${requestConfig.params},`)
    }

    if (requestConfig.data) {
      lines.push(`    data: ${requestConfig.data},`)
    }

    if (requestConfig.headers) {
      lines.push(`    headers: ${requestConfig.headers},`)
    }

    lines.push('  });')
    lines.push('  return response;')

    if (this.config.useAsync) {
      lines.push('};')
    } else {
      lines.push('}')
    }

    return lines.join('\n')
  }

  /**
   * 生成JSDoc注释
   */
  private generateJSDocComment(functionName: string, operation: OperationObject, hasParams: boolean): string {
    const lines: string[] = []
    lines.push('/**')
    
    // 添加函数描述
    const description = operation.summary || operation.description || functionName
    lines.push(` * ${description}`)
    
    if (operation.description && operation.summary) {
      lines.push(` * ${operation.description}`)
    }
    
    // 添加参数类型
    if (hasParams) {
      const requestTypeName = `${this.toPascalCase(functionName)}Request`
      lines.push(` * @param {import('./types').${requestTypeName}} params - 请求参数`)
    }
    
    // 添加返回值类型
    const responseTypeName = `${this.toPascalCase(functionName)}Response`
    const returnType = this.config.useAsync 
      ? `Promise<import('./types').${responseTypeName}>` 
      : `import('./types').${responseTypeName}`
    lines.push(` * @returns {${returnType}} 返回结果`)
    
    lines.push(' */')
    return lines.join('\n')
  }

  /**
   * 构建请求配置
   */
  private buildRequestConfig(
    path: string,
    method: string,
    operation: OperationObject,
  ): { params?: string; data?: string; headers?: string } {
    const config: { params?: string; data?: string; headers?: string } = {}

    // 只处理查询参数，不包括header参数
    const queryParams = operation.parameters?.filter(p => p.in === 'query')
    const pathParams = operation.parameters?.filter(p => p.in === 'path')
    const headerParams = operation.parameters?.filter(p => p.in === 'header')

    // 只有查询参数才放入params
    if (queryParams?.length) {
      config.params = 'params'
    }

    // header参数单独处理
    if (headerParams?.length) {
      config.headers = 'params.headers'
    }

    // 处理请求体
    if (operation.requestBody && ['post', 'put', 'patch'].includes(method)) {
      config.data = 'params.body'
    }

    return config
  }

  /**
   * 格式化函数名称
   */
  private formatFunctionName(name: string): string {
    const formatted = name.replace(/[^a-zA-Z0-9]/g, '_')
    return this.config.functionNaming === 'camelCase'
      ? this.toCamelCase(formatted)
      : this.toSnakeCase(formatted)
  }

  /**
   * 格式化文件名称
   */
  private formatFileName(name: string): string {
    // 如果是中文，保持中文字符，只替换空格和特殊符号
    if (this.isChinese(name)) {
      return name.replace(/[\s<>:"/\\|?*]/g, '_').trim()
    }

    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * 检测是否包含中文字符
   */
  private isChinese(text: string): boolean {
    return /[\u4e00-\u9fa5]/.test(text)
  }

  /**
   * 基于完整路径生成函数名
   */
  private generateFunctionNameFromPath(path: string, method: string): string {
    // 移除开头的斜杠，分割路径
    const pathParts = path
      .replace(/^\//, '')
      .split('/')
      .filter(p => p && !p.startsWith('{'))

    // 组合方法名和路径
    const fullName = method + '_' + pathParts.join('_')

    // 根据配置的命名规则格式化
    return this.formatFunctionName(fullName)
  }

  /**
   * 转换为 PascalCase
   */
  private toPascalCase(str: string): string {
    return str.replace(/(?:^|_)([a-z])/g, (_, char) => char.toUpperCase())
  }

  /**
   * 转换为 camelCase
   */
  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str)
    return pascal.charAt(0).toLowerCase() + pascal.slice(1)
  }

  /**
   * 转换为 snake_case
   */
  private toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (char, index) =>
      index === 0 ? char.toLowerCase() : `_${char.toLowerCase()}`,
    )
  }

  /**
   * 从 OpenAPI Schema 生成 TypeScript 接口定义
   */
  private generateTypeScriptInterface(name: string, schema: SchemaObject): string | null {
    if (schema.$ref) {
      // 处理引用类型
      const refName = schema.$ref.split('/').pop()
      return refName ? `// 参考类型: ${refName}` : null
    }

    const lines: string[] = []
    
    if (schema.description) {
      lines.push(`// ${schema.description}`)
    }
    
    lines.push(`export interface ${name} {`)

    if (schema.properties) {
      Object.entries(schema.properties).forEach(([propName, propSchema]) => {
        const isRequired = schema.required?.includes(propName)
        const tsType = this.getTypeScriptTypeFromSchema(propSchema)
        const optional = isRequired ? '' : '?'
        // 优先使用title作为注释，如果没有title则使用description
        const commentText = propSchema.title || propSchema.description || ''
        const description = commentText ? ` // ${commentText}` : ''
        
        lines.push(`  ${propName}${optional}: ${tsType}${description}`)
      })
    }

    lines.push('}')
    return lines.join('\n')
  }

  /**
   * 从 Schema 获取 TypeScript 类型
   */
  private getTypeScriptTypeFromSchema(schema: SchemaObject): string {
    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop()
      return refName || 'any'
    }

    if (schema.type) {
      switch (schema.type) {
        case 'string':
          return schema.enum ? schema.enum.map(v => `'${v}'`).join(' | ') : 'string'
        case 'number':
        case 'integer':
          return 'number'
        case 'boolean':
          return 'boolean'
        case 'array':
          const itemType = schema.items ? this.getTypeScriptTypeFromSchema(schema.items) : 'any'
          return `${itemType}[]`
        case 'object':
          return 'any'
        default:
          return 'any'
      }
    }

    if (schema.allOf || schema.anyOf || schema.oneOf) {
      return 'any'
    }

    return 'any'
  }

  /**
   * 生成操作相关的类型定义
   */
  private generateOperationTypes(): string[] {
    const types: string[] = []
    const processedTypes = new Set<string>()

    Object.entries(this.doc.paths).forEach(([path, pathItem]) => {
      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const

      methods.forEach(method => {
        const operation = pathItem[method]
        if (operation) {
          const functionName = this.generateFunctionNameFromPath(path, method)
          const requestTypeName = `${this.toPascalCase(functionName)}Request`
          const responseTypeName = `${this.toPascalCase(functionName)}Response`

          // 生成请求类型
          if (!processedTypes.has(requestTypeName)) {
            const requestType = this.generateRequestType(requestTypeName, operation)
            if (requestType) {
              types.push(requestType)
              types.push('')
              processedTypes.add(requestTypeName)
            }
          }

          // 生成响应类型
          if (!processedTypes.has(responseTypeName)) {
            const responseType = this.generateResponseType(responseTypeName, operation)
            if (responseType) {
              types.push(responseType)
              types.push('')
              processedTypes.add(responseTypeName)
            }
          }
        }
      })
    })

    return types
  }

  /**
   * 生成请求类型定义（TypeScript接口）
   */
  private generateRequestType(typeName: string, operation: OperationObject): string | null {
    const lines: string[] = []
    
    if (operation.summary) {
      lines.push(`/** ${operation.summary}的请求参数 */`)
    }
    
    lines.push(`export interface ${typeName} {`)

    // 分别处理不同类型的参数
    if (operation.parameters?.length) {
      const queryParams = operation.parameters.filter(p => p.in === 'query')
      const pathParams = operation.parameters.filter(p => p.in === 'path')
      const headerParams = operation.parameters.filter(p => p.in === 'header')
      
      // 查询参数和路径参数直接作为属性
      queryParams.concat(pathParams).forEach(param => {
        const tsType = param.schema ? this.getTypeScriptTypeFromSchema(param.schema) : 'string'
        const optional = param.required ? '' : '?'
        // 优先使用schema的title，然后是参数的description
        const commentText = (param.schema?.title) || param.description || ''
        const description = commentText || '[optional]'
        lines.push(`  /** ${description} */`)
        lines.push(`  ${param.name}${optional}: ${tsType}`)
      })
      
      // header参数作为headers对象
      if (headerParams.length > 0) {
        lines.push('  /** 请求头参数 */')
        lines.push('  headers?: {')
        headerParams.forEach(param => {
          const tsType = param.schema ? this.getTypeScriptTypeFromSchema(param.schema) : 'string'
          // 优先使用schema的title，然后是参数的description
          const commentText = (param.schema?.title) || param.description || ''
          const description = commentText || '[optional]'
          lines.push(`    /** ${description} */`)
          lines.push(`    ${param.name}?: ${tsType}`)
        })
        lines.push('  }')
      }
    }

    // 处理请求体
    if (operation.requestBody) {
      const requestBody = operation.requestBody as any
      const jsonSchema = requestBody.content?.['application/json']?.schema
      const formSchema = requestBody.content?.['application/x-www-form-urlencoded']?.schema
      const schema = jsonSchema || formSchema

      if (schema && schema.type === 'object' && schema.properties) {
        // 展开请求体属性
        Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
          const isRequired = schema.required?.includes(propName)
          const tsType = this.getTypeScriptTypeFromSchema(propSchema)
          const optional = isRequired ? '' : '?'
          // 优先使用title作为注释，如果没有title则使用description
          const commentText = propSchema.title || propSchema.description || ''
          const description = commentText || '[optional]'
          
          lines.push(`  /** ${description} */`)
          lines.push(`  ${propName}${optional}: ${tsType}`)
        })
      } else {
        // 对于非对象类型或没有属性定义的，使用通用body属性
        lines.push('  /** 请求体数据 */')
        lines.push('  body?: any')
      }
    }

    lines.push('}')
    return lines.length > 2 ? lines.join('\n') : null
  }

  /**
   * 生成响应类型定义（TypeScript接口）
   */
  private generateResponseType(typeName: string, operation: OperationObject): string | null {
    const lines: string[] = []
    
    if (operation.summary) {
      lines.push(`/** ${operation.summary}的响应数据 */`)
    }
    
    lines.push(`export interface ${typeName} {`)

    // 基础响应结构
    lines.push('  /** 响应状态码 */')
    lines.push('  code: number')
    lines.push('  /** 响应消息 */')
    lines.push('  message: string')
    
    // 生成具体的data类型定义
    const dataTypeName = `${typeName}Data`
    lines.push('  /** 响应数据 */')
    lines.push(`  data: ${dataTypeName}`)

    lines.push('}')
    
    // 生成data的嵌套类型定义
    const dataTypeDefinition = this.generateDataTypeDefinition(dataTypeName, operation)
    
    return dataTypeDefinition ? `${lines.join('\n')}\n\n${dataTypeDefinition}` : lines.join('\n')
  }

  /**
   * 生成data字段的嵌套类型定义（TypeScript接口）
   */
  private generateDataTypeDefinition(dataTypeName: string, operation: OperationObject): string | null {
    // 查找200响应的schema
    const response200 = operation.responses?.['200']
    if (!response200?.content) {
      return null
    }

    // 获取第一个content类型的schema
    const firstContentType = Object.values(response200.content)[0]
    if (!firstContentType?.schema) {
      return null
    }

    const schema = firstContentType.schema
    
    // 如果是引用类型，直接使用引用的类型名
    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop()
      return refName ? `export type ${dataTypeName} = ${refName}` : null
    }

    // 如果schema有properties，生成具体的类型定义
    if (schema.type === 'object' && schema.properties) {
      const lines: string[] = []
      
      if (schema.description) {
        lines.push(`/** ${schema.description} */`)
      }
      
      lines.push(`export interface ${dataTypeName} {`)

      Object.entries(schema.properties).forEach(([propName, propSchema]) => {
        const isRequired = schema.required?.includes(propName)
        const tsType = this.getTypeScriptTypeFromSchema(propSchema)
        const optional = isRequired ? '' : '?'
        // 优先使用title作为注释，如果没有title则使用description
        const commentText = propSchema.title || propSchema.description || ''
        const description = commentText || '[optional]'
        
        lines.push(`  /** ${description} */`)
        lines.push(`  ${propName}${optional}: ${tsType}`)
      })

      lines.push('}')
      return lines.join('\n')
    }

    // 如果是数组类型
    if (schema.type === 'array' && schema.items) {
      const itemType = this.getTypeScriptTypeFromSchema(schema.items)
      const lines: string[] = []
      
      if (schema.description) {
        lines.push(`/** ${schema.description} */`)
      }
      
      lines.push(`export type ${dataTypeName} = ${itemType}[]`)
      return lines.join('\n')
    }

    return null
  }
}

/**
 * 生成文件结构树
 */
function generateFileStructure(files: GeneratedFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = []
  const folderMap = new Map<string, FileTreeNode>()

  files.forEach(file => {
    const parts = file.path.split('/')
    let currentLevel = root
    let currentPath = ''

    // 处理文件夹
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      currentPath = currentPath ? `${currentPath}/${part}` : part

      let folder = folderMap.get(currentPath)
      if (!folder) {
        folder = {
          children: [],
          id: currentPath,
          name: part,
          path: currentPath,
          type: 'folder',
        }
        folderMap.set(currentPath, folder)
        currentLevel.push(folder)
      }

      currentLevel = folder.children!
    }

    // 添加文件
    const fileName = parts[parts.length - 1]
    currentLevel.push({
      content: file.content,
      id: file.path,
      name: fileName,
      path: file.path,
      type: 'file',
    })
  })

  return root
}