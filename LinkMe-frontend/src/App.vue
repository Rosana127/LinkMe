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
            <!-- Saved页面 - 收藏统计 -->
            <div class="recommendation-section">
              <h3 class="section-title">Saved Stats</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-number">24</div>
                  <div class="stat-label">Total Saved</div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">8</div>
                  <div class="stat-label">This Week</div>
                </div>
              </div>
              
              <div class="top-categories">
                <h4 class="summary-title">Top Categories</h4>
                <div class="category-list">
                  <div 
                    v-for="category in topCategories" 
                    :key="category.name"
                    class="category-item"
                  >
                    <span class="category-icon">
                      <span class="iconify" :data-icon="category.icon" data-inline="false"></span>
                    </span>
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-count">{{ category.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from './components/Sidebar.vue'

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


// Saved页面 - 热门分类
const topCategories = ref([
  {
    name: 'Photos',
    count: 12,
    icon: 'mdi:image'
  },
  {
    name: 'Travel',
    count: 8,
    icon: 'mdi:map'
  },
  {
    name: 'Music',
    count: 5,
    icon: 'mdi:music'
  },
  {
    name: 'Food',
    count: 4,
    icon: 'mdi:food'
  }
])
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff; /* 修改背景色为白色 */
}


.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 260px;
  background-color: #ffffff;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
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

.recommendation-section {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff; /* 保持文字为白色以确保在深色卡片上的可读性 */
  margin-bottom: 20px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: #222222;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
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
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: #333333;
}

.category-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon .iconify {
  font-size: 16px;
  color: #8b5cf6;
}

.category-name {
  flex: 1;
  color: #ffffff;
  font-size: 14px;
}

.category-count {
  color: #888888;
  font-size: 12px;
}
</style>
