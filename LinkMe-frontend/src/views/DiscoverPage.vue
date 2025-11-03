<template>
  <div class="explore-page">
    <h1 class="page-title">Explore</h1>
    
    <!-- 分类和搜索区域 - 修改为固定在顶部，背景为白色，不覆盖侧边栏 -->
    <div class="category-search-container fixed-header">
      <div class="categories">
        <button 
          @click="activeCategory = 'recommended'"
          :class="['category-btn', { active: activeCategory === 'recommended' }]"
        >
          推荐
        </button>
        <button 
          @click="activeCategory = 'following'"
          :class="['category-btn', { active: activeCategory === 'following' }]"
        >
          关注
        </button>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          placeholder="搜索..." 
          class="search-input"
          v-model="searchQuery"
        >
        <button class="search-btn">
          <span class="iconify" data-icon="mdi:magnify" data-inline="false"></span>
        </button>
      </div>
    </div>
    
    <!-- 动态流 - 保持两列布局，确保有足够的顶部内边距避免被固定栏遮挡 -->
    <div class="posts-grid">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id"
        class="post-card"
      >
        <!-- 用户信息 -->
        <div class="post-header">
          <div class="user-info">
            <img 
              :src="post.author.avatar" 
              :alt="post.author.name" 
              class="user-avatar"
            >
            <div class="user-details">
              <div class="username">{{ post.author.name }}</div>
              <div class="user-handle">@{{ post.author.handle }}</div>
            </div>
          </div>
          <div class="post-meta">
            <span class="timestamp">{{ post.time }}</span>
            <span class="location">{{ post.location }}</span>
          </div>
        </div>
        
        <!-- 帖子内容 -->
        <div class="post-content">
          <p class="post-caption">{{ post.caption }}</p>
          <div class="hashtags">{{ post.hashtags }}</div>
        </div>
        
        <!-- 图片 -->
        <div class="post-image" v-if="post.image">
          <img 
            :src="post.image" 
            :alt="post.caption" 
            class="w-full rounded-lg"
          >
        </div>
        
        <!-- 互动按钮 -->
        <div class="post-actions">
          <button class="action-btn">
            <span class="iconify" data-icon="mdi:heart-outline" data-inline="false"></span>
            <span>{{ post.likes }}</span>
          </button>
          <button class="action-btn">
            <span class="iconify" data-icon="mdi:bookmark-outline" data-inline="false"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 当前激活的分类
const activeCategory = ref('recommended')
// 搜索查询
const searchQuery = ref('')

// 推荐的帖子数据
const recommendedPosts = ref([
  {
    id: 1,
    author: {
      name: 'babycat',
      handle: 'babycat',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg'
    },
    time: '15 minutes ago',
    location: 'Australia',
    caption: 'Beautiful cat in the world',
    hashtags: '#Cat #Pet #Animal',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg',
    likes: 1
  },
  {
    id: 2,
    author: {
      name: 'Frank',
      handle: 'nbfrank',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
    },
    time: '4 hours ago',
    location: 'Stockholm',
    caption: 'Stockholm, Sweden',
    hashtags: '#Travel #Sweden #Stockholm',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg',
    likes: 24
  },
  {
    id: 3,
    author: {
      name: 'tu',
      handle: 'tu',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
    },
    time: '2 hours ago',
    location: 'Tokyo',
    caption: 'Amazing sunset in Tokyo',
    hashtags: '#Sunset #Tokyo #Japan',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg',
    likes: 156
  }
])

// 关注的帖子数据
const followingPosts = ref([
  {
    id: 4,
    author: {
      name: 'ha',
      handle: 'ha',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg'
    },
    time: '1 hour ago',
    location: 'Paris',
    caption: 'Morning coffee in Paris',
    hashtags: '#Coffee #Paris #Morning',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327749/aigp_1758963751.jpeg',
    likes: 89
  },
  {
    id: 5,
    author: {
      name: 'Ck',
      handle: 'ck',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327748/aigp_1758963749.jpeg'
    },
    time: '30 minutes ago',
    location: 'New York',
    caption: 'Weekend vibes in the city',
    hashtags: '#Weekend #NYC #City',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327748/aigp_1758963749.jpeg',
    likes: 123
  },
  {
    id: 6,
    author: {
      name: 'pony',
      handle: 'pony',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327747/aigp_1758963748.jpeg'
    },
    time: '5 hours ago',
    location: 'London',
    caption: 'Nature walk in the park',
    hashtags: '#Nature #Walk #London',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327747/aigp_1758963748.jpeg',
    likes: 78
  }
])

// 根据当前分类和搜索词过滤帖子
const filteredPosts = computed(() => {
  let posts = activeCategory.value === 'recommended' ? recommendedPosts.value : followingPosts.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post => 
      post.caption.toLowerCase().includes(query) || 
      post.hashtags.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query)
    )
  }
  
  return posts
})
</script>

<style scoped>
.explore-page {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #333333; /* 修改文字颜色，以便在白色背景上显示 */
  margin-top: 50px;
  margin-bottom: 1px;
}

/* 分类和搜索区域样式 - 修改为固定定位并设置白色背景 */
.category-search-container {
  position: fixed; /* 使用fixed固定定位替代sticky */
  top: 0; /* 固定在顶部 */
  left: 280px; /* 与侧边栏宽度一致，避免覆盖侧边栏 */
  right: 0;
  width: calc(100% - 280px); /* 计算宽度，确保不会覆盖侧边栏 */
  z-index: 100; /* 确保它在其他内容之上 */
  background-color: #ffffff; /* 白色背景 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px; /* 增加内边距 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影以区分层次 */
}

.categories {
  display: flex;
  gap: 10px;
}

.category-btn {
  padding: 10px 20px;
  border-radius: 20px;
  background: #f0f0f0; /* 浅灰色背景 */
  border: none;
  color: #333333; /* 深色文字 */
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #e0e0e0;
}

.category-btn.active {
  background: #8b5cf6;
  color: #ffffff; /* 激活状态文字为白色 */
}

.search-container {
  position: relative;
}

.search-input {
  width: 200px;
  padding: 10px 40px 10px 15px;
  border-radius: 20px;
  background: #f0f0f0; /* 浅灰色背景 */
  border: 1px solid #e0e0e0;
  color: #333333; /* 深色文字 */
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  background: #ffffff;
  border-color: #8b5cf6;
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666666; /* 调整搜索图标颜色 */
  cursor: pointer;
}

/* 帖子网格布局 - 两列排列，添加顶部内边距避免被固定栏遮挡 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px; /* 增加顶部间距，确保不被固定栏遮挡 */
}

.post-card {
  background-color: #ffffff; /* 白色背景 */
  border-radius: 12px;
  padding: 20px;
  transition: background-color 0.2s;
  border: 1px solid #e0e0e0; /* 添加边框 */
}

.post-card:hover {
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); /* 添加轻微阴影 */
}

/* 用户信息和帖子内容样式调整 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #333333; /* 深色文字 */
  font-size: 16px;
}

.user-handle {
  color: #666666; /* 灰色文字 */
  font-size: 14px;
}

.post-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.timestamp, .location {
  color: #999999; /* 浅灰色文字 */
  font-size: 12px;
  margin-bottom: 2px;
}

.post-content {
  margin-bottom: 16px;
}

.post-caption {
  color: #333333; /* 深色文字 */
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.hashtags {
  color: #8b5cf6;
  font-size: 12px;
}

/* 其他样式保持不变 */
.post-image {
  margin-bottom: 16px;
}

.post-image img {
  width: 100%;
  border-radius: 8px;
  max-height: 400px;
  object-fit: cover;
}

.post-actions {
  display: flex;
  gap: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #666666; /* 调整按钮颜色 */
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #333333;
}

.action-btn .iconify {
  font-size: 18px;
}
</style>
