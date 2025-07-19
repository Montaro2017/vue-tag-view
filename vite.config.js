import { fileURLToPath, URL } from 'node:url'

import UnoCss from "unocss/vite"
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const proxyServer = env.VITE_PROXY_SERVER
  const appTitle = env.VITE_APP_TITLE
  return {
    root: 'vue-tag-view',
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      UnoCss(),
      createHtmlPlugin({
        inject: {
          data: {
            'APP_TITLE': appTitle
          }
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        '/api': proxyServer
      }
    }
  }
})
