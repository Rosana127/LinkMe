<template>
  <div class="flex">
    <div class="flex-1 max-w-2xl mx-auto">
      <div class="bg-white rounded-xl p-8 shadow-sm mb-6">
        <h3 class="text-xl font-bold mb-6">今日推荐</h3>
        
        <div 
          id="match-card" 
          class="match-card relative rounded-xl overflow-hidden shadow-lg h-96 mb-6"
          :class="cardClass"
        >
          <img 
            :src="currentMatch.photo" 
            :alt="currentMatch.name" 
            class="w-full h-full object-cover"
          >
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 text-white">
            <h2 class="text-xl font-bold">{{ currentMatch.name }}, {{ currentMatch.age }}</h2>
            <p class="text-sm">{{ currentMatch.location }} · {{ currentMatch.job }}</p>
            <div class="flex mt-1">
              <span class="iconify mr-1" data-icon="mdi:map-marker" data-inline="false"></span>
              <span class="text-xs">{{ currentMatch.distance }}</span>
            </div>
            <div class="flex mt-3 space-x-2">
              <span 
                v-for="tag in currentMatch.tags" 
                :key="tag"
                class="bg-primary-500 text-xs rounded-full px-3 py-1"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="font-medium mb-4">个人简介</h4>
            <p class="text-gray-700">{{ currentMatch.bio }}</p>
          </div>
          
          <div>
            <h4 class="font-medium mb-4">兴趣爱好</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="interest in currentMatch.interests" 
                :key="interest"
                class="bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                {{ interest }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="space-y-4 mb-6">
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
              class="w-14 h-14 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
              @click="likeUser"
              :class="isLiked ? 'bg-red-600 ring-2 ring-red-300' : ''"
              title="喜欢"
            >
              <span class="iconify text-2xl" data-icon="mdi:heart" data-inline="false"></span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cardClass = ref('swipe-pending')

// 匹配列表数据
const matches = ref([
  {
    name: '张明宇',
    age: 26,
    location: '北京',
    job: '设计师',
    distance: '3公里内',
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    bio: '热爱摄影和旅行，希望能找到一个志同道合的伴侣一起探索世界的美好。平时喜欢阅读和品尝各种美食，偶尔也会自己下厨。',
    tags: ['摄影爱好者', '旅行达人'],
    interests: ['摄影', '旅行', '阅读', '美食', '烹饪', '电影']
  },
  {
    name: '李小雨',
    age: 24,
    location: '上海',
    job: '产品经理',
    distance: '5公里内',
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    bio: '喜欢音乐和电影，周末喜欢去咖啡厅看书。希望能找到一个有共同话题的人。',
    tags: ['音乐爱好者', '电影迷'],
    interests: ['音乐', '电影', '阅读', '咖啡', '旅行']
  },
  {
    name: '王强',
    age: 28,
    location: '深圳',
    job: '软件工程师',
    distance: '8公里内',
    photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
    bio: '热爱编程和技术，喜欢运动健身。希望找到一个能一起运动、一起成长的伴侣。',
    tags: ['技术达人', '健身爱好者'],
    interests: ['编程', '健身', '跑步', '篮球', '阅读']
  }
])

// 当前匹配索引
const currentIndex = ref(0)

// 跟踪每个用户的喜欢状态
const likedUsers = ref(new Set())

// 计算当前匹配对象
const currentMatch = computed(() => matches.value[currentIndex.value] || matches.value[0])

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
