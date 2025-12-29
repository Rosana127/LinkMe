<template>
  <div class="flex">
    <div class="flex-1 max-w-2xl mx-auto">
      <div class="bg-white rounded-xl p-8 shadow-sm mb-6">
        <h3 class="text-xl font-bold mb-6">今日推荐</h3>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
          <p class="text-gray-600">正在加载用户信息...</p>
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="matches.length === 0" class="text-center py-12">
          <span class="iconify text-4xl text-gray-400 mb-4 block" data-icon="mdi:account-search" data-inline="false"></span>
          <p class="text-gray-600">暂无填写过问卷的用户</p>
          <p class="text-sm text-gray-500 mt-2">请稍后再试或检查网络连接</p>
        </div>
        
        <!-- 用户卡片 -->
        <div 
          v-else
          id="match-card" 
          class="match-card relative rounded-xl overflow-hidden shadow-lg h-96 mb-6"
          :class="cardClass"
        >
          <img 
            :src="currentMatch?.photo || ''" 
            :alt="currentMatch?.name || '用户'" 
            class="w-full h-full object-cover"
          >
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 text-white">
            <h2 class="text-xl font-bold">{{ currentMatch?.name || '未知' }}, {{ currentMatch?.age || 0 }}</h2>
            <p class="text-sm">{{ currentMatch?.location || '' }} · {{ currentMatch?.job || '' }}</p>
            <div class="flex mt-1">
              <span class="iconify mr-1" data-icon="mdi:map-marker" data-inline="false"></span>
              <span class="text-xs">{{ currentMatch?.distance || '' }}</span>
            </div>
            <div class="flex mt-3 space-x-2">
              <span 
                v-for="tag in (currentMatch?.tags || [])" 
                :key="tag"
                class="bg-primary-500 text-xs rounded-full px-3 py-1"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="!isLoading && matches.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="font-medium mb-4">个人简介</h4>
            <p class="text-gray-700">{{ currentMatch?.bio || '暂无简介' }}</p>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">兴趣爱好</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="interest in (currentMatch?.interests || [])" 
                :key="interest"
                class="bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                {{ interest }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="!isLoading && matches.length > 0" class="space-y-4 mb-6">
          <!-- 上一页、下一页按钮行 -->
          <div class="flex justify-between items-center gap-4">
            <button 
              @click.stop.prevent="previousMatch" 
              type="button"
              class="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all border-2 relative z-10"
              :class="currentIndex === 0 
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md active:scale-95 cursor-pointer'"
              :disabled="currentIndex === 0"
              style="pointer-events: auto;"
            >
              <span class="iconify mr-2 text-lg" data-icon="mdi:chevron-left" data-inline="false"></span>
              <span class="whitespace-nowrap text-base font-semibold">上一个</span>
            </button>
            <button 
              @click.stop.prevent="nextMatch" 
              type="button"
              class="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all border-2 relative z-10"
              :class="currentIndex >= matches.length - 1 
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md active:scale-95 cursor-pointer'"
              :disabled="currentIndex >= matches.length - 1"
              style="pointer-events: auto;"
            >
              <span class="whitespace-nowrap text-base font-semibold">下一个</span>
              <span class="iconify ml-2 text-lg" data-icon="mdi:chevron-right" data-inline="false"></span>
            </button>
          </div>
          
          <!-- 发起聊天、爱心按钮行 -->
          <div class="flex justify-between items-center gap-4">
            <button 
              class="flex-1 px-6 py-3 btn-primary flex items-center justify-center rounded-lg transition-all hover:shadow-md active:scale-95"
              @click="startChat"
            >
              <span class="iconify mr-2" data-icon="mdi:message-text" data-inline="false"></span>
              <span class="whitespace-nowrap">发起聊天</span>
            </button>
            <button 
              class="px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
              @click="likeUser"
              :class="isLiked ? 'bg-red-600 ring-2 ring-red-300' : ''"
              title="喜欢"
            >
              <span class="iconify text-xl" data-icon="mdi:heart" data-inline="false"></span>
              <span class="whitespace-nowrap text-sm font-medium">喜欢</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="w-80 ml-6">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h4 class="font-bold mb-4">专属匹配问卷</h4>
        <p class="text-sm text-gray-600 mb-4">完善你的个人资料，获得更精准的匹配推荐</p>
        <button 
          @click="goToQuestionnaire" 
          class="questionnaire-btn w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <span class="iconify mr-3 text-3xl" data-icon="mdi:file-document-edit" data-inline="false"></span>
          <span class="text-lg font-semibold">开始问卷</span>
        </button>
      </div>
      
      <!-- 高匹配度列表 -->
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-bold text-lg">高匹配度推荐</h4>
          <span class="text-xs text-gray-500">基于问卷匹配</span>
        </div>
        
        <div class="space-y-3">
          <div 
            v-for="user in highMatchUsers" 
            :key="user.id"
            @click="selectMatchUser(user)"
            class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 hover:shadow-md border border-transparent hover:border-gray-200"
            :class="{ 'bg-purple-50 border-purple-200': selectedUser?.id === user.id }"
          >
            <!-- 头像 -->
            <div class="relative flex-shrink-0">
              <img 
                :src="user.photo" 
                :alt="user.name"
                class="w-12 h-12 rounded-full object-cover border-2"
                :class="user.matchScore >= 90 ? 'border-green-400' : user.matchScore >= 80 ? 'border-yellow-400' : 'border-gray-300'"
              >
              <!-- 在线状态指示器 -->
              <div 
                v-if="user.isOnline"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              ></div>
            </div>
            
            <!-- 用户信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold text-gray-900 truncate">{{ user.name }}</span>
                <span class="text-xs text-gray-500">{{ user.age }}岁</span>
              </div>
              
              <!-- 匹配度 -->
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all duration-300"
                    :class="getMatchScoreColor(user.matchScore)"
                    :style="{ width: user.matchScore + '%' }"
                  ></div>
                </div>
                <span 
                  class="text-xs font-bold min-w-[40px] text-right"
                  :class="getMatchScoreTextColor(user.matchScore)"
                >
                  {{ user.matchScore }}%
                </span>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="highMatchUsers.length === 0" class="text-center py-8 text-gray-500">
            <span class="iconify text-4xl mb-2 block" data-icon="mdi:account-search" data-inline="false"></span>
            <p class="text-sm">暂无匹配推荐</p>
            <p class="text-xs mt-1">完成问卷后查看匹配结果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUsersWithQuestionnaire } from '@/api/user'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const cardClass = ref('swipe-pending')
const isLoading = ref(false)

// 匹配列表数据
const matches = ref([])

// 当前匹配索引
const currentIndex = ref(0)

// 跟踪每个用户的喜欢状态
const likedUsers = ref(new Set())

// 计算当前匹配对象
const currentMatch = computed(() => {
  if (!matches.value || matches.value.length === 0) {
    return {
      name: '暂无数据',
      age: 0,
      location: '',
      job: '',
      distance: '',
      photo: '',
      bio: '',
      tags: [],
      interests: []
    }
  }
  return matches.value[currentIndex.value] || matches.value[0]
})

// 检查当前用户是否已喜欢
const isLiked = computed(() => {
  const userId = currentMatch.value?.id || currentIndex.value
  return likedUsers.value.has(userId)
})

// 上一个匹配
const previousMatch = () => {
  console.log('previousMatch called, currentIndex:', currentIndex.value, 'matches.length:', matches.value.length)
  if (currentIndex.value > 0) {
    currentIndex.value--
    cardClass.value = 'swipe-pending'
    console.log('Moved to previous, new index:', currentIndex.value)
  } else {
    console.log('Already at first match, cannot go previous')
  }
}

// 下一个匹配
const nextMatch = () => {
  console.log('nextMatch called, currentIndex:', currentIndex.value, 'matches.length:', matches.value.length)
  if (currentIndex.value < matches.value.length - 1) {
    currentIndex.value++
    cardClass.value = 'swipe-pending'
    console.log('Moved to next, new index:', currentIndex.value)
  } else {
    console.log('Already at last match, cannot go next')
  }
}

// 喜欢用户
const likeUser = () => {
  const userId = currentMatch.value?.id || currentIndex.value
  if (likedUsers.value.has(userId)) {
    // 取消喜欢
    likedUsers.value.delete(userId)
    console.log('取消喜欢用户:', currentMatch.value.name)
  } else {
    // 添加喜欢
    likedUsers.value.add(userId)
    console.log('喜欢用户:', currentMatch.value.name)
    // 可以在这里添加提示动画或消息
  }
}

// 发起聊天
const startChat = () => {
  console.log('发起聊天，用户:', currentMatch.value.name)
  // 这里可以添加跳转到聊天页面的逻辑
  // router.push(`/chat/${currentMatch.value.id}`)
}

// 高匹配度用户列表
const highMatchUsers = ref([
  {
    id: 1,
    name: '陈思雨',
    age: 25,
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    matchScore: 95,
    isOnline: true
  },
  {
    id: 2,
    name: '刘浩然',
    age: 27,
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    matchScore: 88,
    isOnline: false
  },
  {
    id: 3,
    name: '赵雅琪',
    age: 24,
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    matchScore: 85,
    isOnline: true
  },
  {
    id: 4,
    name: '孙文博',
    age: 26,
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    matchScore: 82,
    isOnline: false
  },
  {
    id: 5,
    name: '周雨欣',
    age: 23,
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    matchScore: 80,
    isOnline: true
  }
])

// 选中的用户
const selectedUser = ref(null)

// 根据匹配度获取进度条颜色
const getMatchScoreColor = (score) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 80) return 'bg-yellow-500'
  if (score >= 70) return 'bg-orange-500'
  return 'bg-red-500'
}

// 根据匹配度获取文字颜色
const getMatchScoreTextColor = (score) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-yellow-600'
  if (score >= 70) return 'text-orange-600'
  return 'text-red-600'
}

// 选择匹配用户
const selectMatchUser = (user) => {
  selectedUser.value = user
  // 找到对应的匹配并切换到该用户
  const matchIndex = matches.value.findIndex(m => m.name === user.name)
  if (matchIndex !== -1) {
    currentIndex.value = matchIndex
  }
  console.log('选择用户:', user.name, '匹配度:', user.matchScore + '%')
}

const goToQuestionnaire = () => {
  router.push('/questionnaire')
}

// 加载填写过问卷的用户列表（基于 user_questionnaire_completion 表）
const loadMatchedUsers = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  matches.value = [] // 清空之前的数据
  
  try {
    console.log('开始加载填写过问卷的用户（基于 user_questionnaire_completion 表）...')
    
    // 使用基于 user_questionnaire_completion 表的API
    const response = await getUsersWithQuestionnaire(0, 50)
    console.log('API原始响应:', response)
    
    // 处理响应数据：request.js 已经处理了 code: 0 的情况，返回的是 data 数组
    // 但为了兼容性，也支持直接返回数组或包含 data/list 字段的对象
    let usersData = []
    if (Array.isArray(response)) {
      usersData = response
    } else if (response && typeof response === 'object') {
      usersData = response.data || response.list || []
    }
    
    console.log('解析后的用户数据:', usersData)
    console.log('用户数量:', usersData.length)
    
    if (usersData.length > 0) {
      matches.value = formatUsersData(usersData)
      console.log('✅ 加载用户成功，数量:', matches.value.length)
      console.log('格式化后的用户列表:', matches.value)
    } else {
      console.log('暂无填写过问卷的用户')
      matches.value = [] // 确保为空数组
    }
    
  } catch (error) {
    console.error('❌ 加载用户失败:', error)
    console.error('错误详情:', {
      message: error.message,
      status: error.status,
      response: error.response
    })
    matches.value = [] // 出错时设置为空数组
  } finally {
    isLoading.value = false
    console.log('加载完成，最终用户数量:', matches.value.length)
  }
}

// 格式化用户数据
const formatUsersData = (usersData) => {
  return usersData.map((user, index) => ({
    id: user.userId || user.id || index,
    // 名称：优先使用 nickname，然后是 name、username
    name: user.nickname || user.name || user.username || '未知用户',
    // 年龄：如果有 age 字段直接使用，否则根据 birthday 计算
    age: user.age || calculateAge(user.birthday) || 25,
    // 位置：优先使用 region，然后是 location、city
    location: user.region || user.location || user.city || '未知',
    // 工作：job 或 profession
    job: user.job || user.profession || '未知',
    // 距离：如果有就使用，否则使用默认值
    distance: user.distance || '未知距离',
    // 头像：优先使用 avatarUrl，然后是 avatar、photo
    photo: user.avatarUrl || user.avatar || user.photo || 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    // 简介：bio、introduction、description
    bio: user.bio || user.introduction || user.description || '这个人很懒，什么都没有留下。',
    // 标签和兴趣
    tags: user.tags || [],
    interests: user.interests || [],
    // 保留原始数据中的其他字段（如 gender、email、phone 等）
    gender: user.gender,
    email: user.email,
    phone: user.phone,
    username: user.username,
    createdAt: user.createdAt
  }))
}

// 根据生日计算年龄
const calculateAge = (birthday) => {
  if (!birthday) return null
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 页面加载时获取匹配用户
onMounted(() => {
  loadMatchedUsers()
})
</script>

<style scoped>
.questionnaire-btn {
  position: relative;
  overflow: hidden;
}

.questionnaire-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.questionnaire-btn:hover::before {
  left: 100%;
}

.questionnaire-btn .iconify {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
