<script setup lang="ts">
  import { ElConfigProvider } from 'element-plus'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { RouterView } from 'vue-router'

  import { getCurrentElementPlusLocale } from './locales'

  const { locale } = useI18n()

  // 响应式的 Element Plus 语言包
  const elementPlusLocale = computed(() => {
    return getCurrentElementPlusLocale()
  })
</script>

<template>
  <el-config-provider :locale="elementPlusLocale">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
