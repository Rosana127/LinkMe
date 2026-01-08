// 主题管理工具

const THEME_STORAGE_KEY = 'app_theme'
const THEMES = {
  LIGHT: 'light', // 白色主题
  DARK: 'dark' // 黑色主题
}

// 主题配置（只保留黑白两种）
const THEME_CONFIG = {
  [THEMES.LIGHT]: {
    name: '浅色主题',
    backgroundColor: '#ffffff'
  },
  [THEMES.DARK]: {
    name: '深色主题',
    // 参考 Messages 界面的深色灰背景（接近 Tailwind 的 bg-gray-900）
    backgroundColor: '#111827'
  }
}

// 获取当前主题
export function getCurrentTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  // 兼容老的存储值，默认回退到浅色主题
  if (saved && THEME_CONFIG[saved]) {
    return saved
  }
  return THEMES.LIGHT
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
  
  // 设置背景颜色（用于黑色主题）
  if (config.backgroundColor) {
    container.style.setProperty('--theme-bg-color', config.backgroundColor)
    container.classList.add('has-theme-bg-color')
  } else {
    container.style.removeProperty('--theme-bg-color')
    container.classList.remove('has-theme-bg-color')
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
  
  // 应用到整体容器（.app-container）和主内容区域（.main-content）
  const appContainer = document.querySelector('.app-container')
  const mainContent = document.querySelector('.main-content')
  
  console.log('找到的容器:', { appContainer, mainContent })
  
  if (appContainer) {
    applyThemeToContainer(appContainer, currentTheme)
  }
  
  if (mainContent) {
    applyThemeToContainer(mainContent, currentTheme)
  }
  
  // 使用MutationObserver监听新页面加载
  if (!globalThis.themeObserver) {
    globalThis.themeObserver = new MutationObserver(() => {
      setTimeout(() => {
        const appContainer = document.querySelector('.app-container')
        const mainContent = document.querySelector('.main-content')
        if (appContainer && !appContainer.classList.contains(`theme-${currentTheme}`)) {
          applyThemeToContainer(appContainer, currentTheme)
        }
        if (mainContent && !mainContent.classList.contains(`theme-${currentTheme}`)) {
          applyThemeToContainer(mainContent, currentTheme)
        }
      }, 100)
    })
    
    globalThis.themeObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

// 获取所有可用主题
export function getAvailableThemes() {
  return Object.entries(THEME_CONFIG).map(([key, config]) => ({
    id: key,
    name: config.name
  }))
}

// 初始化主题（在应用启动时调用）
export function initTheme() {
  applyTheme()
}

export { THEMES, THEME_CONFIG }

