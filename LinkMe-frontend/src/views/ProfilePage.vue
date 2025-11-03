<template>
  <div class="saved-page">
    <h1 class="page-title">Saved</h1>
    
    <!-- 保存的内容分类 -->
    <div class="categories-section">
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-tab', { active: selectedCategory === category.id }]"
          @click="selectedCategory = category.id"
        >
          <span class="iconify" :data-icon="category.icon" data-inline="false"></span>
          <span>{{ category.name }}</span>
        </button>
      </div>
    </div>
    
    <!-- 保存的内容网格 -->
    <div class="saved-content-grid">
      <div 
        v-for="item in filteredSavedItems" 
        :key="item.id"
        class="saved-item"
      >
        <div class="saved-item-header">
          <div class="author-info">
            <img 
              :src="item.author.avatar" 
              :alt="item.author.name" 
              class="author-avatar"
            >
            <div class="author-details">
              <div class="author-name">{{ item.author.name }}</div>
              <div class="author-handle">@{{ item.author.handle }}</div>
            </div>
          </div>
          <div class="save-time">{{ item.savedTime }}</div>
        </div>
        
        <div class="saved-item-content">
          <p class="item-caption">{{ item.caption }}</p>
          <div class="item-hashtags">{{ item.hashtags }}</div>
        </div>
        
        <div class="saved-item-image" v-if="item.image">
          <img 
            :src="item.image" 
            :alt="item.caption" 
            class="w-full rounded-lg"
          >
        </div>
        
        <div class="saved-item-actions">
          <button class="action-btn">
            <span class="iconify" data-icon="mdi:heart-outline" data-inline="false"></span>
            <span>{{ item.likes }}</span>
          </button>
          <button class="action-btn">
            <span class="iconify" data-icon="mdi:comment-outline" data-inline="false"></span>
            <span>{{ item.comments }}</span>
          </button>
          <button class="action-btn">
            <span class="iconify" data-icon="mdi:share-outline" data-inline="false"></span>
          </button>
          <button class="action-btn remove-btn">
            <span class="iconify" data-icon="mdi:bookmark-remove" data-inline="false"></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="filteredSavedItems.length === 0" class="empty-state">
      <span class="iconify empty-icon" data-icon="mdi:bookmark-outline" data-inline="false"></span>
      <h3 class="empty-title">No saved items</h3>
      <p class="empty-description">Save posts you love to view them later</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('all')

const categories = ref([
  { id: 'all', name: 'All', icon: 'mdi:grid' },
  { id: 'photos', name: 'Photos', icon: 'mdi:image' },
  { id: 'videos', name: 'Videos', icon: 'mdi:video' },
  { id: 'travel', name: 'Travel', icon: 'mdi:airplane' },
  { id: 'food', name: 'Food', icon: 'mdi:food' }
])

const savedItems = ref([
  {
    id: 1,
    category: 'photos',
    author: {
      name: 'Frank',
      handle: 'nbfrank',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
    },
    caption: 'Beautiful sunset in Stockholm',
    hashtags: '#Stockholm #Sweden #Sunset',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg',
    likes: 234,
    comments: 45,
    savedTime: '2 days ago'
  },
  {
    id: 2,
    category: 'travel',
    author: {
      name: 'tu',
      handle: 'tu',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
    },
    caption: 'Amazing architecture in Tokyo',
    hashtags: '#Tokyo #Japan #Architecture',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg',
    likes: 156,
    comments: 23,
    savedTime: '1 week ago'
  },
  {
    id: 3,
    category: 'food',
    author: {
      name: 'ha',
      handle: 'ha',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg'
    },
    caption: 'Delicious ramen in Kyoto',
    hashtags: '#Ramen #Kyoto #Food',
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg',
    likes: 89,
    comments: 12,
    savedTime: '3 days ago'
  }
])

const filteredSavedItems = computed(() => {
  if (selectedCategory.value === 'all') {
    return savedItems.value
  }
  return savedItems.value.filter(item => item.category === selectedCategory.value)
})
</script>

<style scoped>
.saved-page {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 30px;
}

.categories-section {
  margin-bottom: 30px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 20px;
  color: #888888;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.category-tab:hover {
  background-color: #222222;
  color: #ffffff;
}

.category-tab.active {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
  color: #ffffff;
}

.category-tab .iconify {
  font-size: 16px;
}

.saved-content-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.saved-item {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  transition: background-color 0.2s;
}

.saved-item:hover {
  background-color: #222222;
}

.saved-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
}

.author-handle {
  color: #888888;
  font-size: 14px;
}

.save-time {
  color: #888888;
  font-size: 14px;
}

.saved-item-content {
  margin-bottom: 16px;
}

.item-caption {
  color: #ffffff;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.item-hashtags {
  color: #888888;
  font-size: 14px;
}

.saved-item-image {
  margin-bottom: 16px;
}

.saved-item-image img {
  border-radius: 8px;
  max-height: 400px;
  object-fit: cover;
}

.saved-item-actions {
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

.remove-btn:hover {
  color: #ef4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: #888888;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}

.empty-description {
  color: #888888;
  font-size: 16px;
}
</style>
