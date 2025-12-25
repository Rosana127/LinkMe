import request from './request'

/**
 * 获取标签定义列表（来自 tag_def 表）
 * 兼容多种返回结构：
 * - 直接数组
 * - { data: [...] }
 * - { records: [...] }
 */
export async function fetchTagDefinitions(params = {}) {
  const res = await request({
    url: '/tags', // 后端应提供的标签定义接口
    method: 'get',
    params
  })

  if (Array.isArray(res)) {
    return res
  }

  if (res?.data && Array.isArray(res.data)) {
    return res.data
  }

  if (res?.records && Array.isArray(res.records)) {
    return res.records
  }

  return []
}

const tagsApi = {
  fetchTagDefinitions
}

export default tagsApi

