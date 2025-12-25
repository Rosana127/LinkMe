export function parseJwtPayload(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    // base64url -> base64
    const b64 = payload.replaceAll('-', '+').replaceAll('_', '/')
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => '%' + ('00' + c.codePointAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export function buildUpdatePayload(form) {
  const data = {
    nickname: form.nickname?.trim() || undefined,
    bio: form.bio?.trim() || undefined,
    avatarUrl: form.avatar || undefined // 将 avatar 映射为 avatarUrl
  }
  for (const k of Object.keys(data)) {
    const v = data[k]
    // 对于 avatarUrl，只要不是 undefined 且不是空字符串，就保留（base64 字符串应该保留）
    if (k === 'avatarUrl') {
      if (v === undefined || (typeof v === 'string' && v.trim() === '')) {
        delete data[k]
      }
    } else {
      // 对于其他字段，空字符串应该被删除
      if (v === undefined || (typeof v === 'string' && v.trim() === '')) {
        delete data[k]
      }
    }
  }
  return data
}

export function extractServerMessage(error) {
  if (error && error.httpData) {
    return error.httpData.message || error.httpData.msg || JSON.stringify(error.httpData)
  }
  if (error && error.response && error.response.data) {
    const r = error.response.data
    return r?.message || r?.error || r?.msg || JSON.stringify(r)
  }
  return error?.message || '未知错误'
}
