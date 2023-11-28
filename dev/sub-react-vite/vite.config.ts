// vite.config.js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'

import qiankun from 'vite-plugin-qiankun'

// export default defineConfig({
//   base: './',
//   plugins: [
//     qiankun('sub-react-vite', {
//       // 微应用名字，与主应用注册的微应用名字保持一致
//       useDevMode: true
//     })
//   ],
//   server: {
//     port: 5002, // 微应用端口号，与主应用注册的微应用保持一致,
//     headers: {
//       'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
//     }
//   },
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   }
// })

export default defineConfig(({ command, mode }) => {
  const __DEV__ = mode === 'development'
  return {
    plugins: [
      qiankun('sub-react-vite', {
        // 微应用名字，与主应用注册的微应用名字保持一致
        useDevMode: true
      })
    ],
    server: {
      port: 5002, // 微应用端口号，与主应用注册的微应用保持一致,
      // 设置 origin 是因为图片资源会找错位置所以通过这个让图片等资源不会找错
      // https://blog.csdn.net/m0_55861837/article/details/127553805
      // https://blog.csdn.net/m0_37653407/article/details/131109089
      origin: '//localhost:5002',
      headers: {
        'Access-Control-Allow-Origin': '*' // 主应用获取子应用时跨域响应头
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
    // base: __DEV__ ? '/' : '//localhost:5002'
  }
})
