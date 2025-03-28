import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // API的基础URL
  timeout: 15000, // 请求超时时间
  withCredentials: true // 允许携带cookie
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果有token，添加到请求头
    const token = localStorage.getItem('token');
    const tokenHead = localStorage.getItem('tokenHead');
    if (token && tokenHead && config.headers) {
      config.headers['Authorization'] = tokenHead + ' ' + token;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 如果返回的状态码不是200，则判断为错误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3 * 1000
      });

      // 401: 未登录或token过期
      if (res.code === 401) {
        // 清除本地token
        localStorage.removeItem('token');
        localStorage.removeItem('tokenHead');
        localStorage.removeItem('userInfo');
        
        // 跳转到登录页
        router.push('/login');
      }
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res;
    }
  },
  (error) => {
    console.log('请求错误: ' + error);
    let message = error.message;
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请登录';
          // 清除本地token
          localStorage.removeItem('token');
          localStorage.removeItem('tokenHead');
          localStorage.removeItem('userInfo');
          router.push('/login');
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求错误，未找到该资源';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `连接错误${error.response.status}`;
      }
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

export default service; 