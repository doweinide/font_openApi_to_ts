# 大屏缩放功能使用说明

## 概述

本项目为大屏展示项目，支持动态缩放功能，可以适配不同尺寸的显示设备。提供两种缩放模式：

- **比例不变模式 (fit)**: 保持设计稿的宽高比，内容可能不会占满整个屏幕，但不会变形
- **占满模式 (fill)**: 内容占满整个屏幕，可能会根据屏幕比例进行拉伸

## 配置方式

### 环境变量配置

在项目根目录的 `.env` 文件中配置：

```env
# 大屏缩放模式配置
# 可选值: 'fit' (比例不变模式) | 'fill' (占满模式)
VITE_SCALE_MODE=fit

# 设计稿尺寸
VITE_DESIGN_WIDTH=1920
VITE_DESIGN_HEIGHT=1080
```

### 配置参数说明

| 参数                 | 类型              | 默认值   | 说明       |
| -------------------- | ----------------- | -------- | ---------- |
| `VITE_SCALE_MODE`    | `'fit' \| 'fill'` | `'fit'`  | 缩放模式   |
| `VITE_DESIGN_WIDTH`  | `string`          | `'1920'` | 设计稿宽度 |
| `VITE_DESIGN_HEIGHT` | `string`          | `'1080'` | 设计稿高度 |

## 使用方式

### 基础使用

在 Vue 组件中使用 `useScreenScale` 组合式函数：

```vue
<script setup lang="ts">
  import {
    useScreenScale,
    createScreenContainer,
  } from '@/composables/useScreenScale'

  // 使用大屏缩放功能
  const { scaleStyle } = useScreenScale()

  // 创建容器样式
  const containerStyle = createScreenContainer()
</script>

<template>
  <!-- 大屏容器 -->
  <div class="screen-container" :style="containerStyle">
    <!-- 缩放内容区域 -->
    <main :style="scaleStyle">
      <!-- 你的内容 -->
    </main>
  </div>
</template>
```

### 高级配置

可以在使用时覆盖默认配置：

```typescript
const { scaleStyle } = useScreenScale({
  mode: 'fill', // 覆盖环境变量中的模式
  designWidth: 1920, // 覆盖设计稿宽度
  designHeight: 1080, // 覆盖设计稿高度
})
```

### 获取缩放信息

```typescript
const { getScaleInfo } = useScreenScale()

// 获取当前缩放信息
const info = getScaleInfo()
console.log(info)
// {
//   mode: 'fit',
//   scale: 0.8,
//   screenWidth: 1536,
//   screenHeight: 864,
//   designWidth: 1920,
//   designHeight: 1080,
//   translateX: 0,
//   translateY: 0
// }
```

## 开发调试

### 模式切换器

在开发环境下，页面右上角会显示一个模式切换器，可以实时切换缩放模式进行测试。

### 控制台信息

在浏览器控制台中可以查看当前的缩放信息和模式切换日志。

## 技术实现

### 核心文件

- `src/composables/useScreenScale.ts` - 缩放功能的核心实现
- `src/components/ScaleModeToggle.vue` - 开发环境的模式切换器
- `src/types/env.d.ts` - 环境变量类型定义

### 缩放算法

#### 比例不变模式 (fit)

```typescript
const scaleX = screenWidth / designWidth
const scaleY = screenHeight / designHeight
const scale = Math.min(scaleX, scaleY) // 取较小值保持比例

// 计算居中偏移
const scaledWidth = designWidth * scale
const scaledHeight = designHeight * scale
const translateX = (screenWidth - scaledWidth) / 2
const translateY = (screenHeight - scaledHeight) / 2
```

#### 占满模式 (fill)

```typescript
// 分别计算 X 和 Y 方向的缩放比例，内容会拉伸占满整个屏幕
const scaleX = screenWidth / designWidth
const scaleY = screenHeight / designHeight

style = {
  width: `${designWidth}px`,
  height: `${designHeight}px`,
  transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
  transformOrigin: 'top left',
}
```

## 最佳实践

1. **设计稿尺寸**: 建议使用标准的大屏尺寸，如 1920x1080
2. **响应式设计**: 在设计时考虑不同屏幕比例的适配
3. **性能优化**: 避免在缩放过程中进行复杂的动画
4. **测试**: 在不同尺寸的设备上测试缩放效果

## 常见问题

### Q: 为什么内容显示不完整？

A: 检查设计稿尺寸设置是否正确，确保 `VITE_DESIGN_WIDTH` 和 `VITE_DESIGN_HEIGHT` 与实际设计稿尺寸一致。

### Q: 如何在生产环境中切换模式？

A: 修改 `.env` 文件中的 `VITE_SCALE_MODE` 参数，然后重新构建项目。

### Q: 缩放后字体模糊怎么办？

A: 这是浏览器缩放的正常现象，可以尝试使用 `transform-origin` 和 `image-rendering` CSS 属性进行优化。

## 更新日志

- v1.0.0: 初始版本，支持 fit 和 fill 两种缩放模式
