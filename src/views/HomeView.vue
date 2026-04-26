<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <div class="container mx-auto px-6 py-12">
      <!-- 固定定位的工具栏 -->
      <div class="fixed right-4 top-4 z-50 flex items-center space-x-3">
        <!-- GitHub 链接 -->
        <a
          href="https://github.com/doweinide/font_openApi_to_ts"
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900 hover:shadow-xl"
          :title="$t('common.github')"
        >
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
        <!-- 语言切换器 -->
        <LanguageSwitcher size="small" />
      </div>

      <!-- 页面标题 -->
      <div class="mb-12 text-center">
        <h1
          class="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent"
        >
          {{ $t('home.title') }}
        </h1>
        <p class="mx-auto max-w-2xl text-xl leading-relaxed text-slate-600">
          {{ $t('home.subtitle') }}
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
                <span class="text-xl font-semibold">{{
                  $t('generate.inputLabel')
                }}</span>
              </div>
            </template>

            <el-tabs v-model="activeTab" class="mb-4">
              <el-tab-pane :label="$t('common.upload')" name="file">
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
                      {{ $t('generate.uploadArea.dragText') }}
                      <em>{{ $t('generate.uploadArea.clickText') }}</em>
                    </div>
                    <div class="el-upload__tip mt-2 text-sm text-gray-500">
                      {{ $t('generate.uploadArea.tip') }}
                    </div>
                  </div>
                </el-upload>

                <!-- 文件信息显示 -->
                <div
                  v-if="uploadedFile && uploadedFile.type === 'file'"
                  class="mt-4"
                >
                  <el-alert
                    :title="`${$t('generate.uploadArea.uploadedFile')}: ${uploadedFile.name}`"
                    type="success"
                    :closable="false"
                    show-icon
                  />
                </div>
              </el-tab-pane>

              <el-tab-pane :label="$t('common.url')" name="url">
                <div class="space-y-4">
                  <el-input
                    v-model="urlInput"
                    :placeholder="$t('generate.urlInput.placeholder')"
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
                        <p class="mb-1 font-medium">
                          {{ $t('generate.urlInput.corsHelp.title') }}
                        </p>
                        <p class="mb-2">
                          {{ $t('generate.urlInput.corsHelp.description') }}
                        </p>
                        <div class="mb-3 whitespace-pre-line text-xs">
                          {{ $t('generate.urlInput.corsHelp.solutions') }}
                        </div>
                        <p class="mb-1 font-medium">
                          {{ $t('generate.urlInput.corsHelp.supportedUrls') }}
                        </p>
                        <div class="whitespace-pre-line text-xs">
                          {{ $t('generate.urlInput.corsHelp.urlTypes') }}
                        </div>
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
                    {{ $t('generate.urlInput.loadBtn') }}
                  </el-button>

                  <!-- URL 加载成功显示 -->
                  <div
                    v-if="uploadedFile && uploadedFile.type === 'url'"
                    class="mt-4"
                  >
                    <el-alert
                      :title="`${$t('generate.uploadArea.loadedUrl')}: ${uploadedFile.name}`"
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
                <span class="text-sm font-medium text-slate-700">{{
                  $t('generate.docInfo.title')
                }}</span>
              </el-divider>
              <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <span class="font-medium text-slate-700"
                      >{{ $t('generate.docInfo.apiTitle') }}:</span
                    >
                    <span class="ml-2 text-slate-600">{{
                      parsedDoc.info.title
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-slate-700"
                      >{{ $t('generate.docInfo.version') }}:</span
                    >
                    <span class="ml-2 text-slate-600">{{
                      parsedDoc.info.version
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-slate-700"
                      >{{ $t('generate.docInfo.pathCount') }}:</span
                    >
                    <span class="ml-2 text-slate-600">{{
                      getPathCount()
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-slate-700"
                      >{{ $t('generate.docInfo.tagCount') }}:</span
                    >
                    <span class="ml-2 text-slate-600">{{
                      parsedDoc.tags?.length || 0
                    }}</span>
                  </div>
                </div>
                <div v-if="parsedDoc.info.description" class="mt-3">
                  <span class="font-medium text-slate-700"
                    >{{ $t('generate.docInfo.description') }}:</span
                  >
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
                <span class="text-xl font-semibold">{{
                  $t('generate.preview.title')
                }}</span>
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
                    {{ $t('generate.preview.fileStructure') }}
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
                      :label="$t('generate.preview.apiTab')"
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
                      :label="$t('generate.preview.typesTab')"
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
                <span class="text-xl font-semibold">{{
                  $t('generate.config.title')
                }}</span>
              </div>
            </template>

            <el-form :model="config" label-position="top" class="space-y-4">
              <!-- 代码语言选择 -->
              <el-form-item :label="$t('generate.config.codeLanguage')">
                <el-radio-group v-model="config.codeLanguage" class="w-full">
                  <el-radio value="typescript">{{ $t('generate.config.typescript') }}</el-radio>
                  <el-radio value="javascript">{{ $t('generate.config.javascript') }}</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- Tags 配置 -->
              <el-form-item :label="$t('generate.config.selectTags')">
                <el-select
                  v-model="config.outputTags"
                  multiple
                  :placeholder="$t('generate.config.selectTagsPlaceholder')"
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
              <el-form-item 
                v-show="config.codeLanguage === 'typescript'"
                :label="$t('generate.config.importTemplate')"
              >
                <el-input
                  v-model="config.importTemplate"
                  type="textarea"
                  :rows="2"
                  placeholder="import { request } from '../utils/request';"
                />
              </el-form-item>

              <!-- JS代码生成模式提示 -->
              <el-form-item v-show="config.codeLanguage === 'javascript'">
                <el-alert
                  :title="$t('generate.config.jsGenerationTip')"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <p>{{ $t('generate.config.jsGenerationDesc') }}</p>
                  </template>
                </el-alert>
              </el-form-item>

              <!-- 命名规则 -->
              <el-form-item :label="$t('generate.config.functionNaming')">
                <el-radio-group v-model="config.functionNaming" class="w-full">
                  <el-radio value="camelCase">camelCase</el-radio>
                  <el-radio value="snake_case">snake_case</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 类型命名规则 -->
              <el-form-item 
                v-show="config.codeLanguage === 'typescript'"
                :label="$t('generate.config.typeNaming')"
              >
                <el-radio-group v-model="config.typeNaming" class="w-full">
                  <el-radio value="PascalCase">PascalCase</el-radio>
                  <el-radio value="camelCase">camelCase</el-radio>
                  <el-radio value="snake_case">snake_case</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 文件结构配置 -->
              <el-divider content-position="left">
                <span class="text-sm text-slate-700">{{
                  $t('generate.config.fileStructure')
                }}</span>
              </el-divider>

              <el-form-item>
                <el-checkbox 
                  v-show="config.codeLanguage === 'typescript'"
                  v-model="config.separateTypes"
                >{{
                  $t('generate.config.separateTypes')
                }}</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="config.generateIndex">{{
                  $t('generate.config.generateIndex')
                }}</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="config.generateUtils">{{
                  $t('generate.config.generateUtils')
                }}</el-checkbox>
              </el-form-item>

              <!-- 代码风格配置 -->
              <el-divider content-position="left">
                <span class="text-sm text-slate-700">{{
                  $t('generate.config.codeStyle')
                }}</span>
              </el-divider>

              <el-form-item>
                <el-checkbox v-model="config.useAsync">{{
                  $t('generate.config.useAsync')
                }}</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="config.includeComments">{{
                  $t('generate.config.includeComments')
                }}</el-checkbox>
              </el-form-item>

              <el-form-item :label="$t('generate.config.exportStyle')">
                <el-radio-group v-model="config.exportStyle" class="w-full">
                  <el-radio value="named">{{
                    $t('generate.config.namedExport')
                  }}</el-radio>
                  <el-radio value="default">{{
                    $t('generate.config.defaultExport')
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>

            <!-- 缓存管理 -->
            <el-divider content-position="left">
              <span class="text-sm text-slate-700">{{
                $t('generate.config.cacheManagement')
              }}</span>
            </el-divider>

            <el-button
              type="danger"
              size="small"
              class="mb-4 w-full"
              :disabled="!hasCachedData"
              @click="handleClearCache"
            >
              <el-icon class="mr-2"><Delete /></el-icon>
              {{ $t('generate.config.clearCache') }}
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
              {{ $t('generate.generateBtn') }}
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
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
  import type {
    GeneratorConfig,
    OpenAPIDocument,
    UploadFile,
  } from '@/types/openapi'
  import { parseOpenAPI } from '@/utils/openapi-parser'
  import { generateCode } from '@/utils/typescript-generator'

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
  const { t } = useI18n()

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
    codeLanguage: 'javascript',
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

  const testJavaScriptGenerator = () => {
    console.log('🔍 [调试] 开始测试JavaScript生成器')
    console.log('🔍 [调试] 当前语言模式:', config.codeLanguage)
    
    // 创建测试文档
    const testDoc = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {
        '/test': {
          get: {
            operationId: 'getTest',
            summary: '测试接口',
            tags: ['test'],
            responses: {
              '200': {
                description: '成功响应'
              }
            }
          }
        },
        '/users/{id}': {
          get: {
            operationId: 'getUserById',
            summary: '根据ID获取用户',
            tags: ['users'],
            parameters: [{
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }],
            responses: {
              '200': {
                description: '用户信息'
              }
            }
          },
          post: {
            operationId: 'updateUser',
            summary: '更新用户',
            tags: ['users'],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      email: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': {
                description: '更新成功'
              }
            }
          }
        }
      }
    }
    
    console.log('🔍 [调试] 测试文档:', testDoc)
    console.log('🔍 [调试] 文档路径数量:', Object.keys(testDoc.paths).length)
    console.log('🔍 [调试] 当前配置:', {
      codeLanguage: config.codeLanguage,
      outputTags: config.outputTags,
      generateUtils: config.generateUtils,
      generateIndex: config.generateIndex
    })
    
    try {
      console.log('🔍 [调试] 调用generateCode函数...')
      const result = generateCode({ config, openApiDoc: testDoc })
      console.log('🔍 [调试] 生成结果:', result)
      console.log('🔍 [调试] 生成的文件数量:', result.files?.length || 0)
      
      if (result.files && result.files.length > 0) {
        result.files.forEach((file, index) => {
          console.log(`🔍 [调试] 文件${index + 1}: ${file.path} (${file.content?.length || 0} 字符)`)
        })
      } else {
        console.warn('🔍 [调试] 警告: 没有生成任何文件!')
      }
      ElMessage.success('测试完成，请查看控制台日志')
    } catch (error) {
      console.error('🔍 [调试] 生成失败:', error)
      console.error('🔍 [调试] 错误堆栈:', error.stack)
      ElMessage.error('测试失败: ' + error.message)
    }
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

      const result = generateCode({
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
        codeLanguage: 'javascript',
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
