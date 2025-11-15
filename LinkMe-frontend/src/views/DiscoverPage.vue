<template>
  <div class="explore-page">
    <h1 class="page-title">Explore</h1>
    <!-- toast 提示 -->
    <div v-if="showToast" class="toast">{{ toastText }}</div>
    
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
    
    <!-- 加载状态和错误提示 -->
    <div v-if="loading" class="loading-message">加载中...</div>
    <div v-if="error && !loading" class="error-message">{{ error }}</div>
    
    <!-- 动态流 - 保持两列布局，确保有足够的顶部内边距避免被固定栏遮挡 -->
    <div v-if="!loading && !error" class="posts-grid">
      <div v-if="filteredPosts.length === 0" class="empty-message">暂无帖子</div>
      <router-link v-for="post in filteredPosts" :key="post.id" :to="{ name: 'post', params: { id: post.id } }" class="post-card post-link">
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
              <div class="hashtags">
                {{ post.hashtags }}
                <!-- 在标签后显示收藏数（bookmark） -->
                <span class="fav-inline" @click.stop="toggleFavorite(post)">
                  <span class="iconify" data-icon="mdi:bookmark-outline" data-inline="false"></span>
                  <span class="fav-count">{{ post.favorites || 0 }}</span>
                </span>
              </div>
        </div>
        
        <!-- 图片 -->
        <div class="post-image" v-if="post.image">
          <img 
            :src="post.image" 
            :alt="post.caption" 
            class="w-full rounded-lg"
          >
        </div>
        
        <!-- 互动按钮（阻止导航） -->
        <div class="post-actions">
          <button :class="['action-btn', { liked: post.liked }]" @click.stop="toggleLike(post)">
            <span class="iconify" :data-icon="post.liked ? 'mdi:heart' : 'mdi:heart-outline'" data-inline="false"></span>
            <span>{{ post.likes }}</span>
          </button>
          <button :class="['action-btn', { favorited: post.favorited }]" @click.stop="toggleFavorite(post)">
            <span class="iconify" :data-icon="post.favorited ? 'mdi:bookmark' : 'mdi:bookmark-outline'" data-inline="false"></span>
            <span>{{ post.favorites || 0 }}</span>
          </button>
          <button class="action-btn" @click.stop="openPost(post.id)">
            <span class="iconify" data-icon="mdi:comment-outline" data-inline="false"></span>
            <span>{{ post.comments || 0 }}</span>
          </button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 当前激活的分类
const activeCategory = ref('recommended')
// 搜索查询
const searchQuery = ref('')

import { getPosts } from '@/api/posts'

// 全部帖子（从后端拉取）
const allPosts = ref([])

// 推荐与关注视图基于 allPosts 派生
const recommendedPosts = ref([])
const followingPosts = ref([])

// 加载状态和错误信息
const loading = ref(false)
const error = ref('')

function mapBackendToView(raw) {
  // raw: backend post object
  const author = raw.user || raw.author || raw.creator || {}
  const images = Array.isArray(raw.images) ? raw.images : (raw.images ? [raw.images] : [])
  const firstImage = images.length ? (typeof images[0] === 'string' ? images[0] : (images[0].url || images[0].path || images[0].data || null)) : null
  return {
    id: raw.id ?? raw._id ?? raw.postId,
    author: {
      avatar: author.avatar || author.photo || author.image || 'https://via.placeholder.com/80',
      name: author.nickname || author.name || author.username || '匿名',
      handle: author.handle || author.username || (author.nickname ? author.nickname.replace(/\s+/g, '') : '')
    },
    time: raw.createdAt ? new Date(raw.createdAt).toLocaleString() : (raw.time || ''),
    location: raw.location || '',
    caption: raw.title || raw.content || raw.caption || '',
    hashtags: Array.isArray(raw.tags) ? raw.tags.join(' ') : (raw.tags || ''),
    image: firstImage,
    likes: raw.likes ?? raw.likeCount ?? 0,
    liked: false,
    favorites: raw.favorites ?? raw.bookmarks ?? 0,
    comments: raw.commentsCount ?? raw.comment_count ?? (Array.isArray(raw.comments) ? raw.comments.length : (raw.commentNum ?? 0)),
    favorited: false
  }
}

async function loadExplore() {
  loading.value = true
  error.value = ''
  try {
    const res = await getPosts()
    const arr = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : [])
    allPosts.value = arr.map(mapBackendToView)
    // simple split: recommended = all, following = those with author.isFollowed true (if backend provides)
    recommendedPosts.value = allPosts.value
    followingPosts.value = allPosts.value.filter(p => p.author && p.author.isFollowed)
  } catch (e) {
    console.error('加载探索帖子失败', e)
    error.value = e.message || '加载帖子失败，请检查网络连接或联系管理员'
    allPosts.value = []
    recommendedPosts.value = []
    followingPosts.value = []
  } finally {
    loading.value = false
  }
}

const router = useRouter()
function openPost(id) {
  router.push({ name: 'post', params: { id } })
}

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

onMounted(() => {
  loadExplore()
})

// toast for 收藏成功
const showToast = ref(false)
const toastText = ref('')
function toggleFavorite(post) {
  // ensure fields exist
  if (post.favorites === undefined) post.favorites = 0
  if (post.favorited === undefined) post.favorited = false

  if (post.favorited) {
    // 取消收藏
    post.favorites = Math.max(0, post.favorites - 1)
    post.favorited = false
    toastText.value = '已取消收藏'
  } else {
    // 收藏
    post.favorites = (post.favorites || 0) + 1
    post.favorited = true
    toastText.value = '收藏成功'
  }

  showToast.value = true
  setTimeout(() => { showToast.value = false }, 1200)
}

function toggleLike(post) {
  if (post.likes === undefined) post.likes = 0
  if (post.liked === undefined) post.liked = false

  if (post.liked) {
    post.likes = Math.max(0, post.likes - 1)
    post.liked = false
  } else {
    post.likes = post.likes + 1
    post.liked = true
  }
}
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

.fav-inline { display:inline-flex; align-items:center; gap:6px; margin-left:10px; color:#6b7280; cursor:pointer }
.fav-inline .fav-count { font-size:13px; color:#374151; margin-left:4px }

.toast { position: fixed; top: 90px; right: 40px; background: rgba(17,24,39,0.95); color: #fff; padding: 10px 14px; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,23,42,0.25); z-index: 200 }

/* active states */
.action-btn.liked { color: #ef4444 } /* 红心 */
.action-btn.favorited { color: #10b981 } /* 绿色收藏 */
.post-actions .iconify { transition: color 0.15s }

/* 加载和错误消息样式 */
.loading-message, .error-message, .empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.error-message {
  color: #ef4444;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  margin: 20px;
  padding: 20px;
}
</style>
