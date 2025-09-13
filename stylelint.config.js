export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue',
    'stylelint-prettier/recommended',
  ],
  plugins: [
    'stylelint-order',
    '@stylistic/stylelint-plugin',
    'stylelint-scss',
  ],
  customSyntax: 'postcss-html',
  overrides: [
    {
      files: ['**/*.scss', '**/*.sass'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // 基础规则
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands'],
      },
    ],
    
    // Vue特定规则
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted'],
      },
    ],
    
    // SCSS规则
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
        ],
      },
    ],
    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    
    // Tailwind CSS支持
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
        ],
      },
    ],
    
    // 选择器规范
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)([-_][a-z0-9]+)*$',
      {
        message: 'Expected class selector to be kebab-case or snake_case',
      },
    ],
    
    // 属性排序（使用recess-order）
    'order/properties-order': null, // 使用recess-order的排序
    
    // 禁用与Prettier冲突的规则
    'prettier/prettier': true,
    
    // 样式风格规则已由prettier处理
  },
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
    '**/*.js',
    '**/*.ts',
    '**/*.json',
  ],
}