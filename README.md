# 🚀 OpenAPI to TypeScript Converter

A powerful online tool for quickly converting OpenAPI specifications to TypeScript type definitions and interface declarations.

# Online Experience
- 🌐 Online Tool: [font_openApi_to_ts Online Tool](https://doweinide.github.io/font_openApi_to_ts/)

## 📖 Project Overview

The OpenAPI to TypeScript Converter is a modern web application built with Vue 3 + TypeScript + Tailwind CSS, specifically designed to parse OpenAPI/Swagger documents and generate high-quality TypeScript code. Whether it's API interface types, data models, or request-response structures, everything can be generated with one click as standard TypeScript definitions.

## 🎯 Problems Solved

### Development Pain Points
- **Manual type definition is time-consuming**: Traditional methods require manually writing TypeScript interfaces based on API documentation
- **Type definitions out of sync with API**: Frontend type definitions are easily missed when APIs are updated
- **Inconsistent code quality**: Type definitions written by different developers have inconsistent styles
- **Repetitive work**: Multiple projects need to repeatedly write similar type definitions

### Solutions
✅ **Automated generation**: One-click conversion of OpenAPI documents to TypeScript code  
✅ **Stay synchronized**: Generated based on the latest API documentation, ensuring type definitions are always in sync with backend interfaces  
✅ **Standardized output**: Generate high-quality code that follows TypeScript best practices  
✅ **Improved efficiency**: Significantly reduce the time cost of manually writing type definitions  

## ✨ Core Features

### 🔧 Code Generation
- **Complete type support**: Supports all data types in OpenAPI 3.0+ specifications
- **Smart interface generation**: Automatically generates API interface functions and type definitions
- **Nested type handling**: Perfect handling of complex nested objects and array types
- **Enum type conversion**: Converts OpenAPI enums to TypeScript union types
- **Optional field recognition**: Accurately identifies required and optional fields

### 📝 Code Quality Optimization
- **Smart comment generation**: Automatically extracts title and description from OpenAPI as code comments
- **Naming convention conversion**: Supports multiple naming style conversions (camelCase, PascalCase, etc.)
- **Code formatting**: Generates well-formatted, readable TypeScript code
- **Deduplication optimization**: Automatically removes duplicate type definitions and interface declarations

### 🎨 User Experience
- **Real-time preview**: Real-time generation preview after inputting OpenAPI documents
- **Syntax highlighting**: Supports JSON and TypeScript code syntax highlighting
- **One-click copy**: Generated code supports one-click copy to clipboard
- **File download**: Supports downloading generated code packages
- **Error prompts**: Detailed error messages and fix suggestions

### 🔄 Flexible Configuration
- **Custom options**: Supports configuration of generation options (such as whether to include comments, naming styles, etc.)
- **Tag grouping**: Automatically groups and generates files by OpenAPI tags
- **Path filtering**: Supports selective generation of interfaces for specific paths
- **Type import optimization**: Smart handling of type imports and dependencies

## 🛠️ Tech Stack

### Frontend Framework
- **Vue 3**: Uses Composition API for modern development experience
- **TypeScript**: Comprehensive type safety guarantee
- **Vite**: Ultra-fast development build tool

### UI Framework
- **Tailwind CSS**: Atomic CSS framework for quickly building beautiful interfaces
- **Responsive design**: Perfect adaptation for desktop and mobile

### Core Dependencies
- **OpenAPI Parser**: Parse OpenAPI/Swagger documents
- **TypeScript Compiler API**: Generate high-quality TypeScript code
- **Monaco Editor**: Provide professional code editing experience

### Development Tools
- **ESLint + Prettier**: Code quality and formatting guarantee
- **Husky + lint-staged**: Git commit hooks and code checking
- **GitHub Actions**: Automated CI/CD pipeline

## 📁 Project Structure

```
vue3-Ts-Tailwind-template-Pro-private/
├── 📁 .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml             # Auto deployment configuration
├── 📁 public/                     # Static assets
│   └── favicon.ico               # Website icon
├── 📁 src/                       # Source code directory
│   ├── 📁 types/                 # TypeScript type definitions
│   │   └── openapi.d.ts          # OpenAPI related types
│   ├── 📁 utils/                 # Utility functions
│   │   ├── typescript-generator.ts # TypeScript code generator
│   │   └── openapi-parser.ts     # OpenAPI parser
│   ├── 📁 views/                 # View components
│   │   ├── GenerateView.vue      # Generate view
│   │   └── HomeView.vue          # Home view
│   ├── 📁 styles/                # Style files
│   │   └── main.css              # Main stylesheet
│   ├── App.vue                   # Root component
│   └── main.ts                   # Application entry
├── 📁 template/                  # Build output directory
├── 📄 package.json               # Project dependencies configuration
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 .env.*                     # Environment variables configuration
└── 📄 README.md                  # Project documentation
```

### Core File Descriptions

#### 🎯 Main Components
- **`GenerateView.vue`**: Main interface component with input area and output preview
- **`CodeEditor.vue`**: Code editor with syntax highlighting and formatting
- **`FileTree.vue`**: File tree display, showing generated files grouped by tags

#### ⚙️ Core Tools
- **`typescript-generator.ts`**: TypeScript code generation engine
  - `generateApiFiles()`: Generate API interface files
  - `schemaToTypeScript()`: Convert OpenAPI Schema to TypeScript types
  - `generateFileStructure()`: Generate file structure tree
- **`openapi-parser.ts`**: OpenAPI document parser

#### 🔧 Configuration Files
- **`vite.config.ts`**: Build configuration, outputs to template directory
- **`tailwind.config.js`**: UI style configuration
- **`.env.production`**: Production environment variables configuration

## 🚀 Quick Start

### Requirements
- Node.js >= 20.0.0
- pnpm >= 10.0.0 (recommended)

### Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Development Mode
```bash
# Start development server
pnpm dev

# Visit http://localhost:5173
```

### Build and Deploy
```bash
# Build production version
pnpm build

# Preview build result
pnpm preview
```

### Usage

1. **Input OpenAPI Document**
   - Paste or input OpenAPI JSON/YAML document in the left editor
   - Supports OpenAPI 3.0+ specifications

2. **Configure Generation Options**
   - Choose whether to include comments
   - Set naming styles
   - Configure file grouping methods

3. **Generate TypeScript Code**
   - Click the "Generate Code" button
   - Preview generated TypeScript code on the right
   - View file tree structure

4. **Export Code**
   - Copy individual file contents
   - Download complete code package

## 🌟 Features

### 🎨 Modern Interface
- **Responsive design**: Perfect adaptation to various screen sizes
- **Dark theme**: Eye-friendly dark interface design
- **Intuitive operation**: Simple and clear user interaction

### ⚡ High Performance
- **Real-time generation**: Millisecond-level code generation speed
- **Memory optimization**: Efficient memory usage and garbage collection
- **Lazy loading**: Load components and resources on demand

### 🔒 Code Quality
- **Type safety**: 100% TypeScript coverage
- **Code standards**: ESLint + Prettier ensure code quality

### 🌐 Deployment Friendly
- **Static deployment**: Supports GitHub Pages, Vercel, Netlify and other platforms
- **CDN optimization**: Resource compression and cache optimization
- **SEO friendly**: Good search engine optimization

## 🚀 Deployment

### GitHub Pages Auto Deployment

The project has configured GitHub Actions auto deployment workflow:

1. **Push code**: Push code to `main` branch
2. **Auto build**: GitHub Actions automatically executes build
3. **Deploy online**: Automatically deploy to GitHub Pages after build completion

### Manual Deployment

```bash
# 1. Build project
pnpm build:prod
pnpm build:dev
pnpm build:test

# 2. Deploy template directory to static server
# For example: upload to Nginx, Apache or CDN
```

### Environment Variables Configuration

Production environment requires the following environment variables:

```bash
# .env.production
VITE_OUTDIR_PATH=template/
VITE_APP_TITLE=OpenAPI to TypeScript Converter
```

## 🤝 Contributing

We welcome all forms of contributions!

### Development Workflow

1. **Fork the project**
   ```bash
   git clone https://github.com/your-username/vue3-Ts-Tailwind-template-Pro-private.git
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Develop and test**
   ```bash
   pnpm dev        # Start development server
   pnpm test       # Run tests
   pnpm lint       # Code check
   ```

4. **Commit code**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- Follow ESLint and Prettier configuration
- Write all code in TypeScript
- Add appropriate comments and documentation
- Write unit tests covering new features

### Commit Message Standards

Use [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code format adjustments
- `refactor`: Code refactoring
- `test`: Test related
- `chore`: Build or auxiliary tool changes

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Thanks to the following open source projects for their support:

- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [TypeScript](https://www.typescriptlang.org/) - Superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend build tool

## 📞 Contact Us

If you have any questions or suggestions, please contact us through:

- 📧 Submit [Issue](https://github.com/doweinide/font_openApi_to_ts/issues)
- 💬 Start [Discussion](https://github.com/doweinide/font_openApi_to_ts/discussions)

---

⭐ If this project helps you, please give us a Star!

## 📚 Other Language Versions

- [中文版本 (Chinese)](README.zh-cn.md)
- [日本語版 (Japanese)](README.ja.md)