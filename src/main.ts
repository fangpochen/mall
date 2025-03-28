import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './store'
import axios from 'axios'

// 设置API请求基础URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'

// 创建应用实例
const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

console.log('应用正在初始化...')

// 使用插件
app.use(router)
app.use(ElementPlus)
app.use(pinia)

// 挂载应用
app.mount('#app') 