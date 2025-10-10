<template>
  <div class="explore-page">
    <h1 class="page-title">Explore</h1>
    
    <!-- 动态流 -->
    <div class="posts-container">
      <div 
        v-for="post in posts" 
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
import { ref } from 'vue'

const posts = ref([
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
</script>

<style scoped>
.explore-page {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 30px;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  transition: background-color 0.2s;
}

.post-card:hover {
  background-color: #222222;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

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
  color: #ffffff;
  font-size: 16px;
}

.user-handle {
  color: #888888;
  font-size: 14px;
}

.post-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.timestamp {
  color: #888888;
  font-size: 14px;
}

.location {
  color: #888888;
  font-size: 14px;
}

.post-content {
  margin-bottom: 16px;
}

.post-caption {
  color: #ffffff;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.hashtags {
  color: #888888;
  font-size: 14px;
}

.post-image {
  margin-bottom: 16px;
}

.post-image img {
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
  color: #888888;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.action-btn:hover {
  color: #ffffff;
}

.action-btn .iconify {
  font-size: 18px;
}
</style>
