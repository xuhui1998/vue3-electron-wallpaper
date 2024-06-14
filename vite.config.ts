import path from 'path';
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      // 注册 SvgIconsPlugin 插件，并添加需要处理的 SVG 文件的路径
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: '[name]',
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
