<template>
  <div class="home-page">
    <h1 class="page-title">Home</h1>
    
    <!-- 个人资料卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <img 
          :src="getAvatarUrl()" 
          alt="Profile" 
          class="profile-avatar"
          @error="handleAvatarError"
        >
        <div class="profile-info">
          <h2 class="profile-name">{{ userInfo?.nickname || userInfo?.username || 'User' }}</h2>
          <p class="profile-handle">@{{ userInfo?.username || 'username' }}</p>
          <p class="profile-bio">{{ userInfo?.bio || 'Love cats, travel and photography 📸' }}</p>
          <div v-if="userTags.length > 0" class="profile-tags">
            <span 
              v-for="tag in userTags" 
              :key="tag.id || tag"
              class="profile-tag"
            >
              {{ tag.name || tag }}
            </span>
          </div>
        </div>
        <button class="edit-profile-btn" @click="$router.push('/settings')">Edit Profile</button>
      </div>
      
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalPostInteractions }}</span>
          <span class="stat-label">获赞与收藏</span>
        </div>
        <div class="stat-item" @click="openUserListModal('following')" style="cursor: pointer;">
          <span class="stat-number">{{ followingCount }}</span>
          <span class="stat-label">关注</span>
        </div>
        <div class="stat-item" @click="openUserListModal('followers')" style="cursor: pointer;">
          <span class="stat-number">{{ followersCount }}</span>
          <span class="stat-label">粉丝</span>
        </div>
      </div>
      
      <!-- 用户列表模态框 -->
      <UserListModal 
        v-if="showUserListModal"
        :title="userListTitle"
        :users="userList"
        :loading="userListLoading"
        :type="userListType"
        @close="closeUserListModal"
        @follow-changed="handleFollowChanged"
      />
    </div>
    
    <!-- 标签切换 -->
    <div class="tabs-section">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]"
          @click="switchTab(tab.key)"
        >
          <span class="iconify" :data-icon="tab.icon" data-inline="false"></span>
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <!-- 收藏夹选择（仅在收藏标签时显示） -->
    <div v-if="activeTab === 'favorites'" class="folder-selector">
      <div class="folder-list">
        <button 
          v-for="folder in favoriteFolders" 
          :key="folder.folderId"
          :class="['folder-btn', { active: selectedFolderId === folder.folderId }]"
          @click="selectFolder(folder.folderId)"
        >
          {{ folder.name }}
        </button>
        <button class="folder-btn add-folder-btn" @click="showCreateFolderDialog = true">
          <span class="iconify" data-icon="mdi:plus" data-inline="false"></span>
          新建收藏夹
        </button>
      </div>
    </div>
    
    <!-- 帖子网格 -->
    <div class="posts-section">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="displayPosts.length === 0" class="empty-state">
        <p>暂无内容</p>
      </div>
      <div v-else class="posts-grid">
        <div 
          v-for="post in displayPosts" 
          :key="post.postId"
          class="post-item"
          @click="goToPostDetail(post.postId)"
        >
          <img 
            v-if="post.images && post.images.length > 0"
            :src="post.images[0]" 
            :alt="post.content" 
            class="post-thumbnail"
          >
          <div v-else class="post-thumbnail no-image">
            <span class="iconify" data-icon="mdi:image-off" data-inline="false"></span>
          </div>
          <div class="post-overlay">
            <div class="post-stats">
              <span class="stat">
                <span class="iconify" data-icon="mdi:heart" data-inline="false"></span>
                {{ post.likeCount || 0 }}
              </span>
              <span class="stat">
                <span class="iconify" data-icon="mdi:comment" data-inline="false"></span>
                {{ post.commentCount || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 创建收藏夹对话框 -->
    <div v-if="showCreateFolderDialog" class="modal-overlay" @click="showCreateFolderDialog = false">
      <div class="modal-content" @click.stop>
        <h3>创建收藏夹</h3>
        <input 
          v-model="newFolderName" 
          type="text" 
          placeholder="收藏夹名称"
          class="folder-input"
          @keyup.enter="createFolder"
        >
        <div class="modal-actions">
          <button class="btn-cancel" @click="showCreateFolderDialog = false">取消</button>
          <button class="btn-confirm" @click="createFolder">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getCurrentUserInfo, getUserStats, getFollowers, getFollowing } from '@/api/user'
import { getUserPosts, getPost } from '@/api/posts'
import { getUserLikedPosts, getUserFavoritePosts, getFavoriteFolders, createFavoriteFolder } from '@/api/favorites'
import { fetchTagDefinitions } from '@/api/tags'
import UserListModal from '@/components/UserListModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// 用户信息
const userInfo = ref(null)
const loading = ref(false)

// 标签映射（ID -> 名称）
const tagMap = ref(new Map())

// 生成文字头像（显示用户名字前两个字）
function generateTextAvatar(name) {
  if (!name) return null
  
  // 获取名字前两个字
  const text = name.length >= 2 ? name.substring(0, 2) : name.substring(0, 1)
  
  // 创建 canvas 生成头像
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 120
  const ctx = canvas.getContext('2d')
  
  // 生成随机背景色（基于名字的哈希值）
  const colors = [
    '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#ec4899', '#06b6d4', '#6366f1'
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const bgColor = colors[hash % colors.length]
  
  // 绘制背景
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制文字
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  
  return canvas.toDataURL()
}

// 获取头像 URL
function getAvatarUrl() {
  const avatar = userInfo.value?.avatar || userInfo.value?.avatarUrl
  if (avatar) {
    return avatar
  }
  
  // 如果没有头像，生成文字头像
  const name = userInfo.value?.nickname || userInfo.value?.username || 'User'
  return generateTextAvatar(name)
}

// 处理头像加载错误
function handleAvatarError(event) {
  // 如果头像加载失败，生成文字头像
  const name = userInfo.value?.nickname || userInfo.value?.username || 'User'
  const textAvatar = generateTextAvatar(name)
  if (textAvatar) {
    event.target.src = textAvatar
  }
}

// 用户标签（从 userInfo 中提取）
const userTags = ref([])

// 加载标签映射（同时加载用户标签和帖子标签）
async function loadTagMap() {
  try {
    // 同时加载用户标签和帖子标签
    const [userTagsResult, postTagsResult] = await Promise.all([
      fetchTagDefinitions({ type: 'user' }),
      fetchTagDefinitions({ type: 'post' })
    ])
    
    const map = new Map()
    
    // 合并两种类型的标签
    const allTags = userTagsResult.concat(postTagsResult)
    allTags.forEach(tag => {
      const tagId = tag.tagId || tag.id || tag.tag_id
      const tagName = tag.name || tag.tagName || tag.tag_name
      if (tagId && tagName) {
        // 确保 tagId 是数字类型，以便正确匹配
        const numericId = typeof tagId === 'string' ? parseInt(tagId) : tagId
        if (!isNaN(numericId)) {
          map.set(numericId, tagName)
          // 同时存储字符串类型的ID，以防万一
          if (typeof tagId === 'string') {
            map.set(tagId, tagName)
          }
        }
      }
    })
    tagMap.value = map
    console.log('标签映射加载完成，共', map.size, '个标签:', Array.from(map.entries()))
  } catch (e) {
    console.error('加载标签映射失败:', e)
  }
}

// 将标签ID数组转换为标签名称字符串，每个标签前面加井号
function formatTags(tagIds) {
  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return ''
  }
  return tagIds.map(tagId => {
    // 尝试多种方式查找标签名称
    let tagName = tagMap.value.get(tagId)
    if (!tagName) {
      const numericId = typeof tagId === 'string' ? parseInt(tagId) : tagId
      tagName = tagMap.value.get(numericId) || `标签${tagId}`
    }
    return `#${tagName}`
  }).join(' ')
}

// 标签切换
const activeTab = ref('posts') // posts, likes, favorites
const tabs = [
  { key: 'posts', label: '我的帖子', icon: 'mdi:grid' },
  { key: 'likes', label: '赞过的', icon: 'mdi:heart' },
  { key: 'favorites', label: '收藏的', icon: 'mdi:bookmark' }
]

// 数据
const myPosts = ref([])
const likedPosts = ref([])
const favoritePosts = ref([])
const favoriteFolders = ref([])
const selectedFolderId = ref(null)
const showCreateFolderDialog = ref(false)
const newFolderName = ref('')

// 统计数据
const postCount = computed(() => myPosts.value.length)
const myLikeCount = computed(() => likedPosts.value.length)
const myFavoriteCount = computed(() => favoritePosts.value.length)
const postLikesCount = computed(() => {
  return myPosts.value.reduce((total, post) => total + (post.likeCount || 0), 0)
})
const postFavoritesCount = computed(() => {
  return myPosts.value.reduce((total, post) => total + (post.favoriteCount || 0), 0)
})
const totalPostInteractions = computed(() => {
  return postLikesCount.value + postFavoritesCount.value
})
const followingCount = ref(0)
const followersCount = ref(0)

// 用户列表模态框
const showUserListModal = ref(false)
const userListTitle = ref('')
const userListType = ref('followers') // 'followers' or 'following'
const userList = ref([])
const userListLoading = ref(false)

// 当前显示的帖子
const displayPosts = computed(() => {
  if (activeTab.value === 'posts') {
    return myPosts.value
  } else if (activeTab.value === 'likes') {
    return likedPosts.value
  } else if (activeTab.value === 'favorites') {
    if (selectedFolderId.value) {
      return favoritePosts.value.filter(p => p.folderId === selectedFolderId.value)
    }
    return favoritePosts.value
  }
  return []
})

// 切换标签
async function switchTab(tab) {
  activeTab.value = tab
  selectedFolderId.value = null
  
  if (tab === 'posts') {
    await loadMyPosts()
  } else if (tab === 'likes') {
    await loadLikedPosts()
  } else if (tab === 'favorites') {
    await loadFavoriteFolders()
    await loadFavoritePosts()
  }
}

// 选择收藏夹
function selectFolder(folderId) {
  selectedFolderId.value = selectedFolderId.value === folderId ? null : folderId
}

// 创建收藏夹
async function createFolder() {
  if (!newFolderName.value.trim()) {
    alert('请输入收藏夹名称')
    return
  }
  
  try {
    const userId = authStore.userId
    if (!userId) {
      alert('请先登录')
      return
    }
    
    await createFavoriteFolder(userId, newFolderName.value.trim())
    newFolderName.value = ''
    showCreateFolderDialog.value = false
    await loadFavoriteFolders()
  } catch (error) {
    console.error('创建收藏夹失败:', error)
    alert('创建收藏夹失败: ' + (error.message || '未知错误'))
  }
}

// 加载我的帖子
async function loadMyPosts() {
  const userId = authStore.userId
  if (!userId) return
  
  loading.value = true
  try {
    const posts = await getUserPosts(userId)
    myPosts.value = Array.isArray(posts) ? posts : (posts?.data || [])
    // 确保每个帖子都有 images 数组，并处理标签
    myPosts.value = myPosts.value.map(post => ({
      ...post,
      images: post.images || (post.imageUrl ? [post.imageUrl] : []),
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      hashtags: formatTags(post.tags || []) // 映射标签ID为名称
    }))
  } catch (error) {
    console.error('加载我的帖子失败:', error)
    myPosts.value = []
  } finally {
    loading.value = false
  }
}

// 加载点赞的帖子
async function loadLikedPosts() {
  const userId = authStore.userId
  if (!userId) return
  
  loading.value = true
  try {
    const likes = await getUserLikedPosts(userId)
    // likes 返回的是 Like 对象数组，需要获取对应的帖子
    const postPromises = likes.map(like => getPost(like.postId))
    const posts = await Promise.all(postPromises)
    likedPosts.value = posts.map(post => ({
      ...post,
      images: post.images || (post.imageUrl ? [post.imageUrl] : []),
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      hashtags: formatTags(post.tags || []) // 映射标签ID为名称
    }))
  } catch (error) {
    console.error('加载点赞帖子失败:', error)
    likedPosts.value = []
  } finally {
    loading.value = false
  }
}

// 加载收藏的帖子
async function loadFavoritePosts() {
  const userId = authStore.userId
  if (!userId) return
  
  loading.value = true
  try {
    const favorites = await getUserFavoritePosts(userId, selectedFolderId.value)
    // favorites 返回的是 Favorite 对象数组，需要获取对应的帖子
    const postPromises = favorites.map(fav => getPost(fav.postId))
    const posts = await Promise.all(postPromises)
    favoritePosts.value = posts.map((post, index) => ({
      ...post,
      folderId: favorites[index].folderId,
      images: post.images || (post.imageUrl ? [post.imageUrl] : []),
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      hashtags: formatTags(post.tags || []) // 映射标签ID为名称
    }))
  } catch (error) {
    console.error('加载收藏帖子失败:', error)
    favoritePosts.value = []
  } finally {
    loading.value = false
  }
}

// 加载收藏夹列表
async function loadFavoriteFolders() {
  const userId = authStore.userId
  if (!userId) return
  
  try {
    const folders = await getFavoriteFolders(userId)
    favoriteFolders.value = Array.isArray(folders) ? folders : (folders?.data || [])
  } catch (error) {
    console.error('加载收藏夹失败:', error)
    favoriteFolders.value = []
  }
}

// 加载用户信息
async function loadUserInfo() {
  try {
    // 使用新的 API 端点获取当前用户信息
    const info = await getCurrentUserInfo()
    userInfo.value = info?.data || info || authStore.user
    
    // 处理标签：提取标签信息并映射为名称
    if (userInfo.value) {
      const tags = userInfo.value.tags || userInfo.value.tagIds || []
      console.log('用户标签原始数据:', tags)
      console.log('当前标签映射:', Array.from(tagMap.value.entries()))
      
      if (Array.isArray(tags) && tags.length > 0) {
        // 如果标签是对象数组（包含 id 和 name）
        if (typeof tags[0] === 'object' && tags[0] !== null) {
          userTags.value = tags.map(tag => {
            const tagId = tag.id || tag.tagId || tag.tag_id
            // 尝试多种方式查找标签名称
            let tagName = tag.name || tag.tagName || tag.tag_name
            if (!tagName) {
              // 尝试数字ID
              const numericId = typeof tagId === 'string' ? parseInt(tagId) : tagId
              tagName = tagMap.value.get(numericId) || tagMap.value.get(tagId) || `标签${tagId}`
            }
            console.log('映射标签:', tagId, '->', tagName)
            return {
              id: tagId,
              name: tagName
            }
          })
        } else {
          // 如果标签是 ID 数组，从 tagMap 中查找名称
          userTags.value = tags.map(tag => {
            const tagId = typeof tag === 'number' ? tag : (typeof tag === 'string' ? parseInt(tag) : tag)
            // 尝试多种方式查找
            let tagName = tagMap.value.get(tagId)
            if (!tagName && typeof tag === 'string') {
              tagName = tagMap.value.get(parseInt(tag))
            }
            if (!tagName) {
              tagName = typeof tag === 'string' ? tag : `标签${tagId}`
            }
            console.log('映射标签ID:', tag, '->', tagName)
            return {
              id: tagId,
              name: tagName
            }
          })
        }
        console.log('最终用户标签:', userTags.value)
      } else {
        userTags.value = []
      }
      
      // 如果成功获取用户信息，更新本地存储
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...userInfo.value }
        localStorage.setItem('user', JSON.stringify(authStore.user))
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    // 如果 API 失败，尝试使用本地存储的用户信息
    userInfo.value = authStore.user || {}
    // 从本地存储的用户信息中提取标签并映射为名称
    if (userInfo.value && (userInfo.value.tags || userInfo.value.tagIds)) {
      const tags = userInfo.value.tags || userInfo.value.tagIds || []
      if (Array.isArray(tags) && tags.length > 0) {
        if (typeof tags[0] === 'object' && tags[0] !== null) {
          userTags.value = tags.map(tag => {
            const tagId = tag.id || tag.tagId || tag.tag_id
            const tagName = tag.name || tag.tagName || tag.tag_name
            if (tagName) {
              return { id: tagId, name: tagName }
            }
            // 从 tagMap 中查找
            const numericId = typeof tagId === 'string' ? parseInt(tagId) : tagId
            const mappedName = tagMap.value.get(numericId) || tagMap.value.get(tagId) || `标签${tagId}`
            return { id: tagId, name: mappedName }
          })
        } else {
          userTags.value = tags.map(tag => {
            const tagId = typeof tag === 'number' ? tag : (typeof tag === 'string' ? parseInt(tag) : tag)
            const tagName = tagMap.value.get(tagId) || (typeof tag === 'string' ? tag : `标签${tagId}`)
            return { id: tagId, name: tagName }
          })
        }
      } else {
        userTags.value = []
      }
    } else {
      userTags.value = []
    }
  }
}

// 加载用户统计数据（关注数和粉丝数）
async function loadUserStats() {
  try {
    const userId = authStore.userId
    if (!userId) return
    
    const stats = await getUserStats(userId)
    const statsData = stats?.data || stats || {}
    
    followingCount.value = statsData.following || 0
    followersCount.value = statsData.followers || 0
  } catch (error) {
    console.error('加载用户统计数据失败:', error)
    followingCount.value = 0
    followersCount.value = 0
  }
}

// 加载关注者列表
async function loadFollowers() {
  try {
    const userId = authStore.userId
    if (!userId) return
    
    userListLoading.value = true
    const offset = 0
    const limit = 10
    const followers = await getFollowers(userId, offset, limit)
    userList.value = Array.isArray(followers?.data) ? followers.data : (Array.isArray(followers) ? followers : [])
  } catch (error) {
    console.error('加载关注者列表失败:', error)
    userList.value = []
  } finally {
    userListLoading.value = false
  }
}

// 加载关注列表
async function loadFollowing() {
  try {
    const userId = authStore.userId
    if (!userId) return
    
    userListLoading.value = true
    const offset = 0
    const limit = 10
    const following = await getFollowing(userId, offset, limit)
    userList.value = Array.isArray(following?.data) ? following.data : (Array.isArray(following) ? following : [])
  } catch (error) {
    console.error('加载关注列表失败:', error)
    userList.value = []
  } finally {
    userListLoading.value = false
  }
}

// 打开用户列表模态框
async function openUserListModal(type) {
  userListType.value = type
  userListTitle.value = type === 'followers' ? '粉丝' : '关注'
  
  if (type === 'followers') {
    await loadFollowers()
  } else {
    await loadFollowing()
  }
  
  showUserListModal.value = true
}

// 关闭用户列表模态框
function closeUserListModal() {
  showUserListModal.value = false
}

// 关注状态变化处理
function handleFollowChanged(data) {
  const { userId, isFollowing } = data
  if (isFollowing) {
    followingCount.value++
  } else {
    followingCount.value = Math.max(0, followingCount.value - 1)
  }
  // 重新加载用户统计数据以确保准确性
  loadUserStats()
}

// 跳转到帖子详情
function goToPostDetail(postId) {
  router.push(`/post/${postId}`)
}

// 初始化
onMounted(async () => {
  await loadTagMap() // 先加载标签映射
  await loadUserInfo()
  // 同时加载所有需要的数据，确保右上角统计显示正确
  await Promise.all([
    loadMyPosts(),
    loadLikedPosts(),
    loadFavoritePosts(),
    loadFavoriteFolders(),
    loadUserStats() // 加载用户统计数据（关注数和粉丝数）
  ])
})
</script>

<style scoped>
.home-page {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 30px;
}

.profile-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.profile-handle {
  color: #888888;
  font-size: 16px;
  margin: 0 0 8px 0;
}

.profile-bio {
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.profile-tag {
  display: inline-block;
  padding: 4px 10px;
  background-color: #8b5cf6;
  color: #ffffff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.edit-profile-btn {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-profile-btn:hover {
  background-color: #7c3aed;
}

.profile-stats {
  display: flex;
  gap: 40px;
  padding-top: 20px;
  border-top: 1px solid #333333;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.stat-label {
  font-size: 14px;
  color: #888888;
  margin-top: 4px;
}

/* 标签切换 */
.tabs-section {
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #333333;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: none;
  border: none;
  color: #888888;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #ffffff;
}

.tab-button.active {
  color: #8b5cf6;
  border-bottom-color: #8b5cf6;
}

.tab-button .iconify {
  font-size: 18px;
}

/* 收藏夹选择器 */
.folder-selector {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #1a1a1a;
  border-radius: 12px;
}

.folder-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.folder-btn {
  padding: 8px 16px;
  background-color: #2a2a2a;
  border: 1px solid #333333;
  border-radius: 20px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.folder-btn:hover {
  background-color: #3a3a3a;
  border-color: #8b5cf6;
}

.folder-btn.active {
  background-color: #8b5cf6;
  border-color: #8b5cf6;
}

.add-folder-btn {
  background-color: transparent;
  border: 1px dashed #555555;
  color: #888888;
}

.add-folder-btn:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

/* 帖子区域 */
.posts-section {
  margin-bottom: 30px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #888888;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888888;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.post-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: #2a2a2a;
}

.post-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-thumbnail.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #555555;
}

.post-thumbnail.no-image .iconify {
  font-size: 48px;
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.post-item:hover .post-overlay {
  opacity: 1;
}

.post-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.stat .iconify {
  font-size: 16px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
}

.modal-content h3 {
  color: #ffffff;
  font-size: 20px;
  margin: 0 0 20px 0;
}

.folder-input {
  width: 100%;
  padding: 12px;
  background-color: #2a2a2a;
  border: 1px solid #333333;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
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

.btn-cancel,
.btn-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #2a2a2a;
  color: #ffffff;
}

.btn-cancel:hover {
  background-color: #3a3a3a;
}

.btn-confirm {
  background-color: #8b5cf6;
  color: #ffffff;
}

.btn-confirm:hover {
  background-color: #7c3aed;
}
</style>
