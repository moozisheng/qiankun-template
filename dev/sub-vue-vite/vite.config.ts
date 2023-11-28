// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   server: {
//     port: 5002,
//     headers: {
//       'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
//     }
//   }
// })

// vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    qiankun('sub-vue-vite', {
      // 微应用名字，与主应用注册的微应用名字保持一致
      useDevMode: true
    })
  ],
  server: {
    port: 5001, // 微应用端口号，与主应用注册的微应用保持一致,
    headers: {
      'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
