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
import { getQuestionnaire, getCompletedUsers } from '@/api/questionnaire'
import { getMatchRecommendations } from '@/api/match'
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
    
    // 跳转到聊天页面，并标记为来自匹配列表
    const targetUserId = currentMatch.value?.id
    if (targetUserId) {
      router.push({
        name: 'chat',
        params: { userId: targetUserId },
        query: { fromMatch: 'true' }
      })
    }
  }
}

// 发起聊天
const startChat = () => {
  const targetUserId = currentMatch.value?.id
  if (!targetUserId) {
    console.warn('发起聊天失败：当前用户缺少 id', currentMatch.value)
    return
  }

  // 跳转到聊天页并携带 userId，ChatPage 会根据该参数创建/选择会话
  // 标记为来自匹配列表
  router.push({
    name: 'chat',
    params: { userId: targetUserId },
    query: { fromMatch: 'true' }
  })
}

// 高匹配度用户列表（由后端 /match/recommendations 根据积分规则计算）
const highMatchUsers = ref([])

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

// 统一解析后端响应为数组
const parseListResponse = (response) => {
  if (Array.isArray(response)) return response
  if (response && typeof response === 'object') {
    // 兼容 { code, data } 或直接返回 data/list
    return response.data || response.list || []
  }
  return []
}

// 加载匹配推荐列表（使用后端计算匹配度 + 过滤已完成问卷的用户）
const loadMatchedUsers = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  matches.value = [] // 清空之前的数据
  
  try {
    console.log('开始加载匹配推荐列表（后端计算匹配度 + 过滤已完成问卷）...')
    const [recResp, completedResp] = await Promise.all([
      getMatchRecommendations(1, 50),
      getCompletedUsers(1, 200)
    ])
    const recommendations = parseListResponse(recResp)
    const completedList = parseListResponse(completedResp)
    const completedIds = new Set(
      completedList
        .map(u => u.userId || u.id)
        .filter(id => id != null)
    )
    console.log('推荐用户数量:', recommendations.length, '已完成问卷数量:', completedIds.size)
    
    // 仅保留已完成问卷的用户
    const filtered = recommendations.filter(rec => completedIds.has(rec.userId))
    
    if (filtered.length > 0) {
      // 格式化推荐数据为前端需要的格式
      matches.value = filtered.map(rec => ({
        id: rec.userId,
        name: rec.nickname || '未知用户',
        age: calculateAge(rec.birthday) || 25,
        location: rec.region || '未知',
        job: '未知', // 后端暂未提供此字段
        distance: '未知距离', // 后端暂未提供此字段
        photo: rec.avatarUrl || 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
        bio: rec.bio || '这个人很懒，什么都没有留下。',
        tags: [], // 后端暂未提供此字段
        interests: Array.isArray(rec.interests) ? convertInterestsToLabels(rec.interests) : [],
        matchScore: rec.matchScore || 0,
        gender: rec.gender,
        email: rec.email,
        phone: rec.phone,
        username: rec.username,
        createdAt: rec.createdAt
      }))
      
      console.log('✅ 加载匹配推荐成功（已过滤），数量:', matches.value.length)
      
      // 如果推荐中没有兴趣（老后端），再回退逐个拉问卷补充兴趣
      const hasAnyInterest = matches.value.some(m => Array.isArray(m.interests) && m.interests.length > 0)
      if (!hasAnyInterest) {
        await loadUserQuestionnaires()
      }
      
      console.log('格式化后的用户列表（包含问卷信息）:', matches.value)
    } else {
      console.log('暂无匹配推荐用户')
      matches.value = [] // 确保为空数组
    }
    
  } catch (error) {
    console.error('❌ 加载匹配推荐失败:', error)
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

// 兴趣编码到名称的映射（与问卷页保持一致）
const INTEREST_LABELS = {
  art: '绘画',
  photography: '摄影',
  calligraphy: '书法',
  writing: '写作',
  singing: '歌唱',
  dance: '舞蹈',
  theater: '戏剧',
  instrument: '乐器演奏',
  graphic_design: '平面设计',
  video_editing: '视频剪辑',
  reading: '阅读',
  programming: '编程',
  teaching: '教学',
  psychology: '心理学',
  language_learning: '语言学习',
  philosophy: '哲学思考',
  history_research: '历史研究',
  investment: '投资理财',
  public_speaking: '公开演讲',
  entrepreneurship: '创业项目',
  running: '跑步',
  fitness: '健身',
  swimming: '游泳',
  cycling: '骑行',
  fishing: '钓鱼',
  yoga: '瑜伽',
  camping: '露营',
  martial_arts: '武术',
  mountaineering: '登山',
  climbing: '攀岩',
  frisbee: '飞盘',
  team_sports: '球类运动',
  board_games: '桌游',
  card_games: '棋牌',
  magic: '魔术',
  collecting: '收藏',
  tv_shows: '追剧',
  movies: '看电影',
  music: '听音乐',
  script_killing: '剧本杀',
  escape_room: '密室逃脱',
  gaming: '电子游戏',
  cooking_baking: '烹饪/烘焙',
  coffee_tea_mixology: '咖啡/茶艺/调酒',
  handicraft_diy: '手工 DIY',
  sewing: '缝纫',
  home_decoration: '家居装饰',
  organizing: '收纳整理',
  floristry_gardening: '花艺绿植',
  travel: '旅行',
  bird_watching: '观鸟',
  music_festival: '音乐节',
  concert: '演唱会',
  restaurant_hopping: '探店打卡',
  exhibition: '展览打卡',
  astronomy: '天文观测',
  volunteering: '公益志愿',
  petting: '撸猫撸狗',
  city_walk: 'city walk'
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

// 将兴趣编码转换为中文名称
const convertInterestsToLabels = (interestCodes) => {
  if (!Array.isArray(interestCodes) || interestCodes.length === 0) {
    return []
  }
  return interestCodes
    .map(code => INTEREST_LABELS[code] || code)
    .filter(Boolean)
}

// 为每个用户加载问卷信息（包括兴趣爱好）
const loadUserQuestionnaires = async () => {
  console.log('开始为每个用户加载问卷信息...')
  
  // 并发获取所有用户的问卷信息
  const questionnairePromises = matches.value.map(async (match) => {
    const userId = match.id
    if (!userId) {
      console.warn('用户ID为空，跳过问卷加载:', match)
      return
    }
    
    try {
      console.log(`正在获取用户 ${userId} 的问卷信息...`)
      const questionnaire = await getQuestionnaire(userId)
      
      // 处理不同的响应格式
      const qData = questionnaire?.data || questionnaire || {}
      
      // 提取兴趣列表（interests 字段）
      const interests = qData.interests || []
      
      if (interests.length > 0) {
        // 将兴趣编码转换为中文名称
        const interestLabels = convertInterestsToLabels(interests)
        
        // 更新到 matches 数组中
        const matchIndex = matches.value.findIndex(m => m.id === userId)
        if (matchIndex >= 0) {
          matches.value[matchIndex].interests = interestLabels
          console.log(`✅ 用户 ${userId} 的兴趣爱好已加载:`, interestLabels)
        }
      } else {
        console.log(`用户 ${userId} 的问卷中没有兴趣爱好数据`)
      }
    } catch (error) {
      // 如果获取问卷失败（比如用户没有填写问卷），记录但不中断流程
      console.warn(`获取用户 ${userId} 的问卷信息失败:`, error.message || error)
      // 保持 interests 为空数组
    }
  })
  
  // 等待所有请求完成
  await Promise.all(questionnairePromises)
  console.log('✅ 所有用户的问卷信息加载完成')
}

// 加载高匹配度推荐列表（同样过滤为已完成问卷的用户）
const loadHighMatchUsers = async () => {
  try {
    console.log('开始加载高匹配度推荐列表（过滤已完成问卷）...')
    const [recResp, completedResp] = await Promise.all([
      getMatchRecommendations(1, 50),
      getCompletedUsers(1, 200)
    ])
    const recommendations = parseListResponse(recResp)
    const completedIds = new Set(
      parseListResponse(completedResp)
        .map(u => u.userId || u.id)
        .filter(id => id != null)
    )
    const filtered = recommendations.filter(rec => completedIds.has(rec.userId))

    // 格式化为前端需要的格式
    const formatted = filtered.map(rec => ({
      id: rec.userId,
      name: rec.nickname || '未知用户',
      age: calculateAge(rec.birthday) || 25,
      photo: rec.avatarUrl || 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
      matchScore: rec.matchScore || 0,
      isOnline: Math.random() > 0.5 // 随机在线状态，后续可以从后端获取
    }))

    // 根据匹配度从高到低排序，取前10个
    const sorted = formatted
      .slice()
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

    highMatchUsers.value = sorted.slice(0, 10)

    console.log('✅ 高匹配度推荐加载完成（已过滤），数量:', highMatchUsers.value.length)
    console.log('高匹配度推荐列表:', highMatchUsers.value)
  } catch (error) {
    console.error('❌ 加载高匹配度推荐失败:', error)
    highMatchUsers.value = []
  }
}

// 页面加载时获取匹配用户 & 高匹配度推荐
onMounted(() => {
  loadMatchedUsers()
  loadHighMatchUsers()
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
