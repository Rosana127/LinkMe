import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建axios实例
const request = axios.create({
  baseURL: '/api', // 使用代理路径，通过Vite代理转发到后端
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
      const res = error.response.data
      
      if (status === 401) {
        // token过期或未授权，清除用户信息并跳转到登录页
        const authStore = useAuthStore()
        authStore.logout()
      }
      
      // 如果有后端返回的错误消息，使用它
      if (res && res.message) {
        return Promise.reject(new Error(res.message))
      }
      
      // 根据状态码返回相应的错误消息
      let message = '请求失败'
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '没有权限访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败 (${status})`
      }
      return Promise.reject(new Error(message))
    } else if (error.request) {
      // 请求已发出但没有收到响应，可能是网络问题或CORS问题
      return Promise.reject(new Error('网络连接失败，请检查网络或联系管理员'))
    } else {
      // 其他错误
      return Promise.reject(new Error(error.message || '请求失败，请重试'))
    }
  }
)

export default request

