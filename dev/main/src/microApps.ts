const microApps = [
  {
    name: 'sub-vue-vite',
    entry: '//localhost:5001/',
    activeRule: '/sub-vue-vite',
    container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: '/sub-vue-vite' // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
    }
  },
  {
    name: 'sub-react-vite',
    entry: '//localhost:5002/',
    activeRule: '/sub-react-vite',
    container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: '/sub-react-vite'
    }
  },
  {
    name: 'sub-react-webpack',
    entry: '//localhost:5003/',
    activeRule: '/sub-react-webpack',
    container: '#subapp-viewport', // 子应用挂载的div
    props: {
      routerBase: '/sub-react-webpack'
    }
  }
]

export default microApps
