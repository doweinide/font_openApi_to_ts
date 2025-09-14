<script setup lang="ts">
  import { computed } from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import { RouterView } from 'vue-router'
  import { useI18n } from 'vue-i18n'
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
