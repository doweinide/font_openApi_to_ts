import { createI18n } from 'vue-i18n'
import zhCn from './zh-cn'
import en from './en'
import ja from './ja'

// Element Plus 语言包
import zhCnElementPlus from 'element-plus/es/locale/lang/zh-cn'
import enElementPlus from 'element-plus/es/locale/lang/en'
import jaElementPlus from 'element-plus/es/locale/lang/ja'

// 语言配置
export const LOCALE_OPTIONS = [
  { label: '简体中文', value: 'zh-cn' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' }
]

// Element Plus 语言包映射
export const elementPlusLocaleMap = {
  'zh-cn': zhCnElementPlus,
  'en': enElementPlus,
  'ja': jaElementPlus
}

// 获取默认语言
function getDefaultLocale() {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && LOCALE_OPTIONS.some(option => option.value === savedLocale)) {
    return savedLocale
  }
  
  // 根据浏览器语言自动选择
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) {
    return 'zh-cn'
  } else if (browserLang.startsWith('ja')) {
    return 'ja'
  }
  return 'en'
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    'zh-cn': zhCn,
    'en': en,
    'ja': ja
  }
})

export default i18n

// 切换语言的工具函数
export function setLocale(locale: string) {
  i18n.global.locale.value = locale as any
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}

// 获取当前语言
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 获取当前 Element Plus 语言包
export function getCurrentElementPlusLocale() {
  const currentLocale = getCurrentLocale()
  return elementPlusLocaleMap[currentLocale as keyof typeof elementPlusLocaleMap] || elementPlusLocaleMap.en
}