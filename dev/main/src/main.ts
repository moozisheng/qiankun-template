import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerMicroApps, start, setDefaultMountApp } from 'qiankun'
import App from './App.vue'
import router from './router'
import microApps from './microApps'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// 设置默认进入的子应用无法生效 router实现
// setDefaultMountApp('/sub-vue-vite')
router.push({
  path: '/sub-vue-vite'
})

registerMicroApps(microApps, {
  // @ts-ignore
  beforeLoad: (app) => {
    console.log('before load app.name====>>>>>', app.name)
  },
  beforeMount: [
    // @ts-ignore
    (app) => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
    }
  ],
  afterMount: [
    // @ts-ignore
    (app) => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
    }
  ],
  afterUnmount: [
    // @ts-ignore
    (app) => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
    }
  ]
})

start()
