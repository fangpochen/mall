import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// API基础配置
const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/mall-portal',
  timeout: 15000,
  withCredentials: true
};

// 创建axios实例
const http = axios.create(baseConfig);

// 消息显示控制 - 避免同时显示多个相同错误
let messageLock = false;
const showMessage = (message, type = 'error', duration = 3000) => {
  if (messageLock) return;
  messageLock = true;
  ElMessage({
    message,
    type,
    duration
  });
  setTimeout(() => {
    messageLock = false;
  }, 1000);
};

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    const tokenHead = localStorage.getItem('tokenHead');
    
    // 如果有token，添加到请求头
    if (token && tokenHead && config.headers) {
      config.headers['Authorization'] = `${tokenHead} ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    const { data } = response;
    
    // 如果不是标准响应格式，直接返回
    if (data === null || typeof data !== 'object' || data.code === undefined) {
      return response.data;
    }
    
    // 处理标准响应
    if (data.code === 200) {
      return data;
    } else {
      // 处理401未授权
      if (data.code === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenHead');
        localStorage.removeItem('userInfo');
        
        router.push({
          path: '/user/login',
          query: { redirect: router.currentRoute.value.fullPath }
        });
      }
      
      // 显示错误消息
      showMessage(data.message || '操作失败', 'error');
      
      return Promise.reject(new Error(data.message || '操作失败'));
    }
  },
  (error) => {
    console.error('响应错误:', error);
    
    let message = '网络错误';
    
    if (error.response) {
      // 服务器返回了错误响应
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          localStorage.removeItem('token');
          localStorage.removeItem('tokenHead');
          localStorage.removeItem('userInfo');
          
          router.push({
            path: '/user/login',
            query: { redirect: router.currentRoute.value.fullPath }
          });
          break;
        case 403:
          message = '无访问权限';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器错误';
          break;
        default:
          message = `请求失败(${error.response.status})`;
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      message = '服务器无响应';
    }
    
    showMessage(message, 'error');
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get(url, params = {}, config = {}) {
    return http.get(url, { params, ...config });
  },
  
  post(url, data = {}, config = {}) {
    return http.post(url, data, config);
  },
  
  put(url, data = {}, config = {}) {
    return http.put(url, data, config);
  },
  
  delete(url, params = {}, config = {}) {
    return http.delete(url, { params, ...config });
  }
};

export default request; 