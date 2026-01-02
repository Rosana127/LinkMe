<template>
  <div class="app-container">
    <!-- 登录和注册页面 - 不显示推荐内容 -->
    <template v-if="isAuthPage">
      <router-view />
    </template>
    
    <!-- 其他页面显示完整布局 -->
    <template v-else>
      <!-- 侧边栏 -->
      <Sidebar />
      
      <!-- 主内容区域 -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- 左侧主内容区 -->
          <div class="main-feed">
            <router-view />
          </div>
          
          <!-- 右侧栏 - 根据页面显示不同内容 -->
          <div class="right-sidebar" v-if="showRightSidebar">
            <!-- 右侧栏内容已移除 -->
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from './components/Sidebar.vue'
import { initTheme, applyTheme } from '@/utils/theme'

const route = useRoute()
const authStore = useAuthStore()

// 判断是否为登录/注册页面
const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'register'
})

// 控制右侧栏显示，只有home页面显示，且需要登录
const showRightSidebar = computed(() => {
  if (!authStore.isAuthenticated) {
    return false // 未登录时不显示右侧栏
  }
  return route.name === 'home' // 只显示home页面的右侧栏
})

// 路由监听和组件加载相关代码已简化

// 初始化主题
onMounted(() => {
  initTheme()
})

// 监听路由变化，重新应用主题到新页面
watch(() => route.name, () => {
  setTimeout(() => {
    applyTheme()
  }, 200)
})

// 用户统计数据相关代码已移除


</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

.main-content {
  flex: 1;
  padding: 20px 20px 20px 40px;
  margin-left: 260px;
  background-color: #ffffff;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  max-width: 100%;
  margin: 0;
  width: 100%;
}

.main-feed {
  flex: 1;
}

.right-sidebar {
  width: 300px;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  height: calc(100vh - 40px);
}

.stat-card {
  background-color: #222222;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s, background-color 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  background-color: #2a2a2a;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #8b5cf6;
}

.stat-label {
  font-size: 12px;
  color: #888888;
  margin-top: 4px;
}

.top-categories {
  margin-top: 20px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}

.category-item:hover {
  background-color: #333333;
  transform: translateX(4px);
}

.category-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
}

.category-icon .iconify {
  font-size: 16px;
  color: #8b5cf6;
}

.category-name {
  flex: 1;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.category-count {
  color: #888888;
  font-size: 12px;
  font-weight: 600;
}

/* 滚动条样式 */
.category-list::-webkit-scrollbar {
  width: 4px;
}

.category-list::-webkit-scrollbar-track {
  background: transparent;
}

.category-list::-webkit-scrollbar-thumb {
  background: #444444;
  border-radius: 2px;
}

.category-list::-webkit-scrollbar-thumb:hover {
  background: #555555;
}
</style>
