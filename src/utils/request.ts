import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { ElLoading } from 'element-plus'
import NProgress from 'nprogress'
import { nextTick } from 'vue'

import { decrypt, encrypt } from './crypto'

// 全局loading实例
let loadingInstance: any = null
let requestCount = 0

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 35000,
  // 👇 关键：跨域时带上 cookie 等凭证
  // withCredentials: true,
})

// 显示loading
const showLoading = () => {
  if (requestCount === 0) {
    // 使用Element Plus Loading服务，确保全屏显示
    loadingInstance = ElLoading.service({
      background: 'rgba(0, 0, 0, 0.7)',
      fullscreen: true, // 确保全屏显示
      lock: true,
      text: '加载中...',
    })
  }
}

// 隐藏loading
const hideLoading = () => {
  requestCount--
  if (requestCount <= 0) {
    requestCount = 0
    if (loadingInstance) {
      // 按照Element Plus官方文档建议，异步关闭Loading
      nextTick(() => {
        loadingInstance?.close()
        loadingInstance = null
      })
    }
  }
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 开启进度条
    NProgress.start()

    // 显示全局loading（除非配置中明确禁用）
    const shouldShowLoading = config.headers?.['showLoading']
    if (shouldShowLoading !== false && shouldShowLoading !== 'false') {
      console.log(
        'config.headers?.showLoading',
        config.headers?.['showLoading'],
      )
      showLoading()
    }

    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 加密请求数据
    if (config.data && config.headers['encrypt'] === true) {
      config.data = encrypt(JSON.stringify(config.data))
      delete config.headers['encrypt']
    }

    // 添加时间戳，防止缓存
    // if (config.method?.toLowerCase() === 'get') {
    //   config.params = { ...config.params, _t: Date.now() }
    // }
    return config
  },
  error => {
    NProgress.done()
    hideLoading()
    console.error('请求错误：', error)
    return Promise.reject(
      error instanceof Error ? error : new Error(error?.message || '请求错误'),
    )
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()

    // 隐藏loading（除非配置中明确禁用）
    const shouldShowLoading = response.config.headers?.['showLoading']
    if (shouldShowLoading !== false && shouldShowLoading !== 'false') {
      hideLoading()
    }

    const res = response.data

    // 解密响应数据
    if (response.config.headers['decrypt'] === true) {
      try {
        const decryptedData = decrypt(res.data)
        res.data = JSON.parse(decryptedData)
      } catch (error) {
        console.error('解密失败：', error)
      }
    }
    console.log('log', res)
    // 统一错误处理
    if (res.code == 401) {
      // 401: 未登录或token过期

      // 清除用户信息
      localStorage.removeItem('token')
      location.reload()
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    NProgress.done()
    hideLoading()
    console.error('响应错误：', error)
    return Promise.reject(error)
  },
)

// 封装GET请求
export const get = <T>(
  url: string,
  params?: any,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  return service.get(url, { params, ...config })
}

// 封装POST请求
export const post = <T>(
  url: string,
  data?: any,
  config: AxiosRequestConfig = {
    // 👇 关键：跨域时带上 cookie 等凭证
    // withCredentials: true,
  },
): Promise<T> => {
  return service.post(url, data, config)
}

// 封装PUT请求
export const put = <T>(
  url: string,
  data?: any,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  return service.put(url, data, config)
}

// 封装DELETE请求
export const del = <T>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  return service.delete(url, config)
}

export default service
