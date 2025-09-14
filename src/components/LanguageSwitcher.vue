<template>
  <el-select
    v-model="currentLocale"
    @change="handleLocaleChange"
    :class="props.class || 'w-40'"
    :size="props.size || 'default'"
  >
    <el-option
      v-for="option in LOCALE_OPTIONS"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'
  import { LOCALE_OPTIONS, setLocale, getCurrentLocale } from '@/locales'

  interface Props {
    class?: string
    size?: 'large' | 'default' | 'small'
  }

  const props = withDefaults(defineProps<Props>(), {
    class: 'w-40',
    size: 'default'
  })

  const { t } = useI18n()
  const currentLocale = ref(getCurrentLocale())

  const handleLocaleChange = (locale: string) => {
    setLocale(locale)
    currentLocale.value = locale
    const selectedOption = LOCALE_OPTIONS.find(opt => opt.value === locale)
    ElMessage.success(`${t('settings.language')}: ${selectedOption?.label}`)
  }
</script>