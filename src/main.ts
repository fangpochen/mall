import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import pinia from './store'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 设置API请求基础URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'

// 创建应用实例
const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue全局错误:', err, info)
  ElMessage.error('应用遇到了一个错误，请刷新页面或联系客服')
}

// 添加全局网络状态监控
window.addEventListener('online', () => {
  console.log('网络已连接')
  ElMessage.success('网络已恢复')
})

window.addEventListener('offline', () => {
  console.log('网络已断开')
  ElMessage.warning('网络连接已断开，部分功能可能不可用')
})

// 处理未捕获的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise错误:', event.reason)
  // 避免显示太多错误消息
  if (event.reason && event.reason.message && !event.reason.message.includes('请求超时')) {
    ElMessage.error('操作失败，请稍后再试')
  }
})

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