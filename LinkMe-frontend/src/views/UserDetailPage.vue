<template>
  <div class="user-detail-page">
    <div class="back-button" @click="goBack">
      <span class="iconify" data-icon="mdi:arrow-left" data-inline="false"></span>
      返回
    </div>
    
    <!-- 用户资料卡片 -->
    <div class="profile-card">
      <img :src="userInfo?.avatar || 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg'" :alt="userInfo?.nickname" class="profile-avatar">
      <h2 class="profile-name">{{ userInfo?.nickname || userInfo?.username || '用户' }}</h2>
      <p class="profile-handle">@{{ userInfo?.username || 'username' }}</p>
      <p class="profile-bio">{{ userInfo?.bio || '暂无简介' }}</p>
      
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-number">{{ userStats?.posts || 0 }}</span>
          <span class="stat-label">帖子</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ userStats?.followers || 0 }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ userStats?.following || 0 }}</span>
          <span class="stat-label">关注</span>
        </div>
      </div>
      
      <!-- 关注/取消关注按钮 -->
      <button 
        v-if="currentUserId !== userId" 
        :class="['follow-button', { following: followingMap.get(userId) || false }]"
        @click="toggleFollow"
      >
        {{ (followingMap.get(userId) || false) ? '取消关注' : '关注' }}
      </button>
      
      <!-- 聊天按钮（仅当已关注时显示） -->
      <button 
        v-if="currentUserId !== userId && (followingMap.get(userId) || false)" 
        class="chat-button"
        @click="startChat"
      >
        <span class="iconify" data-icon="mdi:message-text-outline" data-inline="false"></span>
        聊天
      </button>
    </div>
    
    <!-- 用户最近帖子 -->
    <h3 class="posts-title">最近帖子</h3>
    <div v-if="loadingPosts" class="loading-message">加载中...</div>
    <div v-else-if="userPosts.length === 0" class="empty-message">暂无帖子</div>
    <div v-else class="posts-grid">
      <router-link 
        v-for="post in userPosts" 
        :key="post.id" 
        :to="{ name: 'post', params: { id: post.id } }" 
        class="post-card post-link"
      >
        <!-- 帖子内容 -->
        <div class="post-content">
          <p class="post-caption">{{ post.caption }}</p>
          <div class="hashtags">{{ post.hashtags }}</div>
        </div>
        
        <!-- 图片 -->
        <div class="post-image" v-if="post.image">
          <img :src="post.image" :alt="post.caption" class="w-full rounded-lg">
        </div>
        
        <!-- 互动数据 -->
        <div class="post-stats">
          <span>{{ post.likeCount || 0 }} 点赞</span>
          <span>{{ post.commentCount || 0 }} 评论</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getUserInfo, followUser, unfollowUser, checkFollowing, getUserStats } from '@/api/user'
import { getUserPosts } from '@/api/posts'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const userId = ref(Number(route.params.id))
const currentUserId = ref(authStore.userId)
const userInfo = ref(null)
const userStats = ref(null)
const userPosts = ref([])
const followingMap = ref(new Map()) // 使用Map存储关注状态，参考DiscoverPage和PostDetail
const loadingPosts = ref(false)

// 获取用户信息
const loadUserInfo = async () => {
  try {
    const info = await getUserInfo(userId.value)
    userInfo.value = info?.data || info
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 获取用户统计数据
const loadUserStats = async () => {
  try {
    const stats = await getUserStats(userId.value)
    userStats.value = stats?.data || stats
  } catch (error) {
    console.error('加载用户统计数据失败:', error)
  }
}

// 获取用户帖子
const loadUserPosts = async () => {
  loadingPosts.value = true
  try {
    // 首先尝试从API获取用户发布的帖子
    const posts = await getUserPosts(userId.value)
    // 确保返回的是数组
    const postList = Array.isArray(posts) ? posts : (posts?.data && Array.isArray(posts.data) ? posts.data : [])
    
    // 过滤确保只显示该用户发布的帖子
    userPosts.value = postList.filter(post => post.userId === userId.value)
    console.log('获取用户帖子后过滤:', userId.value, userPosts.value)
  } catch (error) {
    console.error('加载用户帖子失败:', error)
    
    // 尝试从本地存储获取
    try {
      const raw = localStorage.getItem(`posts_user_${userId.value}`)
      if (raw) {
        const localPosts = JSON.parse(raw)
        userPosts.value = localPosts.filter(post => post.userId === userId.value)
        console.log('从本地存储获取用户帖子:', userId.value, userPosts.value)
      } else {
        userPosts.value = []
      }
    } catch (localError) {
      console.error('从本地存储加载用户帖子失败:', localError)
      userPosts.value = []
    }
  } finally {
    loadingPosts.value = false
  }
}

// 检查关注状态
const checkFollowStatus = async () => {
  try {
    const result = await checkFollowing(userId.value)
    const isFollowing = result?.data?.isFollowing || false
    followingMap.value.set(userId.value, isFollowing)
    console.log('检查关注状态结果:', userId.value, isFollowing, followingMap.value)
  } catch (error) {
    console.error('检查关注状态失败:', error)
    
    // 尝试从本地存储获取关注状态
    try {
      const followingData = JSON.parse(localStorage.getItem('followingMap') || '{}')
      const isFollowing = followingData[userId.value] || false
      followingMap.value.set(userId.value, isFollowing)
      console.log('从本地存储获取关注状态:', userId.value, isFollowing, followingMap.value)
    } catch (localError) {
      console.error('从本地存储加载关注状态失败:', localError)
      followingMap.value.set(userId.value, false)
      console.log('检查关注状态失败，设置为false:', userId.value, followingMap.value)
    }
  }
}

// 关注/取消关注
const toggleFollow = async () => {
  try {
    const currentUserIdVal = userId.value
    const isCurrentlyFollowing = followingMap.value.get(currentUserIdVal) || false
    
    if (isCurrentlyFollowing) {
      await unfollowUser(currentUserIdVal)
      followingMap.value.set(currentUserIdVal, false)
      if (userStats.value) {
        userStats.value.followers = Math.max(0, (userStats.value.followers || 0) - 1)
      }
    } else {
      await followUser(currentUserIdVal)
      followingMap.value.set(currentUserIdVal, true)
      if (userStats.value) {
        userStats.value.followers = (userStats.value.followers || 0) + 1
      }
    }
    
    // 将关注状态保存到本地存储
    try {
      const followingData = {};
      followingMap.value.forEach((value, key) => {
        followingData[key] = value;
      });
      localStorage.setItem('followingMap', JSON.stringify(followingData));
      console.log('关注状态已保存到本地存储:', followingData);
    } catch (localError) {
      console.error('保存关注状态到本地存储失败:', localError);
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    
    // 如果API调用失败，仍然更新本地状态和UI
    const currentUserIdVal = userId.value
    const isCurrentlyFollowing = followingMap.value.get(currentUserIdVal) || false
    
    // 反转当前状态
    const newStatus = !isCurrentlyFollowing
    followingMap.value.set(currentUserIdVal, newStatus)
    if (userStats.value) {
      userStats.value.followers = newStatus 
        ? (userStats.value.followers || 0) + 1 
        : Math.max(0, (userStats.value.followers || 0) - 1)
    }
    
    console.log('API调用失败，已更新本地状态:', currentUserIdVal, newStatus, followingMap.value)
  }
}

// 开始聊天
const startChat = () => {
  router.push({ name: 'chat', params: { userId: userId.value } })
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 初始化
onMounted(async () => {
  if (!userId.value) {
    router.push('/discover')
    return
  }
  
  await Promise.all([
    loadUserInfo(),
    loadUserStats(),
    loadUserPosts(),
    checkFollowStatus()
  ])
})
</script>

<style scoped>
.user-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
}

.profile-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  margin-bottom: 30px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
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
  margin: 0 0 12px 0;
}

.profile-bio {
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
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

.follow-button {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 10px;
  margin-bottom: 10px;
}

.follow-button:hover {
  background-color: #7c3aed;
}

.follow-button.following {
  background-color: #333333;
  color: #ffffff;
}

.follow-button.following:hover {
  background-color: #444444;
}

.chat-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #1a1a1a;
  color: #8b5cf6;
  border: 1px solid #8b5cf6;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-button:hover {
  background-color: #8b5cf6;
  color: #ffffff;
}

.posts-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.post-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 16px;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-caption {
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 12px;
}

.post-image {
  margin-bottom: 12px;
}

.post-stats {
  display: flex;
  justify-content: space-between;
  color: #888888;
  font-size: 14px;
}

.loading-message, .empty-message {
  text-align: center;
  color: #888888;
  padding: 40px 0;
}
</style>