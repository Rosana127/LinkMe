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
    
    // 开发环境下的请求日志（便于调试）
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
        hasToken: !!authStore.token,
        headers: config.headers
      })
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 开发环境下的响应日志（便于调试）
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    
    // 兼容多种后端返回格式：
    // 1) 统一格式 { code, message, data } -> 返回 data 当 code === 200
    // 2) 传统 RESTful 返回直接的对象或数组 (可能伴随 HTTP 200/201) -> 直接返回 response.data
    const res = response.data

    // 如果后端使用统一 code 结构
    if (res && typeof res === 'object' && Object.prototype.hasOwnProperty.call(res, 'code')) {
      if (res.code === 200) {
        return res.data
      }
      const message = res.message || '请求失败'
      return Promise.reject(new Error(message))
    }

    // 否则当作标准 RESTful 响应直接返回（允许 200/201 等）
    return res
  },
  (error) => {
    // 开发环境下的错误日志（便于调试）
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        request: error.request
      })
    }
    
    // 处理HTTP错误
    if (error.response) {
      const status = error.response.status
      const res = error.response.data
      
      if (status === 401) {
        // token过期或未授权，只有在已登录状态下才清除用户信息
        const authStore = useAuthStore()
        if (authStore.isAuthenticated) {
          authStore.logout()
        }
        // 未登录用户访问需要认证的接口时，统一显示友好的提示
        // 如果有后端返回的错误消息，优先使用；否则使用默认提示
        const errorMessage = (res && res.message) ? res.message : '请先登录账号'
        return Promise.reject(new Error(errorMessage))
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
      // 请求已发出但没有收到响应，可能是网络问题、CORS问题或后端服务未启动
      console.error('[Network Error] 请求已发出但未收到响应', {
        url: error.config?.url,
        message: '请检查：1. 后端服务是否运行 2. 代理配置是否正确 3. 网络连接是否正常'
      })
      return Promise.reject(new Error('网络连接失败，请检查：1. 后端服务是否运行在 localhost:8080 2. 网络连接是否正常'))
    } else {
      // 其他错误
      console.error('[Request Error]', error.message)
      return Promise.reject(new Error(error.message || '请求失败，请重试'))
    }
  }
)

export default request

