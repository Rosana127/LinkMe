<template>
  <div class="app-container">
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
          <!-- Explore页面 - Top Creators 和原Home页面内容 -->
          <div v-if="route.name === 'discover'" class="recommendation-section">
            <h3 class="section-title">Top Creators</h3>
            <div class="creators-grid">
              <div 
                v-for="creator in topCreators" 
                :key="creator.id"
                class="creator-card"
              >
                <div class="creator-avatar">
                  <img 
                    :src="creator.avatar" 
                    :alt="creator.name"
                    class="w-12 h-12 rounded-full object-cover"
                  >
                </div>
                <div class="creator-info">
                  <div class="creator-name">{{ creator.name }}</div>
                  <div class="creator-handle">@{{ creator.handle }}</div>
                </div>
                <button class="follow-btn">Follow</button>
              </div>
            </div>
            
            <!-- 原Home页面内容 -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="section-title">Suggested for you</h3>
              <div class="creators-grid">
                <div 
                  v-for="user in suggestedUsers" 
                  :key="user.id"
                  class="creator-card"
                >
                  <div class="creator-avatar">
                    <img 
                      :src="user.avatar" 
                      :alt="user.name"
                      class="w-12 h-12 rounded-full object-cover"
                    >
                  </div>
                  <div class="creator-info">
                    <div class="creator-name">{{ user.name }}</div>
                    <div class="creator-handle">@{{ user.handle }}</div>
                  </div>
                  <button class="follow-btn">Follow</button>
                </div>
              </div>
              
              <div class="activity-summary">
                <h4 class="summary-title">Recent Activity</h4>
                <div class="activity-item" v-for="activity in recentActivity" :key="activity.id">
                  <div class="activity-text">{{ activity.text }}</div>
                  <div class="activity-time">{{ activity.time }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Saved页面 - 收藏统计 -->
          <div v-else-if="route.name === 'profile'" class="recommendation-section">
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
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()

// 控制右侧栏显示，只在Explore和Saved页面显示
const showRightSidebar = computed(() => {
  return ['discover', 'profile'].includes(route.name)
})

// Explore页面 - Top Creators
const topCreators = ref([
  {
    id: 1,
    name: 'babycat',
    handle: 'babycat',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg'
  },
  {
    id: 2,
    name: 'tu',
    handle: 'tu',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
  },
  {
    id: 3,
    name: 'ha',
    handle: 'ha',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg'
  },
  {
    id: 4,
    name: 'Frank',
    handle: 'nbfrank',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
  },
  {
    id: 5,
    name: '11',
    handle: '11',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327749/aigp_1758963751.jpeg'
  },
  {
    id: 6,
    name: 'Ck',
    handle: 'ck',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327748/aigp_1758963749.jpeg'
  },
  {
    id: 7,
    name: 'pony',
    handle: 'pony',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327747/aigp_1758963748.jpeg'
  },
  {
    id: 8,
    name: 'edwardxcj',
    handle: 'edwardxcj',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg'
  }
])

// 推荐用户 (现在显示在Explore页面)
const suggestedUsers = ref([
  {
    id: 1,
    name: 'Sarah',
    handle: 'sarah_travel',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
  },
  {
    id: 2,
    name: 'Mike',
    handle: 'mike_photo',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg'
  },
  {
    id: 3,
    name: 'Emma',
    handle: 'emma_art',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
  }
])

// 最近活动 (现在显示在Explore页面)
const recentActivity = ref([
  {
    id: 1,
    text: 'Frank liked your post',
    time: '2 min ago'
  },
  {
    id: 2,
    text: 'New follower: Sarah',
    time: '1 hour ago'
  },
  {
    id: 3,
    text: 'Your post got 15 likes',
    time: '3 hours ago'
  }
])


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
  background-color: #000000;
}

.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 260px;
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
  color: #ffffff;
  margin-bottom: 20px;
}

.creators-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.creator-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.creator-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.creator-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.creator-info {
  flex: 1;
}

.creator-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
}

.creator-handle {
  color: #888888;
  font-size: 12px;
}

.follow-btn {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}

.follow-btn:hover {
  background-color: #7c3aed;
}

.activity-summary {
  margin-top: 20px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
}

.activity-item {
  margin-bottom: 12px;
}

.activity-text {
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 4px;
}

.activity-time {
  color: #888888;
  font-size: 12px;
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
