<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
  >
    <!-- 顶部导航栏 -->
    <div class="w-full border-b bg-white/80 shadow-lg backdrop-blur-sm">
      <div class="w-full px-2 py-5">
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center space-x-6">
            <el-button
              type="primary"
              plain
              class="border-blue-200 hover:bg-blue-50"
              @click="$router.push('/')"
            >
              <el-icon class="mr-2"><ArrowLeft /></el-icon>
              {{ $t('common.back') }}
            </el-button>
            <el-divider direction="vertical" class="border-slate-300" />
            <h1
              class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent"
            >
              {{ $t('generate.title') }}
            </h1>
          </div>
          
          <!-- 语言切换器 -->
          <div class="flex items-center space-x-4">
            <LanguageSwitcher class="w-32" size="small" />
          </div>

          <div class="flex items-center space-x-4">
            <!-- 下载按钮 -->
            <el-button
              type="primary"
              size="large"
              :disabled="!generatedFiles.length"
              class="border-0 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg transition-all duration-200 hover:shadow-xl"
              @click="downloadAllFiles"
            >
              <el-icon class="mr-2"><Download /></el-icon>
              {{ $t('generate.downloadBtn') }}
            </el-button>

            <!-- 复制当前文件按钮 -->
            <el-button
              v-if="selectedFile"
              size="large"
              class="border-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
              @click="copyCurrentFile"
            >
              <el-icon class="mr-2"><CopyDocument /></el-icon>
              {{ $t('generate.copyBtn') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex h-[calc(100vh-90px)]">
      <!-- 文件目录树 -->
      <div class="w-80 border-r bg-white/80 shadow-lg backdrop-blur-sm">
        <div class="flex h-full flex-col">
          <div
            class="flex items-center border-b bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4"
          >
            <el-icon class="mr-3 text-lg text-blue-600"><Folder /></el-icon>
            <span class="text-lg font-semibold text-slate-700">文件结构</span>
            <el-badge
              :value="generatedFiles.length"
              class="ml-3"
              type="primary"
            />
          </div>

          <div class="flex-1 overflow-y-auto p-2">
            <el-tree
              :data="fileStructure"
              :props="treeProps"
              node-key="id"
              :expand-on-click-node="false"
              class="file-tree"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <div
                  class="flex w-full cursor-pointer items-center rounded px-2 py-1 hover:bg-slate-100"
                >
                  <el-icon class="mr-2 text-slate-500">
                    <Folder v-if="data.type === 'folder'" />
                    <Document v-else />
                  </el-icon>
                  <span
                    class="truncate text-sm"
                    :class="{
                      'bg-blue-50 font-medium text-blue-600':
                        selectedFile?.path === data.path,
                      'text-slate-700': selectedFile?.path !== data.path,
                    }"
                  >
                    {{ data.name }}
                  </span>
                </div>
              </template>
            </el-tree>
          </div>
        </div>
      </div>

      <!-- 代码展示区域 -->
      <div class="flex flex-1 flex-col bg-white/80 backdrop-blur-sm">
        <div
          class="flex items-center justify-between border-b bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-4"
        >
          <div class="flex items-center">
            <el-icon class="mr-3 text-lg text-indigo-600"><Document /></el-icon>
            <span class="text-lg font-semibold text-slate-700">
              {{ selectedFile?.path || '请选择文件' }}
            </span>
          </div>
          <div v-if="selectedFile" class="flex items-center space-x-2">
            <el-tag size="small" type="info">
              {{ getFileExtension(selectedFile.path) }}
            </el-tag>
            <el-tag size="small">
              {{ formatFileSize(selectedFile.content.length) }}
            </el-tag>
          </div>
        </div>

        <div class="flex-1 overflow-hidden">
          <!-- 代码编辑器 -->
          <div
            v-if="selectedFile"
            ref="editorContainer"
            class="h-full w-full"
          ></div>

          <!-- 空状态 -->
          <div
            v-else
            class="flex h-full items-center justify-center text-slate-500"
          >
            <div class="text-center">
              <el-icon class="mb-4 text-6xl text-slate-300">
                <Document />
              </el-icon>
              <p class="text-lg text-slate-600">请从左侧选择文件查看代码</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ArrowLeft,
    Download,
    CopyDocument,
    Folder,
    Document,
  } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import JSZip from 'jszip'
  import * as monaco from 'monaco-editor'

  // 配置 Monaco Editor workers
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
  import { ref, reactive, onMounted, nextTick, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import type { GeneratedFile, FileTreeNode } from '@/types/openapi'
  import { LOCALE_OPTIONS, setLocale, getCurrentLocale } from '@/locales'
  import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

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
  const generatedFiles = ref<GeneratedFile[]>([])
  const fileStructure = ref<FileTreeNode[]>([])
  const selectedFile = ref<GeneratedFile>()
  const editorContainer = ref<HTMLElement>()
  let monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null

  // 树组件配置
  const treeProps = {
    children: 'children',
    label: 'name',
  }

  // 方法
  const loadGeneratedData = () => {
    try {
      const filesData = sessionStorage.getItem('generatedFiles')
      const structureData = sessionStorage.getItem('fileStructure')

      if (filesData) {
        generatedFiles.value = JSON.parse(filesData)
      }

      if (structureData) {
        fileStructure.value = JSON.parse(structureData)
      }

      // 如果有文件，默认选择第一个
      if (generatedFiles.value.length > 0) {
        selectedFile.value = generatedFiles.value[0]
      }
    } catch (error) {
      ElMessage.error('加载生成数据失败')
      router.push('/')
    }
  }

  const handleNodeClick = (data: FileTreeNode) => {
    if (data.type === 'file') {
      const file = generatedFiles.value.find(f => f.path === data.path)
      if (file) {
        selectedFile.value = file
      }
    }
  }

  const initMonacoEditor = async () => {
    if (!editorContainer.value || !selectedFile.value) return

    // 销毁现有编辑器
    if (monacoEditor) {
      monacoEditor.dispose()
    }

    // 创建新编辑器
    monacoEditor = monaco.editor.create(editorContainer.value, {
      automaticLayout: true,
      fontSize: 14,
      language: getMonacoLanguage(selectedFile.value.path),
      lineNumbers: 'on',
      minimap: { enabled: true },
      padding: { bottom: 16, top: 16 },
      readOnly: true,
      scrollBeyondLastLine: false,
      theme: 'vs',
      value: selectedFile.value.content,
      wordWrap: 'on',
    })
  }

  const getMonacoLanguage = (filePath: string): string => {
    const ext = getFileExtension(filePath).toLowerCase()
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript'
      case 'js':
      case 'jsx':
        return 'javascript'
      case 'json':
        return 'json'
      case 'md':
        return 'markdown'
      default:
        return 'typescript'
    }
  }

  const getFileExtension = (filePath: string): string => {
    const parts = filePath.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  }

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const copyCurrentFile = async () => {
    if (!selectedFile.value) return

    try {
      await navigator.clipboard.writeText(selectedFile.value.content)
      ElMessage.success('代码已复制到剪贴板')
    } catch (error) {
      ElMessage.error('复制失败')
    }
  }

  const downloadAllFiles = async () => {
    if (!generatedFiles.value.length) return

    try {
      const zip = new JSZip()

      // 添加所有文件到 ZIP
      generatedFiles.value.forEach(file => {
        zip.file(file.path, file.content)
      })

      // 生成 ZIP 文件
      const content = await zip.generateAsync({ type: 'blob' })

      // 创建下载链接
      const url = URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.download = 'openapi-typescript-generated.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      ElMessage.success('文件下载成功')
    } catch (error) {
      ElMessage.error('文件下载失败')
    }
  }

  // 监听选中文件变化
  watch(selectedFile, async () => {
    if (selectedFile.value) {
      await nextTick()
      initMonacoEditor()
    }
  })

  // 生命周期
  onMounted(async () => {
    loadGeneratedData()

    // 检查是否有生成的文件
    if (!generatedFiles.value.length) {
      ElMessage.warning('没有找到生成的文件，请先生成代码')
      router.push('/')
      return
    }

    await nextTick()
    initMonacoEditor()
  })

  // 组件卸载时清理编辑器
  const cleanup = () => {
    if (monacoEditor) {
      monacoEditor.dispose()
      monacoEditor = null
    }
  }

  // 监听路由变化进行清理
  watch(() => router.currentRoute.value, cleanup)
</script>

<style scoped>
  .file-tree :deep(.el-tree-node__content) {
    height: auto;
    padding: 0;
    background: transparent;
  }

  .file-tree :deep(.el-tree-node__content:hover) {
    background: transparent;
  }

  .file-tree :deep(.el-tree-node__expand-icon) {
    color: #64748b;
  }

  .file-tree :deep(.el-tree-node) {
    margin-bottom: 2px;
  }

  /* Monaco Editor 样式调整 */
  :deep(.monaco-editor) {
    border: 1px solid #e2e8f0;
  }

  :deep(.monaco-editor .margin) {
    background-color: #f8fafc;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
