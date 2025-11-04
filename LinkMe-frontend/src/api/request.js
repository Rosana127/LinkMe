import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:8080', // 后端API地址
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从store获取token
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 后端返回的数据格式: { code, message, data }
    const res = response.data
    if (res.code === 200) {
      return res.data
    } else {
      // 处理业务错误
      const message = res.message || '请求失败'
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        // token过期或未授权，清除用户信息并跳转到登录页
        const authStore = useAuthStore()
        authStore.logout()
      }
    }
    return Promise.reject(error)
  }
)

export default request

