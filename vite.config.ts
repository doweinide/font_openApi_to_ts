import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  console.log('env.VITE_TRAE_PATH',env.VITE_TRAE_PATH)
  const { VITE_USE_COMPRESS, VITE_USE_PWA, VITE_USE_DEVTOOLS, VITE_TRAE_PATH } = env

  const plugins: PluginOption[] = [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VITE_USE_DEVTOOLS === 'true' && vueDevTools({
      launchEditor: VITE_TRAE_PATH || 'code'
    }),
  ].filter(Boolean)

  // 生产环境启用压缩
  if (command === 'build' && VITE_USE_COMPRESS === 'true') {
    plugins.push(
      compression({
        algorithm: 'gzip',
        deleteOriginalAssets: false,
      })
    )
  }

  // 启用构建分析
  // if (command === 'build' && VITE_USE_ANALYZE === 'true') {
  //   plugins.push(
  //     visualizer({
  //       open: true,
  //       filename: 'stats.html',
  //       gzipSize: true,
  //       brotliSize: true,
  //     })
  //   )
  // }

  // 启用 PWA
  if (VITE_USE_PWA === 'true') {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: env.VITE_APP_TITLE,
          short_name: env.VITE_APP_TITLE,
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      })
    )
  }

  return {
    base: env.VITE_PUBLIC_PATH,
    plugins: plugins as PluginOption[],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 3000,
      proxy: {
        '/museum': {
          target: env.VITE_API_BASE_URL_PROXY,
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(/^\/museum/, '');
            console.log(`代理请求: ${path} → ${env.VITE_API_BASE_URL_PROXY}${newPath}`);
            return newPath;
          }
        },
      },
    },
    build: {
      target: 'es2015',
      outDir: env.VITE_OUTDIR_PATH,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            lodash: ['lodash'],
            crypto: ['crypto-js'],
          },
        },
      },
    },
  }
})
