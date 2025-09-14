# 🚀 OpenAPI to TypeScript 转换器

一个强大的在线工具，用于将 OpenAPI 规范快速转换为 TypeScript 类型定义和接口声明。

# 在线体验入口
- 🌐 在线体验地址：[font_openApi_to_ts 在线工具](https://doweinide.github.io/font_openApi_to_ts/)

## 📖 项目简介

OpenAPI to TypeScript 转换器是一个基于 Vue 3 + TypeScript + Tailwind CSS 构建的现代化 Web 应用，专门用于解析 OpenAPI/Swagger 文档并生成高质量的 TypeScript 代码。无论是 API 接口类型、数据模型还是请求响应结构，都能一键生成标准的 TypeScript 定义。

## 🎯 解决的问题

### 开发痛点
- **手动编写类型定义耗时费力**：传统方式需要根据 API 文档手动编写 TypeScript 接口
- **类型定义与 API 不同步**：API 更新后，前端类型定义容易遗漏更新
- **代码质量参差不齐**：不同开发者编写的类型定义风格不统一
- **重复劳动**：多个项目需要重复编写相似的类型定义

### 解决方案
✅ **自动化生成**：一键将 OpenAPI 文档转换为 TypeScript 代码  
✅ **保持同步**：基于最新 API 文档生成，确保类型定义始终与后端接口同步  
✅ **标准化输出**：生成符合 TypeScript 最佳实践的高质量代码  
✅ **提升效率**：大幅减少手动编写类型定义的时间成本  

## ✨ 核心功能

### 🔧 代码生成功能
- **完整类型支持**：支持 OpenAPI 3.0+ 规范的所有数据类型
- **智能接口生成**：自动生成 API 接口函数和类型定义
- **嵌套类型处理**：完美处理复杂的嵌套对象和数组类型
- **枚举类型转换**：将 OpenAPI 枚举转换为 TypeScript 联合类型
- **可选字段识别**：准确识别必填和可选字段

### 📝 代码质量优化
- **智能注释生成**：自动提取 OpenAPI 中的 title 和 description 作为代码注释
- **命名规范转换**：支持多种命名风格转换（camelCase、PascalCase 等）
- **代码格式化**：生成格式规范、易读的 TypeScript 代码
- **去重优化**：自动去除重复的类型定义和接口声明

### 🎨 用户体验
- **实时预览**：输入 OpenAPI 文档后实时生成预览
- **语法高亮**：支持 JSON 和 TypeScript 代码语法高亮
- **一键复制**：生成的代码支持一键复制到剪贴板
- **文件下载**：支持将生成的代码打包下载
- **错误提示**：详细的错误信息和修复建议

### 🔄 灵活配置
- **自定义选项**：支持配置生成选项（如是否包含注释、命名风格等）
- **标签分组**：按 OpenAPI 标签自动分组生成文件
- **路径过滤**：支持选择性生成特定路径的接口
- **类型导入优化**：智能处理类型导入和依赖关系

## 🛠️ 技术栈

### 前端框架
- **Vue 3**：采用 Composition API，提供现代化的开发体验
- **TypeScript**：全面的类型安全保障
- **Vite**：极速的开发构建工具

### UI 框架
- **Tailwind CSS**：原子化 CSS 框架，快速构建美观界面
- **响应式设计**：完美适配桌面端和移动端

### 核心依赖
- **OpenAPI Parser**：解析 OpenAPI/Swagger 文档
- **TypeScript Compiler API**：生成高质量的 TypeScript 代码
- **Monaco Editor**：提供专业的代码编辑体验

### 开发工具
- **ESLint + Prettier**：代码质量和格式化保障
- **Husky + lint-staged**：Git 提交钩子和代码检查
- **GitHub Actions**：自动化 CI/CD 流程

## 📁 项目结构

```
vue3-Ts-Tailwind-template-Pro-private/
├── 📁 .github/                    # GitHub Actions 工作流
│   └── workflows/
│       └── deploy.yml             # 自动部署配置
├── 📁 public/                     # 静态资源
│   └── favicon.ico               # 网站图标
├── 📁 src/                       # 源代码目录
│   ├── 📁 types/                 # TypeScript 类型定义
│   │   └── openapi.d.ts          # OpenAPI 相关类型
│   ├── 📁 utils/                 # 工具函数
│   │   ├── typescript-generator.ts # TypeScript 代码生成器
│   │   └── openapi-parser.ts     # OpenAPI 解析器
│   ├── 📁 views/                 # 工具函数
│   │   ├── GenerateView.vue      # 生成视图
│   │   └── HomeView.vue          # 首页视图
│   ├── 📁 styles/                # 样式文件
│   │   └── main.css              # 主样式文件
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 应用入口
├── 📁 template/                  # 构建输出目录
├── 📄 package.json               # 项目依赖配置
├── 📄 vite.config.ts             # Vite 配置
├── 📄 tailwind.config.js         # Tailwind CSS 配置
├── 📄 tsconfig.json              # TypeScript 配置
├── 📄 .env.*                     # 环境变量配置
└── 📄 README.md                  # 项目说明文档
```

### 核心文件说明

#### 🎯 主要组件
- **`GenerateView.vue`**：主界面组件，包含输入区域和输出预览
- **`CodeEditor.vue`**：代码编辑器，支持语法高亮和格式化
- **`FileTree.vue`**：文件树展示，按标签分组显示生成的文件

#### ⚙️ 核心工具
- **`typescript-generator.ts`**：TypeScript 代码生成引擎
  - `generateApiFiles()`: 生成 API 接口文件
  - `schemaToTypeScript()`: 将 OpenAPI Schema 转换为 TypeScript 类型
  - `generateFileStructure()`: 生成文件结构树
- **`openapi-parser.ts`**：OpenAPI 文档解析器

#### 🔧 配置文件
- **`vite.config.ts`**：构建配置，输出到 template 目录
- **`tailwind.config.js`**：UI 样式配置
- **`.env.production`**：生产环境变量配置

## 🚀 快速开始

### 环境要求
- Node.js >= 20.0.0
- pnpm >= 10.0.0 (推荐) 

### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发模式
```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 构建部署
```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 使用方法

1. **输入 OpenAPI 文档**
   - 在左侧编辑器中粘贴或输入 OpenAPI JSON/YAML 文档
   - 支持 OpenAPI 3.0+ 规范

2. **配置生成选项**
   - 选择是否包含注释
   - 设置命名风格
   - 配置文件分组方式

3. **生成 TypeScript 代码**
   - 点击"生成代码"按钮
   - 在右侧预览生成的 TypeScript 代码
   - 查看文件树结构

4. **导出代码**
   - 复制单个文件内容
   - 下载完整的代码包

## 🌟 功能特色

### 🎨 现代化界面
- **响应式设计**：完美适配各种屏幕尺寸
- **暗色主题**：护眼的暗色界面设计
- **直观操作**：简洁明了的用户交互

### ⚡ 高性能
- **实时生成**：毫秒级的代码生成速度
- **内存优化**：高效的内存使用和垃圾回收
- **懒加载**：按需加载组件和资源

### 🔒 代码质量
- **类型安全**：100% TypeScript 覆盖
- **代码规范**：ESLint + Prettier 保障代码质量

### 🌐 部署友好
- **静态部署**：支持 GitHub Pages、Vercel、Netlify 等平台
- **CDN 优化**：资源压缩和缓存优化
- **SEO 友好**：良好的搜索引擎优化

## 🚀 部署说明

### GitHub Pages 自动部署

项目已配置 GitHub Actions 自动部署流程：

1. **推送代码**：向 `main` 分支推送代码
2. **自动构建**：GitHub Actions 自动执行构建
3. **部署上线**：构建完成后自动部署到 GitHub Pages

### 手动部署

```bash
# 1. 构建项目
pnpm build:prod
pnpm build:dev
pnpm build:test

# 2. 部署 template 目录到静态服务器
# 例如：上传到 Nginx、Apache 或 CDN
```

### 环境变量配置

生产环境需要配置以下环境变量：

```bash
# .env.production
VITE_OUTDIR_PATH=template/
VITE_APP_TITLE=OpenAPI to TypeScript 转换器
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/vue3-Ts-Tailwind-template-Pro-private.git
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **开发和测试**
   ```bash
   pnpm dev        # 启动开发服务器
   pnpm test       # 运行测试
   pnpm lint       # 代码检查
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 编写所有代码
- 添加适当的注释和文档
- 编写单元测试覆盖新功能

### 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建或辅助工具变动

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 📞 联系我们

如果您有任何问题或建议，欢迎通过以下方式联系：

- 📧 提交 [Issue](https://github.com/doweinide/font_openApi_to_ts/issues)
- 💬 发起 [Discussion](https://github.com/doweinide/font_openApi_to_ts/discussions)

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

## 📚 其他语言版本

- [English Version](README.md)
- [日本語版 (Japanese)](README.ja.md)