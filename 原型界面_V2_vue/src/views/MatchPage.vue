<template>
  <div class="flex">
    <div class="w-2/3 pr-6">
      <div class="bg-white rounded-xl p-8 shadow-sm mb-6">
        <h3 class="text-xl font-bold mb-6">今日推荐</h3>
        
        <div class="flex">
          <div class="w-1/2 pr-4">
            <div 
              id="match-card" 
              class="match-card relative rounded-xl overflow-hidden shadow-lg h-96"
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
            
            <div class="flex justify-center space-x-6 mt-6">
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
            
            <div v-if="showSuperLikeMessage" class="mt-4 text-center">
              <div class="inline-flex items-center bg-gradient-to-r from-secondary to-primary-500 text-white px-4 py-2 rounded-full shadow-md">
                <span class="iconify mr-2" data-icon="mdi:star" data-inline="false"></span>
                <span>你使用了超级喜欢！</span>
              </div>
            </div>
          </div>
          
          <div class="w-1/2 pl-4">
            <h4 class="font-medium mb-4">个人简介</h4>
            <p class="text-gray-700 mb-6">{{ currentMatch.bio }}</p>
            
            <h4 class="font-medium mb-4">兴趣爱好</h4>
            <div class="flex flex-wrap gap-2 mb-6">
              <span 
                v-for="interest in currentMatch.interests" 
                :key="interest"
                class="bg-gray-100 rounded-full px-3 py-1 text-sm"
              >
                {{ interest }}
              </span>
            </div>
            
            <h4 class="font-medium mb-4">AI 匹配度分析</h4>
            <div v-for="match in currentMatch.matchAnalysis" :key="match.type" class="mb-4">
              <div class="mb-2 flex justify-between items-center">
                <span class="text-sm">{{ match.type }}</span>
                <span class="text-sm font-medium">{{ match.percentage }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  :style="{ width: match.percentage + '%' }"
                ></div>
              </div>
            </div>
            
            <button class="w-full btn-primary flex items-center justify-center">
              <span class="iconify mr-2" data-icon="mdi:message-text" data-inline="false"></span>
              发起聊天
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="w-1/3">
      <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h4 class="font-bold mb-4">今日匹配统计</h4>
<<<<<<< HEAD
        <!-- 修复：增加饼图容器的高度并添加内边距 -->
        <div ref="matchChart" style="width: 100%; height: 300px; padding-bottom: 20px;"></div>
=======
        <div ref="matchChart" style="width: 100%; height: 250px;"></div>
>>>>>>> 4298baf184477cd5bb16677130bd93ae66da9a2b
      </div>
      
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-bold">你可能喜欢</h4>
          <span class="text-xs text-primary-500 cursor-pointer">查看更多</span>
        </div>
        
        <div class="space-y-4">
          <div 
            v-for="suggestion in suggestions" 
            :key="suggestion.id"
            class="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <img 
              :src="suggestion.avatar" 
              :alt="suggestion.name" 
              class="w-12 h-12 rounded-full object-cover"
            >
            <div class="ml-3">
              <div class="font-medium">{{ suggestion.name }}</div>
              <div class="text-xs text-gray-500">{{ suggestion.job }} · {{ suggestion.age }}岁</div>
            </div>
            <span class="ml-auto text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
              匹配度 {{ suggestion.matchRate }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

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
  interests: ['摄影', '旅行', '阅读', '美食', '烹饪', '电影'],
  matchAnalysis: [
    { type: '兴趣相似度', percentage: 78 },
    { type: '性格匹配度', percentage: 85 },
    { type: '价值观一致性', percentage: 92 }
  ]
})

const suggestions = ref([
  {
    id: 1,
    name: '林小敏',
    job: '互联网运营',
    age: 27,
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,woman',
    matchRate: 89
  },
  {
    id: 2,
    name: '王佳怡',
    job: '教师',
    age: 25,
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,girl',
    matchRate: 76
  },
  {
    id: 3,
    name: '张美玲',
    job: '医生',
    age: 29,
    avatar: 'https://source.unsplash.com/random/100x100/?portrait,asian',
    matchRate: 82
  }
])

const matchChart = ref(null)
<<<<<<< HEAD
let chartInstance = null // 添加图表实例变量
=======
>>>>>>> 4298baf184477cd5bb16677130bd93ae66da9a2b

const swipeLeft = () => {
  cardClass.value = 'swipe-left'
  setTimeout(() => {
    cardClass.value = 'swipe-pending'
    // 这里可以加载下一个匹配对象
  }, 800)
}

const swipeRight = () => {
  cardClass.value = 'swipe-right'
  setTimeout(() => {
    cardClass.value = 'swipe-pending'
    // 这里可以加载下一个匹配对象
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

<<<<<<< HEAD
// 保留更新后的图表初始化函数
const initMatchChart = () => {
  if (!matchChart.value) return
  
  // 销毁已存在的图表实例，避免重复渲染
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  chartInstance = echarts.init(matchChart.value)
  
  // 设置图表配置，确保图例（颜色说明）正确显示在底部
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '0',
      left: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '匹配数据',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 42, name: '共同兴趣', itemStyle: { color: '#5e72e4' } },
          { value: 28, name: '性格匹配', itemStyle: { color: '#00cba9' } },
          { value: 16, name: '价值观', itemStyle: { color: '#11cdef' } },
          { value: 14, name: '其他', itemStyle: { color: '#fb6340' } }
        ]
      }
    ]
  }
  chartInstance.setOption(option)
}

// 在 onMounted 中确保图表正确渲染
onMounted(() => {
  nextTick(() => {
    initMatchChart()
    // 添加窗口调整事件监听，确保在窗口大小变化时重新调整图表大小
    window.addEventListener('resize', handleResize)
  })
})

// 添加清理函数
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}
</script>

<style scoped>
/* 修复：确保饼图容器有足够空间并避免与其他元素重叠 */
.bg-white.rounded-xl.p-6.shadow-sm.mb-6:first-of-type {
  overflow: visible;
  padding-bottom: 40px;
}
</style>
=======
const initMatchChart = () => {
  if (matchChart.value) {
    const chart = echarts.init(matchChart.value)
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '0',
        left: 'center',
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '匹配数据',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 42, name: '共同兴趣', itemStyle: { color: '#5e72e4' } },
            { value: 28, name: '性格匹配', itemStyle: { color: '#00cba9' } },
            { value: 16, name: '价值观', itemStyle: { color: '#11cdef' } },
            { value: 14, name: '其他', itemStyle: { color: '#fb6340' } }
          ]
        }
      ]
    }
    chart.setOption(option)
  }
}

onMounted(() => {
  nextTick(() => {
    initMatchChart()
  })
})
</script>
>>>>>>> 4298baf184477cd5bb16677130bd93ae66da9a2b
