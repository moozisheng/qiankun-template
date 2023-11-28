import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let instance: any = null
function render(props: any = {}) {
  const { container } = props
  instance = createApp(App)
  // instance.use(router)
  instance?.mount(container ? container.querySelector('#app') : '#app')
  console.log('开始加载相关内容')
}
/*
 * bootstrap :
 * 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 * mount :
 *  应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 * unmount :
 *  应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 * update :
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 * */
renderWithQiankun({
  mount(props: any) {
    // 应用每次进入都会调用 mount 方法，所以我们在这里初始化一些内容
    render(props)
  },
  bootstrap() {
    console.log('微应用初始化的时候调用一次')
  },
  update() {
    console.log('update')
  },
  unmount(props: any) {
    console.log('unmount:应用每次 切出/卸载 会调用的方法', props)
    instance.unmount()
    instance._container.innerHTML = ''
    instance = null
  }
})
/*
 * 通过 qiankunWindow.__POWERED_BY_QIANKUN__ 判断是不是 qiankun 渲染的，如果不是 qiankun 渲染的，需要调用以下 render 方法来初始化一些内容
 * */
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('并不是qiankun渲染')
  render()
}
