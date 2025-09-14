<template>
  <el-dropdown trigger="click" @command="handleLocaleChange">
    <button
      class="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900 hover:shadow-xl"
    >
      <svg
        class="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="option in LOCALE_OPTIONS"
          :key="option.value"
          :command="option.value"
          :class="{
            'font-medium text-blue-600': currentLocale === option.value,
          }"
        >
          <div class="flex w-full items-center justify-between">
            <span>{{ option.label }}</span>
            <svg
              v-if="currentLocale === option.value"
              class="h-4 w-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { getCurrentLocale, LOCALE_OPTIONS, setLocale } from '@/locales'

  const { t } = useI18n()
  const currentLocale = ref(getCurrentLocale())

  const handleLocaleChange = (locale: string) => {
    setLocale(locale)
    currentLocale.value = locale
    const selectedOption = LOCALE_OPTIONS.find(opt => opt.value === locale)
    ElMessage.success(`${t('settings.language')}: ${selectedOption?.label}`)
  }
</script>
