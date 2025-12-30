// 生成文字头像（显示用户名字前两个字）
export function generateTextAvatar(name) {
  if (!name) return null
  
  // 获取名字前两个字
  const text = name.length >= 2 ? name.substring(0, 2) : name.substring(0, 1)
  
  // 创建 canvas 生成头像
  const canvas = document.createElement('canvas')
  canvas.width = 80
  canvas.height = 80
  const ctx = canvas.getContext('2d')
  
  // 生成随机背景色（基于名字的哈希值）
  const colors = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#ec4899', '#06b6d4', '#6366f1'
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const bgColor = colors[hash % colors.length]
  
  // 绘制背景
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制文字
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  
  return canvas.toDataURL()
}

// 获取头像 URL（优先使用真实头像，否则生成文字头像）
export function getAvatarUrl(avatar, name) {
  if (avatar && avatar !== 'https://via.placeholder.com/80') {
    return avatar
  }
  
  // 如果没有头像，生成文字头像
  if (name) {
    return generateTextAvatar(name) || 'https://via.placeholder.com/80'
  }
  
  return 'https://via.placeholder.com/80'
}

// 处理头像加载错误
export function handleAvatarError(event, name) {
  // 如果头像加载失败，生成文字头像
  if (name) {
    const textAvatar = generateTextAvatar(name)
    if (textAvatar) {
      event.target.src = textAvatar
    }
  }
}

