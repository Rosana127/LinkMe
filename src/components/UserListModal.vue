<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">
          <span class="iconify" data-icon="mdi:close" data-inline="false"></span>
        </button>
      </div>
      
      <div class="user-list">
        <div v-if="loading" class="loading-message">加载中...</div>
        <div v-else-if="users.length === 0" class="empty-message">暂无数据</div>
        <div v-else class="users-container">
          <div 
            v-for="user in users" 
            :key="user.userId || user.id"
            class="user-item"
          >
            <div class="user-info">
              <img 
                :src="getAvatarUrl(user.avatar || user.avatarUrl, user.nickname || user.username)" 
                :alt="user.nickname || user.username"
                class="user-avatar"
                @click="goToUserDetail(user.userId || user.id)"
                @error="handleAvatarError($event, user.nickname || user.username)"
              >
              <div class="user-details">
                <div class="username">{{ user.nickname || user.username }}</div>
                <div class="user-handle">@{{ user.username || 'username' }}</div>
              </div>
            </div>
            
            <!-- 关注/取消关注按钮（只对非当前用户显示） -->
            <button 
              v-if="(user.userId || user.id) !== currentUserId" 
              :class="getFollowButtonClass(user)"
              @click="toggleFollow(user.userId || user.id)"
            >
              {{ getFollowButtonText(user) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { followUser, unfollowUser } from '@/api/user'
import { getAvatarUrl, handleAvatarError } from '@/utils/avatar'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '用户列表'
  },
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'followers' // 'followers' or 'following'
  }
})

// Emits
const emit = defineEmits(['close', 'follow-changed'])

const router = useRouter()
const authStore = useAuthStore()
const currentUserId = ref(authStore.userId)
const followingMap = ref(new Map()) // 存储关注状态

// 检查是否关注某用户
const isFollowing = (userId) => {
  return followingMap.value.get(userId) || false
}

// 设置用户的关注状态
const setFollowingStatus = (users) => {
  users.forEach(user => {
    const userId = user.userId || user.id
    if (!userId) return
    
    if (props.type === 'following') {
      // 对于关注列表（following），所有用户都是我关注的人，所以followingMap中的值应该都是true
      // user.isFollowing表示的是对方是否关注了我（即是否互相关注），这个信息用于显示文本，但不影响关注状态
      followingMap.value.set(userId, true)
    } else if (props.type === 'followers') {
      // 对于粉丝列表（followers），使用后端返回的 isFollowing 字段
      // isFollowing 表示当前用户是否关注了该粉丝（即是否互相关注）
      followingMap.value.set(userId, user.isFollowing || false)
    }
  })
}

// 计算按钮显示文本
const getFollowButtonText = (user) => {
  const userId = user.userId || user.id
  const isFollowingUser = isFollowing(userId)
  
  // 如果是关注列表
  if (props.type === 'following') {
    // 如果我已经取消关注，直接显示关注
    if (!isFollowingUser) {
      return '关注'
    }
    // 我还在关注他，并且对方也关注了我，显示互相关注
    if (user.isFollowing) {
      return '互相关注'
    } else {
      // 我还在关注他，但对方没关注我，显示已关注
      return '已关注'
    }
  }
  
  // 如果是粉丝列表
  if (props.type === 'followers') {
    // 我也关注了他，显示互相关注
    if (isFollowingUser) {
      return '互相关注'
    } else {
      // 我没关注他，显示回关
      return '回关'
    }
  }
  
  return isFollowingUser ? '已关注' : '关注'
}

// 计算按钮样式类
const getFollowButtonClass = (user) => {
  const userId = user.userId || user.id
  const isFollowingUser = isFollowing(userId)
  
  return {
    'follow-button': true,
    'following': isFollowingUser // 根据实际关注状态返回样式类
  }
}

// 关注/取消关注
const toggleFollow = async (userId) => {
  try {
    const isCurrentlyFollowing = isFollowing(userId)
    
    if (isCurrentlyFollowing) {
      await unfollowUser(userId)
      followingMap.value.set(userId, false)
    } else {
      await followUser(userId)
      followingMap.value.set(userId, true)
    }
    
    // 更新本地用户数据中的 isFollowing 字段（用于粉丝列表）
    if (props.type === 'followers') {
      const user = props.users.find(u => (u.userId || u.id) === userId)
      if (user) {
        user.isFollowing = !isCurrentlyFollowing
      }
    }
    
    // 通知父组件关注状态变化
    emit('follow-changed', {
      userId,
      isFollowing: !isCurrentlyFollowing
    })
  } catch (error) {
    console.error('关注操作失败:', error)
    // 如果操作失败，恢复状态
    const user = props.users.find(u => (u.userId || u.id) === userId)
    if (user && props.type === 'followers') {
      user.isFollowing = isFollowing(userId)
    }
  }
}

// 关闭模态框
const close = () => {
  emit('close')
}

// 跳转到用户详情
const goToUserDetail = (userId) => {
  close() // 先关闭模态框
  router.push({ name: 'user', params: { id: userId } })
}

// 初始化关注状态
setFollowingStatus(props.users)

// 监听 users 变化，更新关注状态
watch(() => props.users, (newUsers) => {
  if (newUsers && newUsers.length > 0) {
    setFollowingStatus(newUsers)
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333333;
}

.modal-header h3 {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.users-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #222222;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
}

.user-handle {
  color: #888888;
  font-size: 14px;
  margin-top: 2px;
}

.follow-button {
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

.loading-message, .empty-message {
  text-align: center;
  color: #888888;
  padding: 40px 0;
}
</style>