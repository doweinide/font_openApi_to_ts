// TypeScript/JavaScript 代码生成器
import { filterByTags } from './openapi-parser'
import { generateJavaScriptCode } from './javascript-generator'

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
 * 生成代码（根据配置选择 TypeScript 或 JavaScript）
 * @param options 生成选项
 * @returns 生成结果
 */
export function generateCode(options: GenerateOptions): GenerateResult {
  const { config } = options
  
  if (config.codeLanguage === 'javascript') {
    return generateJavaScriptCode(options)
  }
  
  return generateTypeScriptCode(options)
}

/**
 * 生成 TypeScript 代码
 * @param options 生成选项
 * @returns 生成结果
 */
export function generateTypeScriptCode(
  options: GenerateOptions,
): GenerateResult {
  const { config, openApiDoc } = options

  // 根据配置过滤文档
  const filteredDoc =
    config.outputTags.length > 0
      ? filterByTags(openApiDoc, config.outputTags)
      : openApiDoc

  const files: GeneratedFile[] = []
  const generator = new TypeScriptGenerator(filteredDoc, config)

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
 * TypeScript 代码生成器类
 */
class TypeScriptGenerator {
  private doc: OpenAPIDocument
  private config: GeneratorConfig
  private generatedTypes = new Set<string>()

  constructor(doc: OpenAPIDocument, config: GeneratorConfig) {
    this.doc = doc
    this.config = config
  }

  /**
   * 生成类型文件
   */
  generateTypesFile(): GeneratedFile {
    const types: string[] = []

    // 添加文件头注释
    if (this.config.includeComments) {
      types.push('// 自动生成的类型定义文件')
      types.push('// 请勿手动修改此文件\n')
    }

    // 生成 Schema 类型
    if (this.doc.components?.schemas) {
      Object.entries(this.doc.components.schemas).forEach(([name, schema]) => {
        types.push(this.generateSchemaType(name, schema))
      })
    }

    // 生成请求和响应类型
    const operationTypes = this.generateOperationTypes()
    types.push(...operationTypes)

    return {
      content: types.join('\n\n'),
      path: 'types.ts',
      type: 'typescript',
    }
  }

  /**
   * 生成工具文件
   */
  generateUtilsFile(): GeneratedFile {
    const utils: string[] = []

    if (this.config.includeComments) {
      utils.push('// HTTP 请求工具')
      utils.push('// 请根据项目需要修改此文件\n')
    }

    // 基础请求接口
    utils.push('export interface RequestConfig {')
    utils.push('  url: string;')
    utils.push('  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";')
    utils.push('  params?: Record<string, any>;')
    utils.push('  data?: any;')
    utils.push('  headers?: Record<string, string>;')
    utils.push('}\n')

    // 响应接口
    utils.push('export interface ApiResponse<T = any> {')
    utils.push('  data: T;')
    utils.push('  status: number;')
    utils.push('  statusText: string;')
    utils.push('}\n')

    // 请求函数模板
    if (this.config.useAsync) {
      utils.push(
        'export async function request<T = any>(config: RequestConfig): Promise<T> {',
      )
      utils.push('  // TODO: 实现具体的请求逻辑')
      utils.push('  // 这里需要根据项目使用的 HTTP 客户端进行实现')
      utils.push('  throw new Error("请实现 request 函数");')
      utils.push('}')
    } else {
      utils.push(
        'export function request<T = any>(config: RequestConfig): Promise<T> {',
      )
      utils.push('  // TODO: 实现具体的请求逻辑')
      utils.push('  return Promise.reject(new Error("请实现 request 函数"));')
      utils.push('}')
    }

    return {
      content: utils.join('\n'),
      path: 'utils/request.ts',
      type: 'typescript',
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
          path: `${fileName}/index.ts`,
          type: 'typescript',
        })
      } else {
        files.push({
          content,
          path: `${fileName}.ts`,
          type: 'typescript',
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

    // 导出类型
    if (this.config.separateTypes) {
      exports.push('export * from "./types";')
    }

    // 导出工具
    if (this.config.generateUtils) {
      exports.push('export * from "./utils/request";')
    }

    // 导出 API 文件
    apiFiles.forEach(file => {
      const fileName = file.path.replace('.ts', '')
      exports.push(`export * from "./${fileName}";`)
    })

    return {
      content: exports.join('\n'),
      path: 'index.ts',
      type: 'typescript',
    }
  }

  /**
   * 生成 Schema 类型
   */
  private generateSchemaType(name: string, schema: SchemaObject): string {
    const typeName = this.formatTypeName(name)
    const typeDefinition = this.schemaToTypeScript(schema)

    let result = ''
    if (this.config.includeComments && schema.description) {
      result += `/**\n * ${schema.description}\n */\n`
    }

    result += `export interface ${typeName} ${typeDefinition}`

    this.generatedTypes.add(typeName)
    return result
  }

  /**
   * 生成操作类型
   */
  private generateOperationTypes(): string[] {
    const types: string[] = []

    Object.entries(this.doc.paths).forEach(([path, pathItem]) => {
      const methods = ['get', 'post', 'put', 'delete', 'patch'] as const

      methods.forEach(method => {
        const operation = pathItem[method]
        if (operation) {
          const operationTypes = this.generateOperationTypeDefinitions(
            path,
            method,
            operation,
          )
          types.push(...operationTypes)
        }
      })
    })

    return types
  }

  /**
   * 生成操作类型定义
   */
  private generateOperationTypeDefinitions(
    path: string,
    method: string,
    operation: OperationObject,
  ): string[] {
    const types: string[] = []
    // 使用基于路径的函数名生成类型名称
    const functionName = this.generateFunctionNameFromPath(path, method)

    // 生成请求参数类型
    const requestType = this.generateRequestType(functionName, operation)
    if (requestType) {
      types.push(requestType)
    }

    // 生成响应类型
    const responseTypes = this.generateResponseTypes(functionName, operation)
    types.push(...responseTypes)

    return types
  }

  /**
   * 生成请求类型
   */
  private generateRequestType(
    functionName: string,
    operation: OperationObject,
  ): string | null {
    const params: string[] = []

    // 只处理 query 和 path 参数，排除 header 参数
    if (operation.parameters) {
      operation.parameters.forEach(param => {
        // 跳过 header 参数
        if (param.in === 'header') {
          return
        }
        const paramType = this.parameterToTypeScript(param)
        const optional = param.required ? '' : '?'
        const comment = param.description ? ` // ${param.description}` : ''
        params.push(`  ${param.name}${optional}: ${paramType};${comment}`)
      })
    }

    // 处理请求体
    if (operation.requestBody) {
      const requestBody = operation.requestBody as any

      // 尝试展开请求体属性（支持 JSON 和 form-urlencoded 格式）
      const jsonSchema = requestBody.content?.['application/json']?.schema
      const formSchema =
        requestBody.content?.['application/x-www-form-urlencoded']?.schema
      const schema = jsonSchema || formSchema

      if (schema) {
        // 如果是对象类型且有属性定义，展开属性
        if (schema.type === 'object' && schema.properties) {
          Object.entries(schema.properties).forEach(
            ([propName, propSchema]: [string, any]) => {
              const propType = this.schemaToTypeScript(propSchema)
              const required = schema.required?.includes(propName)
              const optional = required ? '' : '?'
              const comment = propSchema.description
                ? ` // ${propSchema.description}`
                : ''
              params.push(`  ${propName}${optional}: ${propType};${comment}`)
            },
          )
        } else {
          // 对于非对象类型或没有属性定义的，直接使用 schemaToTypeScript 生成类型
          const bodyType = this.schemaToTypeScript(schema)
          params.push(`  body: ${bodyType};`)
        }
      } else {
        // 没有 schema 的情况，使用 any
        params.push(`  body: any;`)
      }
    }

    if (params.length === 0) {
      return null
    }

    const typeName = this.formatTypeName(`${functionName}Request`)
    let result = ''

    if (this.config.includeComments) {
      result += `/**\n * ${operation.summary || functionName} 请求参数\n */\n`
    }

    result += `export interface ${typeName} {\n${params.join('\n')}\n}`

    return result
  }

  /**
   * 生成响应类型
   */
  private generateResponseTypes(
    functionName: string,
    operation: OperationObject,
  ): string[] {
    const types: string[] = []

    Object.entries(operation.responses).forEach(([statusCode, response]) => {
      if (response.content) {
        Object.entries(response.content).forEach(
          ([mediaType, mediaTypeObj]) => {
            if (mediaTypeObj.schema) {
              const responseType = this.schemaToTypeScript(mediaTypeObj.schema)
              const typeName = this.formatTypeName(`${functionName}Response`)

              let result = ''
              if (this.config.includeComments) {
                result += `/**\n * ${operation.summary || functionName} 响应数据\n */\n`
              }

              result += `export interface ${typeName} ${responseType}`
              types.push(result)
            }
          },
        )
      }
    })

    return types
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
          // 或者根据业务需求，可以选择使用所有标签
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
    const usedTypes = new Set<string>()

    // 添加导入语句
    content.push(this.config.importTemplate)

    // 收集该文件中使用的类型
    if (this.config.separateTypes) {
      operations.forEach(({ method, operation, path }) => {
        const functionName = this.generateFunctionNameFromPath(path, method)

        // 收集请求类型
        if (operation.parameters?.length || operation.requestBody) {
          usedTypes.add(this.formatTypeName(`${functionName}Request`))
        }

        // 收集响应类型
        usedTypes.add(this.formatTypeName(`${functionName}Response`))

        // 收集Schema引用的类型
        this.collectSchemaTypes(operation, usedTypes)
      })

      // 生成按需导入语句
      if (usedTypes.size > 0) {
        const typesList = Array.from(usedTypes).sort().join(', ')
        // 检查是否为中文tag生成的文件夹结构，如果是则调整导入路径
        const importPath = this.isChinese(tag) ? '../types' : './types'
        content.push(`import type { ${typesList} } from '${importPath}';`)
      }
    }

    content.push('')

    // 如果不分离类型文件，生成相关的类型定义
    if (!this.config.separateTypes) {
      const typeDefinitions: string[] = []

      operations.forEach(({ method, operation, path }) => {
        const operationTypes = this.generateOperationTypeDefinitions(
          path,
          method,
          operation,
        )
        typeDefinitions.push(...operationTypes)
      })

      if (typeDefinitions.length > 0) {
        if (this.config.includeComments) {
          content.push('// ============== 类型定义 ==============')
          content.push('')
        }
        content.push(...typeDefinitions)
        content.push('')
        if (this.config.includeComments) {
          content.push('// ============== API 函数 ==============')
          content.push('')
        }
      }
    }

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
    const paramType = hasParams
      ? `params: ${this.formatTypeName(functionName + 'Request')}`
      : ''

    // 构建返回类型
    const returnType = `Promise<${this.formatTypeName(functionName + 'Response')}>`

    // 构建函数签名
    const signature = this.config.useAsync
      ? `export const ${functionName} = async (${paramType}): ${returnType} => {`
      : `export function ${functionName}(${paramType}): ${returnType} {`

    const lines: string[] = []

    // 添加注释
    if (this.config.includeComments) {
      lines.push('/**')
      lines.push(` * ${operation.summary || functionName}`)
      if (operation.description) {
        lines.push(` * ${operation.description}`)
      }
      lines.push(' */')
    }

    lines.push(signature)

    // 构建请求配置
    const requestConfig = this.buildRequestConfig(path, method, operation)
    lines.push(
      `  const response = await request<${this.formatTypeName(functionName + 'Response')}>({`,
    )
    lines.push(`    url: '${path}',`)
    lines.push(`    method: '${method.toUpperCase()}',`)

    if (requestConfig.params) {
      lines.push(`    params: ${requestConfig.params},`)
    }

    if (requestConfig.data) {
      lines.push(`    data: ${requestConfig.data},`)
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
   * 收集Schema中引用的类型
   */
  private collectSchemaTypes(
    operation: OperationObject,
    usedTypes: Set<string>,
  ): void {
    // 收集参数中的Schema类型
    if (operation.parameters) {
      operation.parameters.forEach(param => {
        if (param.schema && param.schema.$ref) {
          const typeName = this.extractTypeNameFromRef(param.schema.$ref)
          if (typeName) {
            usedTypes.add(this.formatTypeName(typeName))
          }
        }
      })
    }

    // 收集请求体中的Schema类型
    if (operation.requestBody?.content) {
      Object.values(operation.requestBody.content).forEach(mediaType => {
        if (mediaType.schema?.$ref) {
          const typeName = this.extractTypeNameFromRef(mediaType.schema.$ref)
          if (typeName) {
            usedTypes.add(this.formatTypeName(typeName))
          }
        }
      })
    }

    // 收集响应中的Schema类型
    if (operation.responses) {
      Object.values(operation.responses).forEach(response => {
        if (response.content) {
          Object.values(response.content).forEach(mediaType => {
            if (mediaType.schema?.$ref) {
              const typeName = this.extractTypeNameFromRef(
                mediaType.schema.$ref,
              )
              if (typeName) {
                usedTypes.add(this.formatTypeName(typeName))
              }
            }
          })
        }
      })
    }
  }

  /**
   * 从$ref中提取类型名称
   */
  private extractTypeNameFromRef(ref: string): string | null {
    const match = ref.match(/#\/components\/schemas\/(.+)$/)
    return match ? match[1] : null
  }

  /**
   * 构建请求配置
   */
  private buildRequestConfig(
    path: string,
    method: string,
    operation: OperationObject,
  ): { params?: string; data?: string } {
    const config: { params?: string; data?: string } = {}

    // 处理查询参数和路径参数
    const queryParams = operation.parameters?.filter(p => p.in === 'query')
    const pathParams = operation.parameters?.filter(p => p.in === 'path')

    if (queryParams?.length) {
      config.params = 'params'
    }

    // 处理请求体
    if (operation.requestBody && ['post', 'put', 'patch'].includes(method)) {
      config.data = 'params.body'
    }

    return config
  }

  /**
   * Schema 转 TypeScript 类型
   */
  private schemaToTypeScript(schema: SchemaObject): string {
    if (schema.$ref) {
      const refName = schema.$ref.split('/').pop()
      return this.formatTypeName(refName || 'unknown')
    }

    switch (schema.type) {
      case 'string':
        return schema.enum
          ? schema.enum.map(v => `"${v}"`).join(' | ')
          : 'string'
      case 'number':
      case 'integer':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'array': {
        const itemType = schema.items
          ? this.schemaToTypeScript(schema.items)
          : 'any'
        return `${itemType}[]`
      }
      case 'object':
        if (schema.properties) {
          const props = Object.entries(schema.properties).map(([key, prop]) => {
            const optional = schema.required?.includes(key) ? '' : '?'
            const propType = this.schemaToTypeScript(prop)
            // 优先使用title作为注释，如果没有title则使用description
            let comment = ''
            if (this.config.includeComments) {
              const commentText = prop.title || prop.description
              if (commentText) {
                comment = ` // ${commentText}`
              }
            }
            return `  ${key}${optional}: ${propType};${comment}`
          })
          return `{\n${props.join('\n')}\n}`
        }
        return 'Record<string, any>'
      default:
        return 'any'
    }
  }

  /**
   * 参数转 TypeScript 类型
   */
  private parameterToTypeScript(param: ParameterObject): string {
    if (param.schema) {
      return this.schemaToTypeScript(param.schema)
    }
    return 'any'
  }

  /**
   * 请求体转 TypeScript 类型
   */
  private requestBodyToTypeScript(requestBody: any): string {
    if (requestBody.content) {
      const jsonContent = requestBody.content['application/json']
      if (jsonContent?.schema) {
        return this.schemaToTypeScript(jsonContent.schema)
      }
    }
    return 'any'
  }

  /**
   * 格式化类型名称
   */
  private formatTypeName(name: string): string {
    const formatted = name.replace(/[^a-zA-Z0-9]/g, '_')
    if (this.config.typeNaming === 'PascalCase') {
      return this.toPascalCase(formatted)
    } else if (this.config.typeNaming === 'snake_case') {
      return this.toSnakeCase(formatted)
    } else {
      return this.toCamelCase(formatted)
    }
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
   * 生成操作 ID（保留用于兼容性）
   */
  private generateOperationId(path: string, method: string): string {
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'))
    const baseName =
      pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'api'
    return `${method}${this.toPascalCase(baseName)}`
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
