<template>
  <div class="grid grid-cols-3 gap-6 h-full">
    <!-- 聊天列表 -->
    <div class="col-span-1 bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-700">
      <div class="p-4 border-b border-gray-700">
        <h3 class="font-bold text-white">消息中心</h3>
        <div class="relative mt-3">
          <input 
            type="text" 
            placeholder="搜索聊天..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
            v-model="searchQuery"
          >
          <span class="iconify absolute left-3 top-2 text-gray-400" data-icon="mdi:magnify" data-inline="false"></span>
        </div>
      </div>
      <div class="message-list p-2 space-y-1">
        <div 
          v-for="chat in filteredChats" 
          :key="chat.id"
          class="flex items-center py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
          :class="{ 'special-care': chat.id === selectedChatId }"
          @click="selectChat(chat.id)"
        >
          <div class="relative">
            <img 
              :src="chat.avatar" 
              :alt="chat.name" 
              class="w-12 h-12 rounded-full"
            >
            <span 
              v-if="chat.isOnline" 
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
            ></span>
          </div>
          <div class="ml-3 flex-1">
            <div class="flex justify-between">
              <h3 class="font-medium text-white">{{ chat.name }}</h3>
              <span class="text-xs text-gray-400">{{ chat.lastMessageTime }}</span>
            </div>
            <div class="flex items-center">
              <p class="text-xs text-gray-400 truncate mr-2">{{ chat.lastMessage }}</p>
              <span 
                v-if="chat.unreadCount > 0" 
                class="w-2 h-2 rounded-full bg-purple-500"
              ></span>
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
      
      <!-- 消息区域 -->
      <div class="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-800">
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
      <div class="p-4 border-t border-gray-700">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const selectedChatId = ref(1)
const newMessage = ref('')

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
        aiSuggestion: '试试这样回复："好啊！我周六下午有空，要不要在附近的咖啡店先见面?"'
      },
      {
        id: 4,
        content: '这个主意很棒！就约在那家新开的"云端咖啡"怎么样？周六下午1点？',
        time: '已读 11:32',
        isFromUser: true
      }
    ]
  },
  {
    id: 2,
    name: '王浩然',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg',
    isOnline: false,
    lastMessage: '我找到了你说过的那家甜品店！',
    lastMessageTime: '10:30',
    unreadCount: 0,
    messages: []
  },
  {
    id: 3,
    name: '张琳',
    avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg',
    isOnline: true,
    lastMessage: '展览的事情定下来了吗？',
    lastMessageTime: '昨天',
    unreadCount: 0,
    messages: []
  }
])

const aiTip = ref('张琳对艺术很感兴趣，这是你们的共同点。可以在见面时聊聊最近的艺术展览和个人收藏。')
const aiSuggestion = ref('好主意！期待周六和你见面 ☺️')

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  return chats.value.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const selectedChat = computed(() => {
  return chats.value.find(chat => chat.id === selectedChatId.value)
})

const selectChat = (chatId) => {
  selectedChatId.value = chatId
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const chat = chats.value.find(c => c.id === selectedChatId.value)
  if (chat) {
    chat.messages.push({
      id: Date.now(),
      content: newMessage.value,
      time: '刚刚',
      isFromUser: true
    })
    chat.lastMessage = newMessage.value
    chat.lastMessageTime = '刚刚'
    newMessage.value = ''
  }
}

const useAISuggestion = () => {
  newMessage.value = aiSuggestion.value
}

onMounted(() => {
  // 初始化聊天
})
</script>
