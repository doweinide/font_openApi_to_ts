import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'
import typescriptESLint from '@typescript-eslint/eslint-plugin'
import typescriptESLintParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import importX from 'eslint-plugin-import-x'
import unicorn from 'eslint-plugin-unicorn'
import perfectionist from 'eslint-plugin-perfectionist'
import command from 'eslint-plugin-command'
import eslintComments from 'eslint-plugin-eslint-comments'
import jsdoc from 'eslint-plugin-jsdoc'
import jsonc from 'eslint-plugin-jsonc'
import regexp from 'eslint-plugin-regexp'
import vitest from 'eslint-plugin-vitest'

export default [
  js.configs.recommended,
  
  // TypeScript文件配置（带类型检查）
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: typescriptESLintParser,
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        history: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptESLint,
      prettier,
      'import-x': importX,
      unicorn,
      perfectionist,
      command,
      'eslint-comments': eslintComments,
      jsdoc,
      regexp,
      vitest,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript handles this
      
      // Import规则
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'off', // TypeScript handles this
      
      // Unicorn规则
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      
      // Perfectionist规则
      'perfectionist/sort-imports': 'off', // 使用import-x/order
      'perfectionist/sort-objects': 'error',
      'perfectionist/sort-interfaces': 'error',
      
      // ESLint Comments规则
      'eslint-comments/disable-enable-pair': 'error',
      'eslint-comments/no-unused-disable': 'error',
      
      // JSDoc规则
      'jsdoc/require-description': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      
      // Regexp规则
      'regexp/no-unused-capturing-group': 'error',
      'regexp/no-useless-flag': 'error',
    },
  },
  
  // Vue文件配置
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptESLintParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        history: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescriptESLint,
      prettier,
      'import-x': importX,
      unicorn,
      perfectionist,
      command,
      'eslint-comments': eslintComments,
      jsdoc,
      regexp,
      vitest,
    },
    rules: {
      ...vue.configs.recommended.rules,
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'no-unused-vars': 'off',
      'vue/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'off', // TypeScript handles this
      
      // Import规则
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-unresolved': 'off',
      
      // Unicorn规则
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      
      // Perfectionist规则
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-objects': 'error',
      
      // ESLint Comments规则
      'eslint-comments/disable-enable-pair': 'error',
      'eslint-comments/no-unused-disable': 'error',
    },
  },
  
  // 配置文件配置
  {
    files: ['*.js', '*.ts', '*.mjs', '*.cjs', '*.config.*'],
    languageOptions: {
      parser: typescriptESLintParser,
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptESLint,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-undef': 'off',
    },
  },
  
  // JSON文件配置
  {
    files: ['**/*.json', '**/*.jsonc'],
    languageOptions: {
      parser: jsonc,
    },
    plugins: {
      jsonc,
    },
    rules: {
      'jsonc/sort-keys': 'error',
    },
  },
  
  // 语言文件配置 - 禁用对象排序规则
  {
    files: ['src/locales/**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptESLint,
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'perfectionist/sort-objects': 'off', // 语言文件不需要对象排序
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },

  // 测试文件配置
  {
    files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': 'error',
      'vitest/no-disabled-tests': 'warn',
    },
  },
  
  // Prettier配置
  {
    rules: {
      ...prettierConfig.rules,
    },
  },
]