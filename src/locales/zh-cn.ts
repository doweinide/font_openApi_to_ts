export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    submit: '提交',
    back: '返回',
    next: '下一步',
    prev: '上一步',
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
    upload: '文件上传',
    url: 'URL 输入'
  },
  nav: {
    home: '首页',
    generate: '生成代码'
  },
  home: {
    title: 'OpenAPI 转 TypeScript 工具',
    subtitle: '快速将 OpenAPI/Swagger 文档转换为 TypeScript 类型定义',
    description: '支持多种输入格式，生成高质量的 TypeScript 代码',
    getStarted: '开始使用',
    features: {
      title: '核心功能',
      parse: {
        title: 'OpenAPI 解析',
        desc: '支持 OpenAPI 3.0/2.0 和 Swagger 格式'
      },
      generate: {
        title: 'TypeScript 生成',
        desc: '生成类型安全的 TypeScript 接口和类型'
      },
      download: {
        title: '文件下载',
        desc: '支持单文件或打包下载生成的代码'
      }
    }
  },
  generate: {
    title: '代码生成',
    inputLabel: '输入 OpenAPI 文档',
    inputPlaceholder: '请输入 OpenAPI/Swagger JSON 或 YAML 内容...',
    generateBtn: '生成 TypeScript',
    downloadBtn: '下载代码',
    copyBtn: '复制代码',
    clearBtn: '清空',
    formatBtn: '格式化',
    outputLabel: '生成的 TypeScript 代码',
    noOutput: '暂无生成的代码',
    parseError: '解析失败，请检查输入格式',
    generateSuccess: '代码生成成功',
    copySuccess: '代码已复制到剪贴板',
    uploadArea: {
      dragText: '拖拽文件到此处或',
      clickText: '点击上传',
      tip: '支持 .json、.yaml、.yml 格式的 OpenAPI 文档',
      uploadedFile: '已上传文件',
      loadedUrl: '已加载 URL'
    },
    urlInput: {
      placeholder: '请输入 OpenAPI 文档的 URL 地址',
      loadBtn: '加载 OpenAPI 文档',
      corsHelp: {
        title: '跨域限制说明：',
        description: '由于浏览器安全策略，部分URL可能无法直接访问。如遇到跨域问题，请尝试：',
        solutions: '• 下载OpenAPI文件后使用文件上传功能\n• 使用支持CORS的API地址（如GitHub Raw链接）\n• 联系API提供方添加CORS支持',
        supportedUrls: '通常支持直接访问的URL类型：',
        urlTypes: '• GitHub Raw文件：https://raw.githubusercontent.com/...\n• 公共CDN链接：https://cdn.jsdelivr.net/...\n• 已配置CORS的API文档地址'
      }
    },
    docInfo: {
      title: '文档信息',
      apiTitle: '标题',
      version: '版本',
      pathCount: '接口数量',
      tagCount: '标签数量',
      description: '描述'
    },
    preview: {
      title: '生成效果预览',
      fileStructure: '文件目录结构',
      apiTab: '生成的 API 函数(不分离类型模式)',
      typesTab: '统一类型定义(分离类型模式)'
    },
    config: {
      title: '生成配置',
      selectTags: '选择 Tags',
      selectTagsPlaceholder: '选择要生成的 tags（留空表示全部）',
      importTemplate: '导入语句模板',
      requestUtilPath: '请求工具路径',
      functionNaming: '函数命名规则',
      typeNaming: '类型命名规则',
      fileStructure: '文件结构',
      separateTypes: '分离类型文件',
      generateIndex: '生成 index.ts',
      generateUtils: '生成工具文件',
      codeStyle: '代码风格',
      useAsync: '使用 async/await',
      includeComments: '包含注释',
      exportStyle: '导出方式',
      namedExport: '命名导出',
      defaultExport: '默认导出',
      cacheManagement: '缓存管理',
      clearCache: '清除缓存数据'
    }
  },
  settings: {
    language: '语言设置',
    theme: '主题设置'
  }
}