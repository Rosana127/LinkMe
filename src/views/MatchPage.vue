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
        
        <div class="flex justify-center space-x-6 mb-6">
          <button 
            @click="swipeLeft" 
            class="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <span class="iconify text-2xl text-gray-500" data-icon="mdi:close" data-inline="false"></span>
          </button>
          <button 
            @click="superLike" 
            class="w-14 h-14 rounded-full bg-secondary shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            <span class="iconify text-2xl text-white" data-icon="mdi:star" data-inline="false"></span>
          </button>
          <button 
            @click="swipeRight" 
            class="w-14 h-14 rounded-full bg-primary-500 shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
          >
            <span class="iconify text-2xl text-white" data-icon="mdi:heart" data-inline="false"></span>
          </button>
        </div>
        
        <div v-if="showSuperLikeMessage" class="text-center mb-6">
          <div class="inline-flex items-center bg-gradient-to-r from-secondary to-primary-500 text-white px-4 py-2 rounded-full shadow-md">
            <span class="iconify mr-2" data-icon="mdi:star" data-inline="false"></span>
            <span>你使用了超级喜欢！</span>
          </div>
        </div>
        
        <button class="w-full btn-primary flex items-center justify-center">
          <span class="iconify mr-2" data-icon="mdi:message-text" data-inline="false"></span>
          发起聊天
        </button>
      </div>
    </div>
    
    <div class="w-80 ml-6">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h4 class="font-bold mb-4">专属匹配问卷</h4>
        <p class="text-sm text-gray-600 mb-4">完善你的个人资料，获得更精准的匹配推荐</p>
        <button 
          @click="goToQuestionnaire" 
          class="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
        >
          <span class="iconify mr-2" data-icon="mdi:clipboard-text" data-inline="false"></span>
          开始问卷
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cardClass = ref('swipe-pending')
const showSuperLikeMessage = ref(false)

const currentMatch = ref({
  name: '张明宇',
  age: 26,
  location: '北京',
  job: '设计师',
  distance: '3公里内',
  photo: 'https://modao.cc/ai/uploads/ai_pics/32/327751/aigp_1758963754.jpeg',
  bio: '热爱摄影和旅行，希望能找到一个志同道合的伴侣一起探索世界的美好。平时喜欢阅读和品尝各种美食，偶尔也会自己下厨。',
  tags: ['摄影爱好者', '旅行达人'],
  interests: ['摄影', '旅行', '阅读', '美食', '烹饪', '电影']
})

const swipeLeft = () => {
  cardClass.value = 'swipe-left'
  setTimeout(() => {
    cardClass.value = 'swipe-pending'
  }, 800)
}

const swipeRight = () => {
  cardClass.value = 'swipe-right'
  setTimeout(() => {
    cardClass.value = 'swipe-pending'
  }, 800)
}

const superLike = () => {
  showSuperLikeMessage.value = true
  cardClass.value = 'bg-gradient-to-tr from-secondary to-primary-300'
  
  setTimeout(() => {
    showSuperLikeMessage.value = false
    cardClass.value = 'swipe-pending'
    setTimeout(swipeRight, 500)
  }, 1500)
}

const goToQuestionnaire = () => {
  router.push('/questionnaire')
}
</script>

<style scoped>
</style>
