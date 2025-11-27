<template>
  <div class="explore-page">
    <h1 class="page-title">Explore</h1>
    
    <!-- toast 提示 -->
    <div v-if="showToast" class="toast">{{ toastText }}</div>
    
    <!-- 收藏夹选择弹窗 -->
    <div v-if="showFolderModal" class="modal-overlay" @click="closeFolderModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">选择收藏夹</h3>
        <div class="folder-list">
          <div 
            v-for="folder in favoriteFolders" 
            :key="folder.folderId" 
            class="folder-item"
            @click="saveToFolder(folder.folderId)"
          >
            <span class="iconify" data-icon="mdi:folder-outline"></span>
            <span>{{ folder.name }}</span>
          </div>
          <div class="folder-item create-folder" @click="showCreateFolder = true">
            <span class="iconify" data-icon="mdi:folder-plus-outline"></span>
            <span>创建新收藏夹</span>
          </div>
        </div>
        <button class="modal-close-btn" @click="closeFolderModal">取消</button>
      </div>
    </div>
    
    <!-- 创建收藏夹弹窗 -->
    <div v-if="showCreateFolder" class="modal-overlay" @click="showCreateFolder = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">创建收藏夹</h3>
        <input 
          v-model="newFolderName" 
          type="text" 
          placeholder="输入收藏夹名称" 
          class="folder-input"
          @keyup.enter="createNewFolder"
        >
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showCreateFolder = false">取消</button>
          <button class="modal-btn confirm" @click="createNewFolder">创建</button>
        </div>
      </div>
    </div>
    
    <!-- 分类和搜索区域 -->
    <div class="category-search-container fixed-header">
      <div class="categories">
        <button 
          @click="activeCategory = 'recommended'"
          :class="['category-btn', { active: activeCategory === 'recommended' }]"
        >
          推荐
        </button>
        <button 
          @click="handleFollowingClick"
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
    <div class="posts-grid">
      <router-link v-for="post in filteredPosts" :key="post.id" :to="{ name: 'post', params: { id: post.id } }" class="post-card post-link">
        <!-- 用户信息 -->
        <div class="post-header" @click="openPost(post.id)">
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
        <div class="post-content" @click="openPost(post.id)">
          <p class="post-caption">{{ post.caption }}</p>
          <div class="hashtags">{{ post.hashtags }}</div>
        </div>
        
        <!-- 图片 -->
        <div class="post-image" v-if="post.image" @click="openPost(post.id)">
          <img 
            :src="post.image" 
            :alt="post.caption" 
            class="w-full rounded-lg"
          >
        </div>
        
        <!-- 互动按钮 -->
        <div class="post-actions">
          <button :class="['action-btn', { liked: post.liked }]" @click.prevent.stop="toggleLike(post)">
            <span class="iconify" :data-icon="post.liked ? 'mdi:heart' : 'mdi:heart-outline'" data-inline="false"></span>
            <span>{{ post.likes }}</span>
          </button>
          <button :class="['action-btn', { favorited: post.favorited }]" @click.prevent.stop="openFolderModal(post)">
            <span class="iconify" :data-icon="post.favorited ? 'mdi:bookmark' : 'mdi:bookmark-outline'" data-inline="false"></span>
            <span>{{ post.favorites || 0 }}</span>
          </button>
          <button class="action-btn" @click.prevent.stop="openPost(post.id)">
            <span class="iconify" data-icon="mdi:comment-outline" data-inline="false"></span>
            <span>{{ post.comments || 0 }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getPosts, likePost, unlikePost } from '@/api/posts'
import { getFavoriteFolders, createFavoriteFolder, addPostToFavorites } from '@/api/favorites'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUserId = computed(() => authStore.user?.userId)

// 当前激活的分类
const activeCategory = ref('recommended')
// 搜索查询
const searchQuery = ref('')

// 全部帖子（从后端拉取）
const allPosts = ref([])

// 推荐与关注视图基于 allPosts 派生
const recommendedPosts = ref([])
const followingPosts = ref([])

function mapBackendToView(raw) {
  const author = raw.user || raw.author || raw.creator || {}
  const images = Array.isArray(raw.images) ? raw.images : (raw.images ? [raw.images] : [])
  const firstImage = images.length ? (typeof images[0] === 'string' ? images[0] : (images[0].url || images[0].path || images[0].data || null)) : null
  const postId = raw.postId ?? raw.id ?? raw._id
  
  return {
    id: postId,
    author: {
      avatar: raw.avatarUrl || author.avatar || author.photo || author.image || author.avatarUrl || 'https://via.placeholder.com/80',
      name: raw.nickname || author.nickname || raw.username || author.name || author.username || '匿名',
      handle: raw.username || author.handle || author.username || (raw.nickname ? raw.nickname.replace(/\s+/g, '') : (author.nickname ? author.nickname.replace(/\s+/g, '') : ''))
    },
    time: raw.createdAt ? new Date(raw.createdAt).toLocaleString() : (raw.time || ''),
    location: raw.location || '',
    caption: raw.topic || raw.title || raw.content || raw.caption || '',
    hashtags: Array.isArray(raw.tags) ? raw.tags.join(' ') : (raw.tags || ''),
    image: firstImage,
    // 使用后端返回的真实统计数据
    likes: raw.likeCount ?? raw.likes ?? 0,
    liked: isAuthenticated.value ? getLocalLikeStatus(postId) : false,
    favorites: raw.favoriteCount ?? raw.favorites ?? raw.bookmarks ?? 0,
    comments: raw.commentCount ?? raw.commentsCount ?? raw.comment_count ?? (Array.isArray(raw.comments) ? raw.comments.length : (raw.commentNum ?? 0)),
    favorited: isAuthenticated.value ? getLocalFavoriteStatus(postId) : false
  }
}

async function loadExplore() {
  loading.value = true
  error.value = ''
  try {
    const res = await getPosts()
    const arr = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : [])
    allPosts.value = arr.map(mapBackendToView)
    recommendedPosts.value = allPosts.value
    followingPosts.value = allPosts.value.filter(p => p.author && p.author.isFollowed)
  } catch (e) {
    console.error('加载探索帖子失败', e)
    // 如果是401错误且未登录，这是正常的，不显示错误
    // 其他错误可能是网络问题或服务器错误
    if (e.message && !e.message.includes('401') && !e.message.includes('未授权')) {
      console.warn('获取帖子列表失败，可能是网络问题或服务器错误')
    }
    allPosts.value = []
    recommendedPosts.value = []
    followingPosts.value = []
  } finally {
    loading.value = false
  }
}

// 加载收藏夹列表
async function loadFavoriteFolders() {
  if (!isAuthenticated.value || !currentUserId.value) return
  
  try {
    const res = await getFavoriteFolders(currentUserId.value)
    const arr = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : [])
    favoriteFolders.value = arr
  } catch (e) {
    console.error('加载收藏夹失败', e)
    favoriteFolders.value = []
  }
}

const router = useRouter()
function openPost(id) {
  router.push({ name: 'post', params: { id } })
}

// 处理关注按钮点击
function handleFollowingClick() {
  if (!isAuthenticated.value) {
    router.push('/login')
  } else {
    activeCategory.value = 'following'
  }
}

// 监听登录状态变化
watch(isAuthenticated, (newVal) => {
  if (!newVal) {
    activeCategory.value = 'recommended'
  }
})

// 根据当前分类和搜索词过滤帖子
const filteredPosts = computed(() => {
  const category = (!isAuthenticated.value || activeCategory.value === 'recommended') ? 'recommended' : 'following'
  let posts = category === 'recommended' ? recommendedPosts.value : followingPosts.value
  
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
  if (isAuthenticated.value) {
    loadFavoriteFolders()
  }
})

// toast
const showToast = ref(false)
const toastText = ref('')

function showToastMessage(message) {
  toastText.value = message
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 1500)
}

// 点赞功能
async function toggleLike(post) {
  if (!isAuthenticated.value) {
    showToastMessage('请先登录')
    setTimeout(() => router.push('/login'), 800)
    return
  }

  if (post.likes === undefined) post.likes = 0
  if (post.liked === undefined) post.liked = false

  const wasLiked = post.liked
  const wasLikeCount = post.likes

  try {
    if (post.liked) {
      // 乐观更新：先更新UI
      post.liked = false
      post.likes = Math.max(0, post.likes - 1)
      
      // 取消点赞
      await unlikePost(post.id, currentUserId.value)
      setLocalLikeStatus(post.id, false)
      showToastMessage('已取消点赞')
    } else {
      // 乐观更新：先更新UI
      post.liked = true
      post.likes = (post.likes || 0) + 1
      
      // 点赞
      await likePost(post.id, currentUserId.value)
      setLocalLikeStatus(post.id, true)
      showToastMessage('点赞成功')
    }
    
    // 成功后重新加载该帖子的数据以同步真实点赞数
    await refreshPostData(post.id)
  } catch (error) {
    console.error('点赞操作失败', error)
    // 回滚状态
    post.liked = wasLiked
    post.likes = wasLikeCount
    showToastMessage('操作失败，请重试')
  }
}

// 刷新单个帖子的数据
async function refreshPostData(postId) {
  try {
    const res = await getPosts()
    const arr = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : [])
    const updatedPost = arr.find(p => (p.postId ?? p.id ?? p._id) === postId)
    
    if (updatedPost) {
      // 更新 allPosts 中的数据
      const index = allPosts.value.findIndex(p => p.id === postId)
      if (index !== -1) {
        const newPostData = mapBackendToView(updatedPost)
        allPosts.value[index] = newPostData
        
        // 同步更新 recommendedPosts 和 followingPosts
        const recIndex = recommendedPosts.value.findIndex(p => p.id === postId)
        if (recIndex !== -1) {
          recommendedPosts.value[recIndex] = newPostData
        }
        
        const folIndex = followingPosts.value.findIndex(p => p.id === postId)
        if (folIndex !== -1) {
          followingPosts.value[folIndex] = newPostData
        }
      }
    }
  } catch (error) {
    console.error('刷新帖子数据失败', error)
  }
}

// 打开收藏夹选择弹窗
async function openFolderModal(post) {
  if (!isAuthenticated.value) {
    showToastMessage('请先登录')
    setTimeout(() => router.push('/login'), 800)
    return
  }

  currentFavoritePost.value = post
  await loadFavoriteFolders()
  showFolderModal.value = true
}

// 关闭收藏夹弹窗
function closeFolderModal() {
  showFolderModal.value = false
  currentFavoritePost.value = null
}

// 保存到收藏夹
async function saveToFolder(folderId) {
  if (!currentFavoritePost.value) return
  
  const postId = currentFavoritePost.value.id

  try {
    await addPostToFavorites(currentUserId.value, postId, folderId)
    currentFavoritePost.value.favorites = (currentFavoritePost.value.favorites || 0) + 1
    currentFavoritePost.value.favorited = true
    setLocalFavoriteStatus(postId, true)
    showToastMessage('收藏成功')
    closeFolderModal()
    
    // 重新加载该帖子的数据以同步真实收藏数
    await refreshPostData(postId)
  } catch (error) {
    console.error('收藏失败', error)
    showToastMessage('收藏失败，请重试')
  }
}

// 创建新收藏夹
async function createNewFolder() {
  if (!newFolderName.value.trim()) {
    showToastMessage('请输入收藏夹名称')
    return
  }

  try {
    const res = await createFavoriteFolder(currentUserId.value, newFolderName.value.trim())
    const folder = res?.data || res
    if (folder && folder.folderId) {
      favoriteFolders.value.push(folder)
      showToastMessage('创建成功')
      newFolderName.value = ''
      showCreateFolder.value = false
      
      // 自动收藏到新创建的收藏夹
      if (currentFavoritePost.value) {
        await saveToFolder(folder.folderId)
      }
    }
  } catch (error) {
    console.error('创建收藏夹失败', error)
    showToastMessage('创建失败，请重试')
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
  color: #333333;
  margin-top: 50px;
  margin-bottom: 1px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.folder-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.folder-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.folder-item:hover {
  background: #f5f5f5;
}

.folder-item.create-folder {
  color: #8b5cf6;
  font-weight: 500;
}

.folder-item .iconify {
  font-size: 20px;
}

.folder-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}

.folder-input:focus {
  outline: none;
  border-color: #8b5cf6;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn.cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-btn.cancel:hover {
  background: #e0e0e0;
}

.modal-btn.confirm {
  background: #8b5cf6;
  color: white;
}

.modal-btn.confirm:hover {
  background: #7c3aed;
}

.modal-close-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #f5f5f5;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: #e0e0e0;
}

/* 分类和搜索区域 */
.category-search-container {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  width: calc(100% - 280px);
  z-index: 100;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.categories {
  display: flex;
  gap: 10px;
}

.category-btn {
  padding: 10px 20px;
  border-radius: 20px;
  background: #f0f0f0;
  border: none;
  color: #333333;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #e0e0e0;
}

.category-btn.active {
  background: #8b5cf6;
  color: #ffffff;
}

.search-container {
  position: relative;
}

.search-input {
  width: 200px;
  padding: 10px 40px 10px 15px;
  border-radius: 20px;
  background: #f0f0f0;
  border: 1px solid #e0e0e0;
  color: #333333;
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
  color: #666666;
  cursor: pointer;
}

/* 帖子网格布局 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  transition: background-color 0.2s;
  border: 1px solid #e0e0e0;
}

.post-card:hover {
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.post-header,
.post-content,
.post-image {
  cursor: pointer;
}

.post-header:hover,
.post-content:hover,
.post-image:hover {
  opacity: 0.95;
}

.post-header {
  display: flex;
  justify-content: space-between;
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
  color: #333333;
  font-size: 16px;
}

.user-handle {
  color: #666666;
  font-size: 14px;
}

.post-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.timestamp, .location {
  color: #999999;
  font-size: 12px;
  margin-bottom: 2px;
}

.post-content {
  margin-bottom: 16px;
}

.post-caption {
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.hashtags {
  color: #8b5cf6;
  font-size: 12px;
}

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
  color: #666666;
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

.action-btn.liked {
  color: #ef4444;
}

.action-btn.favorited {
  color: #10b981;
}

.toast { position: fixed; top: 90px; right: 40px; background: rgba(17,24,39,0.95); color: #fff; padding: 10px 14px; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,23,42,0.25); z-index: 200 }

/* active states */
.action-btn.liked { color: #ef4444 } /* 红心 */
.action-btn.favorited { color: #10b981 } /* 绿色收藏 */
.post-actions .iconify { transition: color 0.15s }
</style>
