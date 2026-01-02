// 主题管理工具

const THEME_STORAGE_KEY = 'app_theme'
const THEMES = {
  NONE: 'none',
  NATSUME: 'natsume' // 夏目主题
}

// 主题配置
const THEME_CONFIG = {
  [THEMES.NONE]: {
    name: '无主题',
    backgroundImage: null
  },
  [THEMES.NATSUME]: {
    name: '夏目主题',
    backgroundImage: '/theme-natsume.jpg' // 用户需要将图片放在public目录下
  }
}

// 获取当前主题
export function getCurrentTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  return saved || THEMES.NONE
}

// 设置主题
export function setTheme(theme) {
  if (!THEME_CONFIG[theme]) {
    console.warn(`未知主题: ${theme}`)
    return
  }
  
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

// 应用主题到指定页面容器
function applyThemeToContainer(container, theme) {
  if (!container) return
  
  const config = THEME_CONFIG[theme]
  if (!config) return
  
  // 移除所有主题类
  container.classList.remove(...Object.values(THEMES).map(t => `theme-${t}`))
  
  // 添加当前主题类
  container.classList.add(`theme-${theme}`)
  
  // 设置背景图片
  if (config.backgroundImage) {
    // 使用CSS变量和伪元素实现背景图片，60%透明度
    container.style.setProperty('--theme-bg-image', `url(${config.backgroundImage})`)
    container.classList.add('has-theme-bg')
  } else {
    container.style.removeProperty('--theme-bg-image')
    container.classList.remove('has-theme-bg')
  }
}

// 应用主题
export function applyTheme(theme = null) {
  const currentTheme = theme || getCurrentTheme()
  const config = THEME_CONFIG[currentTheme]
  
  console.log('应用主题:', currentTheme, config)
  
  if (!config) {
    console.warn(`主题配置不存在: ${currentTheme}`)
    return
  }
  
  // 应用到主内容区域（.main-content），这是包含所有三个页面的最大容器
  const mainContent = document.querySelector('.main-content')
  
  console.log('找到的主内容容器:', mainContent)
  
  if (mainContent) {
    applyThemeToContainer(mainContent, currentTheme)
  }
  
  // 使用MutationObserver监听新页面加载
  if (!window.themeObserver) {
    window.themeObserver = new MutationObserver(() => {
      setTimeout(() => {
        const mainContent = document.querySelector('.main-content')
        if (mainContent && !mainContent.classList.contains(`theme-${currentTheme}`)) {
          applyThemeToContainer(mainContent, currentTheme)
        }
      }, 100)
    })
    
    window.themeObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

// 获取所有可用主题
export function getAvailableThemes() {
  return Object.entries(THEME_CONFIG).map(([key, config]) => ({
    id: key,
    name: config.name,
    backgroundImage: config.backgroundImage
  }))
}

// 初始化主题（在应用启动时调用）
export function initTheme() {
  applyTheme()
}

export { THEMES, THEME_CONFIG }

