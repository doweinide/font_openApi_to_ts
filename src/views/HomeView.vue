<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <div class="container mx-auto px-6 py-12">
      <!-- 页面标题 -->
      <div class="mb-12 text-center">
        <h1
          class="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent"
        >
          OpenAPI to TypeScript 转换器
        </h1>
        <p class="mx-auto max-w-2xl text-xl leading-relaxed text-slate-600">
          将 OpenAPI 3.0/3.1 规范自动转换为 TypeScript 请求模板，支持 JSON 和
          YAML 格式
        </p>
      </div>

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <!-- 文件上传区域 -->
        <div class="lg:col-span-2">
          <el-card
            class="overflow-hidden rounded-2xl border-0 bg-white/80 shadow-xl backdrop-blur-sm"
          >
            <template #header>
              <div
                class="-mx-6 -mt-6 mb-6 flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white"
              >
                <el-icon class="mr-3 text-xl"><Upload /></el-icon>
                <span class="text-xl font-semibold">上传 OpenAPI 文档</span>
              </div>
            </template>

            <el-tabs v-model="activeTab" class="mb-4">
              <el-tab-pane label="文件上传" name="file">
                <el-upload
                  ref="uploadRef"
                  class="upload-demo"
                  drag
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :show-file-list="false"
                  accept=".json,.yaml,.yml"
                >
                  <div class="upload-area">
                    <el-icon
                      class="el-icon--upload mb-4 text-6xl text-blue-500"
                    >
                      <upload-filled />
                    </el-icon>
                    <div class="el-upload__text text-lg">
                      拖拽文件到此处或 <em>点击上传</em>
                    </div>
                    <div class="el-upload__tip mt-2 text-sm text-gray-500">
                      支持 .json、.yaml、.yml 格式的 OpenAPI 文档
                    </div>
                  </div>
                </el-upload>

                <!-- 文件信息显示 -->
                <div
                  v-if="uploadedFile && uploadedFile.type === 'file'"
                  class="mt-4"
                >
                  <el-alert
                    :title="`已上传文件: ${uploadedFile.name}`"
                    type="success"
                    :closable="false"
                    show-icon
                  />
                </div>
              </el-tab-pane>

              <el-tab-pane label="URL 输入" name="url">
                <div class="space-y-4">
                  <el-input
                    v-model="urlInput"
                    placeholder="请输入 OpenAPI 文档的 URL 地址"
                    size="large"
                    clearable
                  >
                    <template #prepend>
                      <el-icon><Link /></el-icon>
                    </template>
                  </el-input>

                  <!-- 帮助说明 -->
                  <div
                    class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3"
                  >
                    <div class="flex items-start space-x-2">
                      <el-icon class="mt-0.5 text-blue-500"
                        ><InfoFilled
                      /></el-icon>
                      <div class="text-sm text-blue-700">
                        <p class="mb-1 font-medium">跨域限制说明：</p>
                        <p class="mb-2">
                          由于浏览器安全策略，部分URL可能无法直接访问。如遇到跨域问题，请尝试：
                        </p>
                        <ul
                          class="mb-3 list-inside list-disc space-y-1 text-xs"
                        >
                          <li>下载OpenAPI文件后使用文件上传功能</li>
                          <li>使用支持CORS的API地址（如GitHub Raw链接）</li>
                          <li>联系API提供方添加CORS支持</li>
                        </ul>
                        <p class="mb-1 font-medium">
                          通常支持直接访问的URL类型：
                        </p>
                        <ul class="list-inside list-disc space-y-1 text-xs">
                          <li>
                            GitHub
                            Raw文件：https://raw.githubusercontent.com/...
                          </li>
                          <li>公共CDN链接：https://cdn.jsdelivr.net/...</li>
                          <li>已配置CORS的API文档地址</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <el-button
                    type="primary"
                    :loading="isLoadingUrl"
                    :disabled="!urlInput.trim()"
                    size="large"
                    class="w-full"
                    @click="handleUrlLoad"
                  >
                    <el-icon class="mr-2"><Download /></el-icon>
                    加载 OpenAPI 文档
                  </el-button>

                  <!-- URL 加载成功显示 -->
                  <div
                    v-if="uploadedFile && uploadedFile.type === 'url'"
                    class="mt-4"
                  >
                    <el-alert
                      :title="`已加载 URL: ${uploadedFile.name}`"
                      type="success"
                      :closable="false"
                      show-icon
                    />
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>

            <!-- 文档预览 -->
            <div v-if="parsedDoc" class="mt-6">
              <el-divider content-position="left">
                <span class="text-sm font-medium text-slate-700">文档信息</span>
              </el-divider>
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <span class="font-medium text-slate-700">标题:</span>
                    <span class="ml-2 text-slate-600">{{
                      parsedDoc.info.title
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-slate-700">版本:</span>
                    <span class="ml-2 text-slate-600">{{
                      parsedDoc.info.version
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-slate-700">接口数量:</span>
                    <span class="ml-2 text-slate-600">{{
                      getPathCount()
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-slate-700">标签数量:</span>
                    <span class="ml-2 text-slate-600">{{
                      parsedDoc.tags?.length || 0
                    }}</span>
                  </div>
                </div>
                <div v-if="parsedDoc.info.description" class="mt-3">
                  <span class="font-medium text-slate-700">描述:</span>
                  <p class="mt-1 text-slate-600">
                    {{ parsedDoc.info.description }}
                  </p>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 示例效果展示卡片 -->
          <el-card
            class="mt-10 overflow-hidden rounded-2xl border-0 bg-white/80 shadow-xl backdrop-blur-sm"
          >
            <template #header>
              <div
                class="-mx-6 -mt-6 mb-6 flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 text-white"
              >
                <el-icon class="mr-3 text-xl"><View /></el-icon>
                <span class="text-xl font-semibold">生成效果预览</span>
              </div>
            </template>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-7">
              <!-- 左侧目录结构 -->
              <div class="lg:col-span-2">
                <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4
                    class="mb-3 flex items-center text-sm font-semibold text-slate-700"
                  >
                    <el-icon class="mr-2 text-emerald-500"
                      ><FolderOpened
                    /></el-icon>
                    文件目录结构
                  </h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center text-slate-600">
                      <el-icon class="mr-2 text-blue-500"><Folder /></el-icon>
                      <span>src/</span>
                    </div>
                    <div class="ml-4 space-y-1">
                      <div class="flex items-center text-slate-600">
                        <el-icon class="mr-2 text-blue-500"><Folder /></el-icon>
                        <span>api/</span>
                      </div>
                      <div class="ml-4 space-y-1">
                        <div class="flex items-center text-slate-600">
                          <el-icon class="mr-2 text-green-500"
                            ><Document
                          /></el-icon>
                          <span>user.ts</span>
                        </div>
                        <div class="flex items-center text-slate-600">
                          <el-icon class="mr-2 text-green-500"
                            ><Document
                          /></el-icon>
                          <span>product.ts</span>
                        </div>
                        <div class="flex items-center text-slate-600">
                          <el-icon class="mr-2 text-green-500"
                            ><Document
                          /></el-icon>
                          <span>order.ts</span>
                        </div>
                        <div class="flex items-center text-slate-600">
                          <el-icon class="mr-2 text-purple-500"
                            ><Document
                          /></el-icon>
                          <span>index.ts</span>
                        </div>
                      </div>
                      <div class="flex items-center text-slate-600">
                        <el-icon class="mr-2 text-orange-500"
                          ><Document
                        /></el-icon>
                        <span>types.ts</span>
                      </div>
                      <div class="flex items-center text-slate-600">
                        <el-icon class="mr-2 text-blue-500"><Folder /></el-icon>
                        <span>utils/</span>
                      </div>
                      <div class="ml-4 space-y-1">
                        <div class="flex items-center text-slate-600">
                          <el-icon class="mr-2 text-green-500"
                            ><Document
                          /></el-icon>
                          <span>request.ts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧代码示例 -->
              <div class="lg:col-span-5">
                <div class="sticky top-8">
                  <el-tabs v-model="previewTab" class="preview-tabs">
                    <el-tab-pane
                      label="生成的 API 函数(不分离类型模式)"
                      name="api"
                    >
                      <div
                        class="h-96 overflow-hidden rounded-lg border border-slate-200"
                      >
                        <div
                          ref="apiEditorContainer"
                          class="h-full w-full"
                        ></div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane
                      label="统一类型定义(分离类型模式)"
                      name="types"
                    >
                      <div
                        class="h-96 overflow-hidden rounded-lg border border-slate-200"
                      >
                        <div
                          ref="typesEditorContainer"
                          class="h-full w-full"
                        ></div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 配置面板 -->
        <div class="lg:col-span-1">
          <el-card
            class="sticky top-8 overflow-hidden rounded-2xl border-0 bg-white/80 shadow-xl backdrop-blur-sm"
          >
            <template #header>
              <div
                class="-mx-6 -mt-6 flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white"
              >
                <el-icon class="mr-3 text-xl"><Setting /></el-icon>
                <span class="text-xl font-semibold">生成配置</span>
              </div>
            </template>

            <el-form :model="config" label-position="top" class="space-y-4">
              <!-- Tags 配置 -->
              <el-form-item label="选择 Tags">
                <el-select
                  v-model="config.outputTags"
                  multiple
                  placeholder="选择要生成的 tags（留空表示全部）"
                  class="w-full"
                  :disabled="!availableTags.length"
                >
                  <el-option
                    v-for="tag in availableTags"
                    :key="tag"
                    :label="tag"
                    :value="tag"
                  />
                </el-select>
              </el-form-item>

              <!-- 导入语句配置 -->
              <el-form-item label="导入语句模板">
                <el-input
                  v-model="config.importTemplate"
                  type="textarea"
                  :rows="2"
                  placeholder="import { request } from '../utils/request';"
                />
              </el-form-item>

              <!-- 请求工具路径 -->
              <el-form-item label="请求工具路径">
                <el-input
                  v-model="config.requestUtilPath"
                  placeholder="../utils/request"
                />
              </el-form-item>

              <!-- 命名规则 -->
              <el-form-item label="函数命名规则">
                <el-radio-group v-model="config.functionNaming" class="w-full">
                  <el-radio value="camelCase">camelCase</el-radio>
                  <el-radio value="snake_case">snake_case</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="类型命名规则">
                <el-radio-group v-model="config.typeNaming" class="w-full">
                  <el-radio value="PascalCase">PascalCase</el-radio>
                  <el-radio value="camelCase">camelCase</el-radio>
                  <el-radio value="snake_case">snake_case</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 文件结构配置 -->
              <el-divider content-position="left">
                <span class="text-sm text-slate-700">文件结构</span>
              </el-divider>

              <el-form-item>
                <el-checkbox v-model="config.separateTypes"
                  >分离类型文件</el-checkbox
                >
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="config.generateIndex"
                  >生成 index.ts</el-checkbox
                >
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="config.generateUtils"
                  >生成工具文件</el-checkbox
                >
              </el-form-item>

              <!-- 代码风格配置 -->
              <el-divider content-position="left">
                <span class="text-sm text-slate-700">代码风格</span>
              </el-divider>

              <el-form-item>
                <el-checkbox v-model="config.useAsync"
                  >使用 async/await</el-checkbox
                >
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="config.includeComments"
                  >包含注释</el-checkbox
                >
              </el-form-item>

              <el-form-item label="导出方式">
                <el-radio-group v-model="config.exportStyle" class="w-full">
                  <el-radio value="named">命名导出</el-radio>
                  <el-radio value="default">默认导出</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>

            <!-- 缓存管理 -->
            <el-divider content-position="left">
              <span class="text-sm text-slate-700">缓存管理</span>
            </el-divider>

            <el-button
              type="danger"
              size="small"
              class="mb-4 w-full"
              :disabled="!hasCachedData"
              @click="handleClearCache"
            >
              <el-icon class="mr-2"><Delete /></el-icon>
              清除缓存数据
            </el-button>

            <!-- 生成按钮 -->
            <el-button
              type="primary"
              size="small"
              class="!ml-0 w-full"
              :disabled="!parsedDoc"
              :loading="isGenerating"
              @click="handleGenerate"
            >
              <el-icon class="mr-2"><Tools /></el-icon>
              生成 TypeScript 代码
            </el-button>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    Delete,
    Document,
    Download,
    Folder,
    FolderOpened,
    InfoFilled,
    Link,
    Setting,
    Tools,
    Upload,
    UploadFilled,
    View,
  } from '@element-plus/icons-vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import * as monaco from 'monaco-editor'

  // 配置 Monaco Editor workers
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import type {
    GeneratorConfig,
    OpenAPIDocument,
    UploadFile,
  } from '@/types/openapi'
  import { parseOpenAPI } from '@/utils/openapi-parser'
  import { generateTypeScriptCode } from '@/utils/typescript-generator'

  // 设置 Monaco Editor 环境
  self.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker()
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker()
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker()
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker()
      }
      return new editorWorker()
    },
  }

  const router = useRouter()

  // 响应式数据
  const activeTab = ref('file')
  const previewTab = ref('api')
  const urlInput = ref('')
  const isLoadingUrl = ref(false)
  const isGenerating = ref(false)
  const uploadedFile = ref<UploadFile>()
  const parsedDoc = ref<OpenAPIDocument>()

  // Monaco Editor 相关
  const apiEditorContainer = ref<HTMLElement>()
  const typesEditorContainer = ref<HTMLElement>()
  let apiEditor: monaco.editor.IStandaloneCodeEditor | null = null
  let typesEditor: monaco.editor.IStandaloneCodeEditor | null = null

  // 配置对象
  const config = reactive<GeneratorConfig>({
    excludeTags: [],
    exportStyle: 'named',
    functionNaming: 'camelCase',
    generateIndex: true,
    generateUtils: true,
    importTemplate: "import { request } from '../utils/request';",
    includeComments: true,
    outputTags: [],
    requestUtilPath: '../utils/request',
    separateTypes: true,
    typeNaming: 'PascalCase',
    useAsync: true,
  })

  // 计算属性
  const availableTags = computed(() => {
    if (!parsedDoc.value?.tags) return []
    return parsedDoc.value.tags.map(tag => tag.name)
  })

  const hasCachedData = computed(() => {
    return (
      localStorage.getItem('openapi_config') ||
      localStorage.getItem('openapi_file')
    )
  })

  // 示例代码
  const apiExampleCode = computed(() => {
    return `import { request } from '../utils/request';

// ============== 类型定义 ==============

/**
 * 根据ID获取用户信息 请求参数
 */
export interface GetUserByIdRequest {
  id: number;
}

/**
 * 根据ID获取用户信息 响应数据
 */
export interface GetUserByIdResponse {
  success: boolean;
  data: User;
  message?: string;
}

/**
 * 创建新用户 请求参数
 */
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

/**
 * 创建新用户 响应数据
 */
export interface CreateUserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// ============== API 函数 ==============

/**
 * 根据ID获取用户信息
 * @param params 请求参数
 */
export const getUserById = async (
  params: GetUserByIdRequest
): Promise<GetUserByIdResponse> => {
  return request({
    url: \`/api/users/\${params.id}\`,
    method: 'GET',
  });
};

/**
 * 创建新用户
 * @param data 用户数据
 */
export const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  return request({
    url: '/api/users',
    method: 'POST',
    data,
  });
};`
  })

  const typesExampleCode = computed(() => {
    return `// 基础类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

// 请求参数类型
export interface GetUserByIdRequest {
  id: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  id: number;
  username?: string;
  email?: string;
  avatar?: string;
}

// 响应类型
export interface GetUserByIdResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface CreateUserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

// 分页相关类型
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}`
  })

  // 方法
  const handleFileChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const content = e.target?.result as string
        uploadedFile.value = {
          content,
          name: file.name,
          type: 'file',
        }
        parseDocument(content)
      } catch (error) {
        ElMessage.error('文件读取失败')
      }
    }
    reader.readAsText(file.raw)
  }

  const handleUrlLoad = async () => {
    if (!urlInput.value.trim()) return

    isLoadingUrl.value = true
    try {
      const response = await axios.get(urlInput.value)
      const content =
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)

      uploadedFile.value = {
        content,
        name: urlInput.value,
        type: 'url',
      }
      parseDocument(content)
      ElMessage.success('OpenAPI 文档加载成功')
    } catch (error: any) {
      console.error('URL loading error:', error)

      // 检测跨域错误
      if (
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('CORS') ||
        error.message?.includes('Cross-Origin') ||
        (error.response === undefined && error.request)
      ) {
        ElMessage({
          duration: 8000,
          message:
            '遇到跨域限制，无法直接访问该URL。建议：1) 下载OpenAPI文件后上传；2) 使用支持CORS的API地址',
          showClose: true,
          type: 'warning',
        })
      } else if (error.response?.status === 404) {
        ElMessage.error('URL不存在，请检查网址是否正确')
      } else if (error.response?.status >= 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        ElMessage.error('网络连接失败，请检查网址和网络连接')
      } else {
        ElMessage.error('URL 加载失败，请检查网址是否正确')
      }
    } finally {
      isLoadingUrl.value = false
    }
  }

  const parseDocument = (content: string) => {
    try {
      const result = parseOpenAPI({ content })
      if (result.success && result.data) {
        parsedDoc.value = result.data
        // 重置 tags 选择
        config.outputTags = []
        ElMessage.success('OpenAPI 文档解析成功')
      } else {
        ElMessage.error(result.error || '文档解析失败')
      }
    } catch (error) {
      ElMessage.error('文档格式不正确')
    }
  }

  const getPathCount = () => {
    if (!parsedDoc.value?.paths) return 0
    return Object.keys(parsedDoc.value.paths).length
  }

  const handleGenerate = async () => {
    if (!parsedDoc.value) {
      ElMessage.warning('请先上传 OpenAPI 文档')
      return
    }

    isGenerating.value = true
    try {
      // 保存配置到localStorage
      saveConfigToCache()

      const result = generateTypeScriptCode({
        config,
        openApiDoc: parsedDoc.value,
      })

      // 将生成结果存储到 sessionStorage 中
      sessionStorage.setItem('generatedFiles', JSON.stringify(result.files))
      sessionStorage.setItem('fileStructure', JSON.stringify(result.structure))

      // 跳转到生成结果页面
      await router.push('/generate')

      ElMessage.success('代码生成成功')
    } catch (error) {
      ElMessage.error('代码生成失败')
      console.error('Generation error:', error)
    } finally {
      isGenerating.value = false
    }
  }

  // 缓存管理方法
  const saveConfigToCache = () => {
    try {
      localStorage.setItem('openapi_config', JSON.stringify(config))
      if (uploadedFile.value) {
        localStorage.setItem('openapi_file', JSON.stringify(uploadedFile.value))
      }
      if (urlInput.value) {
        localStorage.setItem('openapi_url', urlInput.value)
      }
    } catch (error) {
      console.warn('保存配置到缓存失败:', error)
    }
  }

  const loadConfigFromCache = () => {
    try {
      // 恢复配置
      const cachedConfig = localStorage.getItem('openapi_config')
      if (cachedConfig) {
        const parsedConfig = JSON.parse(cachedConfig)
        Object.assign(config, parsedConfig)
      }

      // 恢复文件
      const cachedFile = localStorage.getItem('openapi_file')
      if (cachedFile) {
        const parsedFile = JSON.parse(cachedFile)
        uploadedFile.value = parsedFile
        if (parsedFile.content) {
          parseDocument(parsedFile.content)
        }
      }

      // 恢复URL
      const cachedUrl = localStorage.getItem('openapi_url')
      if (cachedUrl) {
        urlInput.value = cachedUrl
      }
    } catch (error) {
      console.warn('从缓存恢复配置失败:', error)
    }
  }

  const handleClearCache = () => {
    try {
      localStorage.removeItem('openapi_config')
      localStorage.removeItem('openapi_file')
      localStorage.removeItem('openapi_url')

      // 重置所有数据
      Object.assign(config, {
        excludeTags: [],
        exportStyle: 'named',
        functionNaming: 'camelCase',
        generateIndex: true,
        generateUtils: true,
        importTemplate: "import { request } from '../utils/request';",
        includeComments: true,
        outputTags: [],
        requestUtilPath: '../utils/request',
        separateTypes: true,
        typeNaming: 'PascalCase',
        useAsync: true,
      })

      uploadedFile.value = undefined
      parsedDoc.value = undefined
      urlInput.value = ''
      activeTab.value = 'file'

      ElMessage.success('缓存数据已清除')
    } catch (error) {
      ElMessage.error('清除缓存失败')
      console.error('Clear cache error:', error)
    }
  }

  // Monaco Editor 方法
  const initApiEditor = async () => {
    if (!apiEditorContainer.value) return

    // 销毁现有编辑器
    if (apiEditor) {
      apiEditor.dispose()
    }

    // 创建新编辑器
    apiEditor = monaco.editor.create(apiEditorContainer.value, {
      automaticLayout: true,
      fontSize: 13,
      language: 'typescript',
      lineNumbers: 'on',
      minimap: { enabled: false },
      padding: { bottom: 12, top: 12 },
      readOnly: true,
      scrollbar: {
        horizontal: 'auto',
        vertical: 'auto',
      },
      scrollBeyondLastLine: false,
      theme: 'vs',
      value: apiExampleCode.value,
      wordWrap: 'on',
    })
  }

  const initTypesEditor = async () => {
    if (!typesEditorContainer.value) return

    // 销毁现有编辑器
    if (typesEditor) {
      typesEditor.dispose()
    }

    // 创建新编辑器
    typesEditor = monaco.editor.create(typesEditorContainer.value, {
      automaticLayout: true,
      fontSize: 13,
      language: 'typescript',
      lineNumbers: 'on',
      minimap: { enabled: false },
      padding: { bottom: 12, top: 12 },
      readOnly: true,
      scrollbar: {
        horizontal: 'auto',
        vertical: 'auto',
      },
      scrollBeyondLastLine: false,
      theme: 'vs',
      value: typesExampleCode.value,
      wordWrap: 'on',
    })
  }

  const initCurrentEditor = async () => {
    await nextTick()
    if (previewTab.value === 'api') {
      initApiEditor()
    } else if (previewTab.value === 'types') {
      initTypesEditor()
    }
  }

  const cleanupEditors = () => {
    if (apiEditor) {
      apiEditor.dispose()
      apiEditor = null
    }
    if (typesEditor) {
      typesEditor.dispose()
      typesEditor = null
    }
  }

  // 监听 tab 切换
  watch(previewTab, async () => {
    await initCurrentEditor()
  })

  // 生命周期
  onMounted(async () => {
    // 页面加载时恢复缓存的配置
    loadConfigFromCache()

    // 初始化编辑器
    await nextTick()
    await initCurrentEditor()
  })

  // 组件卸载时清理编辑器
  watch(() => router.currentRoute.value, cleanupEditors)
</script>

<style scoped>
  .upload-area {
    padding: 60px 20px;
    text-align: center;
    border: 2px dashed #cbd5e1;
    border-radius: 8px;
    transition: border-color 0.3s;
    background: #f8fafc;
  }

  .upload-area:hover {
    border-color: #3b82f6;
    background: #f1f5f9;
  }

  .el-upload__text em {
    color: #409eff;
    font-style: normal;
  }

  .container {
    max-width: 1200px;
  }

  .sticky {
    position: sticky;
  }

  .preview-tabs .el-tabs__content {
    padding: 0;
  }

  .preview-tabs .el-tab-pane {
    padding: 0;
  }

  /* Monaco Editor 样式调整 */
  :deep(.monaco-editor) {
    border-radius: 0.5rem;
  }

  :deep(.monaco-editor .margin) {
    background-color: #f8fafc;
  }

  :deep(.monaco-scrollable-element > .scrollbar > .slider) {
    background: rgb(100 116 139 / 30%);
  }

  :deep(.monaco-scrollable-element > .scrollbar > .slider:hover) {
    background: rgb(100 116 139 / 60%);
  }
</style>
