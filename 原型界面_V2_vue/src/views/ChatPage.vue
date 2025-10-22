<template>
  <div class="chat-page-container">
    <!-- 聊天列表和活动通知 -->
    <div class="grid grid-cols-3 gap-6 h-full">
      <!-- 聊天列表和活动通知 -->
      <div class="col-span-1 bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-700 flex flex-col">
        <!-- 标签页切换 -->
        <div class="flex border-b border-gray-700">
          <button 
            @click="activeTab = 'messages'"
            :class="['flex-1 py-3 text-center font-medium', activeTab === 'messages' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400']"
          >
            聊天
          </button>
          <button 
            @click="activeTab = 'notifications'"
            :class="['flex-1 py-3 text-center font-medium', activeTab === 'notifications' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400']"
          >
            通知
            <span v-if="unreadNotificationsCount > 0" class="ml-2 px-2 py-0.5 bg-purple-500 text-xs rounded-full">
              {{ unreadNotificationsCount }}
            </span>
          </button>
        </div>
        
        <!-- 搜索框 -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="font-bold text-white">{{ activeTab === 'messages' ? '消息中心' : '通知中心' }}</h3>
          <div class="relative mt-3">
            <input 
              type="text" 
              :placeholder="activeTab === 'messages' ? '搜索聊天...' : '搜索通知...'" 
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
              v-model="searchQuery"
            >
            <span class="iconify absolute left-3 top-2 text-gray-400" data-icon="mdi:magnify" data-inline="false"></span>
          </div>
        </div>
        
        <!-- 内容区域 - 根据标签页显示不同内容 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 聊天列表 -->
          <!-- 聊天列表部分的修改 -->
          <div v-if="activeTab === 'messages'" class="message-list p-2 space-y-1">
            <div 
              v-for="chat in filteredChats" 
              :key="chat.id"
              class="flex items-center py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
              :class="{ 'special-care': chat.id === selectedChatId }"
              @click="selectChat(chat.id)"
            >
              <!-- 头像部分添加固定宽度和z-index，确保不被消息挤占 -->
              <div class="relative flex-shrink-0">
                <img 
                  :src="chat.avatar" 
                  :alt="chat.name" 
                  class="w-12 h-12 rounded-full"
                >
                <span 
                  v-if="chat.isOnline" 
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"
                ></span>
              </div>
              <!-- 消息内容区域添加flex布局，确保文本正确截断 -->
              <div class="ml-3 flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium text-white truncate">{{ chat.name }}</h3>
                  <span class="text-xs text-gray-400 whitespace-nowrap">{{ chat.lastMessageTime }}</span>
                </div>
                <div class="flex items-center">
                  <p class="text-xs text-gray-400 truncate flex-1 mr-2">{{ chat.lastMessage }}</p>
                  <span 
                    v-if="chat.unreadCount > 0" 
                    class="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 活动通知列表 -->
          <div v-else class="notification-list p-2 space-y-1">
            <div 
              v-for="notification in filteredNotifications" 
              :key="notification.id"
              class="flex items-start py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
              :class="{ 'bg-gray-800/50': !notification.read }"
              @click="markAsRead(notification.id)"
            >
              <div class="relative">
                <img 
                  :src="notification.user.avatar" 
                  :alt="notification.user.name" 
                  class="w-10 h-10 rounded-full"
                >
                <span v-if="!notification.read" class="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm text-white">
                  <span class="font-medium">{{ notification.user.name }}</span>
                  {{ notification.action }}
                </p>
                <span class="text-xs text-gray-400 block mt-1">{{ notification.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 聊天界面 -->
      <div class="col-span-2 bg-gray-900 rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-700">
        <!-- 聊天头 -->
        <div class="flex items-center p-4 border-b border-gray-700 justify-between">
          <div class="flex items-center">
            <div class="relative">
              <img 
                :src="selectedChat?.avatar" 
                :alt="selectedChat?.name" 
                class="w-12 h-12 rounded-full"
              >
              <span 
                v-if="selectedChat?.isOnline" 
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"
              ></span>
            </div>
            <div class="ml-3">
              <div class="font-medium text-white">{{ selectedChat?.name }}</div>
              <div class="text-xs text-gray-400">{{ selectedChat?.isOnline ? '在线' : '离线' }}</div>
            </div>
          </div>
          <div class="flex space-x-4">
            <button class="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <span class="iconify text-xl text-gray-400" data-icon="mdi:video" data-inline="false"></span>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <span class="iconify text-xl text-gray-400" data-icon="mdi:phone" data-inline="false"></span>
            </button>
            <button class="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <span class="iconify text-xl text-gray-400" data-icon="mdi:dots-vertical" data-inline="false"></span>
            </button>
          </div>
        </div>
        
        <!-- 消息区域 - 添加ref属性 -->
        <div class="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-800" ref="messagesContainer">
          <div 
            v-for="message in selectedChat?.messages" 
            :key="message.id"
            class="flex"
            :class="message.isFromUser ? 'justify-end' : 'justify-start'"
          >
            <div class="flex items-end space-x-2" v-if="!message.isFromUser">
              <img 
                :src="selectedChat?.avatar" 
                :alt="selectedChat?.name" 
                class="w-8 h-8 rounded-full"
              >
              <div class="chat-bubble bg-gray-700 max-w-md">
                <div v-if="message.isAI" class="flex items-center mb-1">
                  <span class="iconify mr-1 text-purple-400" data-icon="mdi:robot" data-inline="false"></span>
                  <span class="text-xs font-medium text-purple-400">AI 推荐</span>
                </div>
                <div v-html="message.content" class="text-white"></div>
                <div v-if="message.aiSuggestion" class="ai-suggestion-bubble rounded-lg mt-3 py-2 px-3 text-sm bg-purple-900 text-purple-200">
                  <span class="ai-label">AI建议</span>
                  {{ message.aiSuggestion }}
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ message.time }}</div>
              </div>
            </div>
            <div v-else class="chat-bubble bg-purple-600 max-w-md">
              <div v-html="message.content" class="text-white"></div>
              <div class="text-xs text-gray-300 mt-1 text-right">{{ message.time }}</div>
            </div>
          </div>
          
          <!-- AI 情感助手提示 -->
          <div class="p-3 rounded-lg bg-gray-700 shadow-sm border border-gray-600 max-w-md mx-auto">
            <div class="flex items-center mb-2">
              <span class="iconify mr-2 text-purple-400" data-icon="mdi:lightbulb" data-inline="false"></span>
              <span class="text-sm font-medium text-white">AI 情感助手提示</span>
            </div>
            <p class="text-sm text-gray-300">{{ aiTip }}</p>
          </div>
        </div>
        
        <!-- 输入区域 -->
        <div class="p-4 border-t border-gray-700 bg-gray-800">
          <div class="ai-suggestion-bubble rounded-lg mb-3 px-4 py-3 bg-purple-900">
            <div class="flex justify-between items-center">
              <span class="text-sm flex-1 text-purple-200">尝试这样回复：{{ aiSuggestion }}</span>
              <button 
                @click="useAISuggestion"
                class="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                使用
              </button>
            </div>
          </div>
          <div class="flex items-center bg-gray-700 rounded-lg p-1">
            <button class="p-2 text-gray-400 hover:text-gray-300 transition-colors">
              <span class="iconify text-xl" data-icon="mdi:emoticon-outline" data-inline="false"></span>
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-300 transition-colors">
              <span class="iconify text-xl" data-icon="mdi:attachment" data-inline="false"></span>
            </button>
            <input 
              type="text" 
              placeholder="输入消息..." 
              class="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              v-model="newMessage"
              @keyup.enter="sendMessage"
            >
            <button 
              @click="sendMessage"
              class="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <span class="iconify text-xl" data-icon="mdi:send" data-inline="false"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

const searchQuery = ref('')
const selectedChatId = ref(1)
const newMessage = ref('')
const activeTab = ref('messages') // 'messages' 或 'notifications'
// 为消息容器添加引用
const messagesContainer = ref(null)

// 聊天数据
const chats = ref([
  {
    id: 1,
    name: '李思雨',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg',
    isOnline: true,
    lastMessage: '周末有空一起去喝咖啡吗？',
    lastMessageTime: '刚刚',
    unreadCount: 1,
    messages: [
      {
        id: 1,
        content: '这周末有空吗？我知道一个新开的展览馆',
        time: '11:26',
        isFromUser: false
      },
      {
        id: 2,
        content: '听起来不错！我对艺术展览很感兴趣',
        time: '已读 11:30',
        isFromUser: true
      },
      {
        id: 3,
        content: '展览主题是现代艺术，周六下午2点开始，我们可以一起喝咖啡然后去看看',
        time: '11:31',
        isFromUser: false,
        isAI: true,
        aiSuggestion: '太好了！我周六下午有空，我们可以先在附近的咖啡馆见面'
      },
      {
        id: 4,
        content: '太好了！我周六下午有空，我们可以先在附近的咖啡馆见面',
        time: '已读 11:32',
        isFromUser: true
      },
      {
        id: 5,
        content: '完美！那我们周六下午1:30在市中心的"星辰咖啡"见面，然后一起去展览馆？',
        time: '11:33',
        isFromUser: false
      },
      {
        id: 6,
        content: '没问题，我会准时到达！你需要我带什么吗？',
        time: '已读 11:34',
        isFromUser: true
      },
      {
        id: 7,
        content: '不用带什么，我们就是去看看展览，聊聊天。期待见到你！😊',
        time: '11:35',
        isFromUser: false
      },
      {
        id: 8,
        content: '我也很期待！周六见！',
        time: '已读 11:36',
        isFromUser: true
      },
      {
        id: 9,
        content: '对了，周末有空一起去喝咖啡吗？',
        time: '刚刚',
        isFromUser: false
      }
    ]
  },
  {
    id: 2,
    name: '王伟',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327749/aigp_1758963751.jpeg',
    isOnline: true,
    lastMessage: '下周一的会议准备好了吗？',
    lastMessageTime: '10分钟前',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        content: '嘿，王伟，下周一的会议准备好了吗？',
        time: '10:30',
        isFromUser: true
      },
      {
        id: 2,
        content: '是的，我已经准备好了PPT和会议材料',
        time: '10:32',
        isFromUser: false
      },
      {
        id: 3,
        content: '太好了！那我们明天再确认一下细节吧',
        time: '10:33',
        isFromUser: true
      },
      {
        id: 4,
        content: '好的，没问题',
        time: '10:34',
        isFromUser: false
      },
      {
        id: 5,
        content: '下周一的会议准备好了吗？',
        time: '10分钟前',
        isFromUser: false
      }
    ]
  },
  {
    id: 3,
    name: '赵雪',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg',
    isOnline: false,
    lastMessage: '谢谢你的帮忙！',
    lastMessageTime: '昨天',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        content: '嗨，赵雪，你上次提到的那本书叫什么名字？',
        time: '昨天 15:20',
        isFromUser: true
      },
      {
        id: 2,
        content: '哦，那本书叫《设计心理学》，非常推荐你看看！',
        time: '昨天 15:25',
        isFromUser: false
      },
      {
        id: 3,
        content: '好的，我会去看看的。谢谢你的推荐！',
        time: '昨天 15:30',
        isFromUser: true
      },
      {
        id: 4,
        content: '不客气，希望你会喜欢！',
        time: '昨天 15:32',
        isFromUser: false
      },
      {
        id: 5,
        content: '谢谢你的帮忙！',
        time: '昨天 15:35',
        isFromUser: true
      }
    ]
  }
])

// 通知数据
const notifications = ref([
  {
    id: 1,
    user: {
      name: '李思雨',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
    },
    action: '评论了你的动态',
    time: '1小时前',
    read: false
  },
  {
    id: 2,
    user: {
      name: '王伟',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327749/aigp_1758963751.jpeg'
    },
    action: '点赞了你的照片',
    time: '2小时前',
    read: false
  },
  {
    id: 3,
    user: {
      name: '赵雪',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
    },
    action: '关注了你',
    time: '昨天',
    read: true
  }
])

// 未读通知数量
const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(notification => !notification.read).length
})

// 过滤聊天列表
const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  const query = searchQuery.value.toLowerCase()
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(query) || 
    chat.lastMessage.toLowerCase().includes(query)
  )
})

// 过滤通知列表
const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifications.value
  const query = searchQuery.value.toLowerCase()
  return notifications.value.filter(notification => 
    notification.user.name.toLowerCase().includes(query) || 
    notification.action.toLowerCase().includes(query)
  )
})

// 当前选中的聊天
const selectedChat = computed(() => {
  return chats.value.find(chat => chat.id === selectedChatId.value)
})

// AI 建议
const aiSuggestion = computed(() => {
  // 这里可以根据上下文生成AI建议
  return '我很乐意！周六见。'
})

// AI 提示
const aiTip = computed(() => {
  // 这里可以根据聊天上下文生成AI提示
  return '你们的对话进展很顺利！注意保持自然的交流节奏。'
})

// 选择聊天
const selectChat = (chatId) => {
  selectedChatId.value = chatId
  // 选择聊天后滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 标记通知为已读
const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedChat.value) return
  
  const newMsg = {
    id: Date.now(),
    content: newMessage.value.trim(),
    time: '已读 ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isFromUser: true
  }
  
  // 添加新消息到当前聊天
  const chatIndex = chats.value.findIndex(c => c.id === selectedChatId.value)
  chats.value[chatIndex].messages.push(newMsg)
  chats.value[chatIndex].lastMessage = newMessage.value
  chats.value[chatIndex].lastMessageTime = '刚刚'
  
  // 清空输入框
  newMessage.value = ''
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 使用AI建议
const useAISuggestion = () => {
  newMessage.value = aiSuggestion.value
}

// 滚动到底部函数
const scrollToBottom = () => {
  // 确保消息容器已渲染
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听selectedChatId变化，切换聊天时滚动到底部
watch(selectedChatId, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// 组件挂载后滚动到底部
onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.chat-page-container {
  width: 100%;
  height: calc(100vh - 40px); /* 减去主内容区域的padding */
  display: flex;
  flex-direction: column;
}

/* 其他样式保持不变 */
</style>
