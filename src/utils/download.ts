// 文件下载工具
import JSZip from 'jszip'

import type { GeneratedFile, DownloadOptions } from '@/types/openapi'

/**
 * 下载单个文件
 * @param file 文件对象
 */
export function downloadSingleFile(file: GeneratedFile): void {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = file.path.split('/').pop() || 'file.txt'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * 下载多个文件为 ZIP 包
 * @param options 下载选项
 */
export async function downloadAsZip(options: DownloadOptions): Promise<void> {
  const { filename = 'openapi-typescript-generated.zip', files } = options

  if (!files.length) {
    throw new Error('没有文件可下载')
  }

  const zip = new JSZip()

  // 添加所有文件到 ZIP
  files.forEach(file => {
    zip.file(file.path, file.content)
  })

  try {
    // 生成 ZIP 文件
    const content = await zip.generateAsync({
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
      type: 'blob',
    })

    // 创建下载链接
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error('ZIP 文件生成失败')
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代 Clipboard API
      await navigator.clipboard.writeText(text)
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  } catch (error) {
    throw new Error('复制到剪贴板失败')
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

/**
 * 获取文件的 MIME 类型
 * @param filename 文件名
 * @returns MIME 类型
 */
export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename).toLowerCase()

  const mimeTypes: Record<string, string> = {
    js: 'text/javascript',
    json: 'application/json',
    jsx: 'text/javascript',
    md: 'text/markdown',
    ts: 'text/typescript',
    tsx: 'text/typescript',
    txt: 'text/plain',
  }

  return mimeTypes[ext] || 'text/plain'
}

/**
 * 验证文件名是否合法
 * @param filename 文件名
 * @returns 是否合法
 */
export function isValidFilename(filename: string): boolean {
  // 检查文件名是否包含非法字符
  const invalidChars = /[<>:"/\\|?*]/
  return !invalidChars.test(filename) && filename.trim().length > 0
}

/**
 * 清理文件名，移除非法字符
 * @param filename 原始文件名
 * @returns 清理后的文件名
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .trim()
}

/**
 * 创建文件预览 URL
 * @param content 文件内容
 * @param mimeType MIME 类型
 * @returns 预览 URL
 */
export function createPreviewUrl(content: string, mimeType: string): string {
  const blob = new Blob([content], { type: mimeType })
  return URL.createObjectURL(blob)
}

/**
 * 释放预览 URL
 * @param url 预览 URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}
