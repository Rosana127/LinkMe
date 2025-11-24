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
          
          <!-- 活动通知列表（只用后端数据，字段映射一致） -->
          <div v-else class="notification-list p-2 space-y-1">
            <div v-if="filteredNotifications.length === 0" class="empty-notification">暂无通知</div>
            <div 
              v-for="n in filteredNotifications" 
              :key="n.notificationId"
              class="flex flex-col py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors notification-item"
              :class="{ unread: !n.isRead }"
            >
              <div class="flex items-center mb-1">
                <span class="notification-title font-bold text-white mr-2">{{ n.title }}</span>
                <span v-if="!n.isRead" class="w-2 h-2 bg-purple-500 rounded-full inline-block"></span>
              </div>
              <div class="notification-content text-sm text-gray-200 mb-1">{{ n.content }}</div>
              <div class="notification-time text-xs text-gray-400 mb-1">{{ formatTime(n.createdAt) }}</div>
              <div class="flex gap-2 mt-1">
                <button v-if="!n.isRead" @click="markAsRead(n.notificationId)" class="px-2 py-1 text-xs bg-purple-600 text-white rounded">标记为已读</button>
                <button @click="deleteNotification(n.notificationId)" class="px-2 py-1 text-xs bg-gray-700 text-white rounded">删除</button>
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
                :src="message.senderAvatar || selectedChat?.avatar" 
                :alt="message.senderNickname || selectedChat?.name" 
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
import { useAuthStore } from '@/stores/auth'
import * as chatApi from '@/api/chat'

const authStore = useAuthStore()
const searchQuery = ref('')
const selectedChatId = ref(null)
const newMessage = ref('')
const activeTab = ref('messages') // 'messages' 或 'notifications'
const messagesContainer = ref(null)

// 会话列表（从后端拉取）
const chats = ref([])


// 通知列表（从后端拉取）
const notifications = ref([])

// 拉取通知列表
async function loadNotifications() {
  try {
    const res = await chatApi.getNotifications()
      console.log('通知API返回', res)
    notifications.value = Array.isArray(res) ? res : (res?.data || [])
  } catch (e) {
    notifications.value = []
    console.error('加载通知失败', e)
  }
}

// 拉取未读通知数量
const unreadNotificationsCount = computed(() => notifications.value.filter(n => !n.isRead).length)

// 标记单条通知为已读
async function markAsRead(notificationId) {
  try {
    await chatApi.markNotificationRead(notificationId)
    await loadNotifications()
  } catch (e) {
    console.error('标记通知为已读失败', e)
  }
}

// 标记所有通知为已读
async function markAllAsRead() {
  try {
    await chatApi.markAllNotificationsRead()
    await loadNotifications()
  } catch (e) {
    console.error('全部标记为已读失败', e)
  }
}

// 删除通知
async function deleteNotification(notificationId) {
  try {
    await chatApi.deleteNotification(notificationId)
    await loadNotifications()
  } catch (e) {
    console.error('删除通知失败', e)
  }
}

// const unreadNotificationsCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredChats = computed(() => {
  if (!searchQuery.value) return chats.value
  const q = searchQuery.value.toLowerCase()
  return chats.value.filter(c => (c.name || '').toLowerCase().includes(q) || (c.lastMessage || '').toLowerCase().includes(q))
})

const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifications.value
  const q = searchQuery.value.toLowerCase()
  return notifications.value.filter(n =>
    (n.title || '').toLowerCase().includes(q) ||
    (n.content || '').toLowerCase().includes(q)
  )
})

const selectedChat = computed(() => chats.value.find(c => c.id === selectedChatId.value) || null)

function formatTime(ts) {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return d.toLocaleString()
  } catch (e) {
    return ts
  }
}

// AI 建议
const aiSuggestion = computed(() => {
  // 简单示例：基于最近一条消息的内容做固定建议，也可以替换为调用 AI 服务
  const last = selectedChat.value?.messages?.slice(-1)[0]
  if (!last) return '我很乐意！周六见。'
  // 如果对方问了问题，建议肯定/约定类回复
  if (/(吗|吗\?|\?|？|怎么样|怎样)/.test(last.content)) return '好的，我同意，我们周末见。'
  return '听起来不错！我也很期待。'
})

const aiTip = computed(() => {
  return '你们的对话进展很顺利！注意保持自然的交流节奏。'
})

// 将后端会话结构映射为前端展示结构
function mapConversationToChat(conv) {
  
  // Support backend ConversationResponse shape (conversationId, otherUserId, otherUserNickname, otherUserAvatar)
  const id = conv.conversationId ?? conv.id ?? conv.conversation_id
  const otherId = conv.otherUserId ?? (conv.other && (conv.other.id ?? conv.other.userId)) ?? null
  const name = conv.otherUserNickname ?? conv.other?.nickname ?? conv.name ?? `对话 ${id}`
  const avatar = conv.otherUserAvatar ?? conv.other?.avatarUrl ?? conv.other?.avatar ?? ''
  const lastMessage = conv.lastMessage ?? (conv.lastMessageObj && (conv.lastMessageObj.content || conv.lastMessageObj.text)) ?? ''
  const lastMessageTime = conv.lastMessageTime ?? conv.last_message_time ?? conv.updatedAt ?? conv.updated_at
  return {
    id,
    name,
    avatar,
    isOnline: !!conv.isOnline,
    lastMessage,
    lastMessageTime,
    unreadCount: conv.unreadCount ?? conv.unread_count ?? 0,
    messages: [],
    otherId
  }
}

async function loadConversations() {
  try {
    const res = await chatApi.getConversations()
    let arr
    if (Array.isArray(res)) arr = res
    else if (res && Array.isArray(res.data)) arr = res.data
    else arr = []
    chats.value = arr.map(mapConversationToChat)
    // 补全会话的参与者信息（如果后端 conversations 列表未包含），逐条请求详情并更新
    for (let i = 0; i < chats.value.length; i++) {
      const c = chats.value[i]
      if ((!c.name || c.name.startsWith('对话')) && c.id) {
        try {
          const detail = await chatApi.getConversation(c.id)
          const data = detail && detail.id ? detail : (detail?.data ? detail.data : detail)
          const participants = data.participants || data.users || []
          const other = (Array.isArray(participants) && participants.find(p => p.id !== authStore.userId)) || participants[0] || {}
          c.name = other.nickname || other.username || data.name || c.name
          c.avatar = other.avatarUrl || other.avatar || c.avatar
          c.otherId = other.id || other.userId || other.user_id || c.otherId
        } catch (err) {
          // ignore per-item failure
        }
      }
    }
    if (!selectedChatId.value && chats.value.length) {
      selectedChatId.value = chats.value[0].id
      await loadMessages(selectedChatId.value)
    }
  } catch (e) {
    console.error('加载会话失败', e)
    chats.value = []
  }
}

async function loadMessages(conversationId) {
  if (!conversationId) return
  try {
    const res = await chatApi.getMessages(conversationId)
    let arr
    if (Array.isArray(res)) arr = res
    else if (res && Array.isArray(res.data)) arr = res.data
    else arr = []
    // map to message objects used in模板
    const msgs = arr.map(m => ({
      id: m.messageId ?? m.message_id ?? m.id,
      content: m.content ?? m.text ?? m.body,
      time: formatTime(m.createdAt ?? m.created_at ?? m.time),
      isFromUser: (m.senderId ?? m.sender_id ?? m.from_user_id ?? m.userId) === authStore.userId,
      senderNickname: m.senderNickname ?? m.sender_nickname,
      senderAvatar: m.senderAvatar ?? m.sender_avatar
    }))
    const idx = chats.value.findIndex(c => c.id === conversationId)
    if (idx >= 0) {
      chats.value[idx].messages = msgs
      chats.value[idx].lastMessage = msgs.length ? msgs[msgs.length-1].content : chats.value[idx].lastMessage
      chats.value[idx].lastMessageTime = msgs.length ? msgs[msgs.length-1].time : chats.value[idx].lastMessageTime
    } else {
      // if conversation not present, push a minimal entry
      chats.value.push({ id: conversationId, name: `对话 ${conversationId}`, avatar: '', isOnline: false, lastMessage: '', lastMessageTime: '', unreadCount: 0, messages: msgs })
    }
    nextTick(() => scrollToBottom())
  } catch (e) {
    console.error('加载消息失败', e)
  }
}

const selectChat = async (chatId) => {
  selectedChatId.value = chatId
  await loadMessages(chatId)
}


const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return
  const content = newMessage.value.trim()
  const senderId = authStore.userId
  const receiverId = selectedChat.value.otherId // 对方用户ID
  const conversationId = selectedChat.value.id
  const payload = {
    senderId, // 当前用户ID
    receiverId, // 对方用户ID
    contentType: 'text', // 仅支持文本消息
    content
  }
  try {
    // 发送消息到后端
    await chatApi.postMessage(conversationId, payload)
    // 清空输入框
    newMessage.value = ''
    // 重新拉取消息列表，刷新 UI
    await loadMessages(conversationId)
    nextTick(() => scrollToBottom())
  } catch (e) {
    // 错误处理，提示用户
    window.$message?.error?.(e.message || '发送消息失败')
    console.error('发送消息失败', e)
  }
}

const useAISuggestion = () => { newMessage.value = '我很乐意！周六见。' }

const scrollToBottom = () => {
  if (messagesContainer.value) messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
}

watch(selectedChatId, () => { nextTick(() => scrollToBottom()) })

onMounted(() => {
  loadConversations()
  loadNotifications()
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
.notification-list {
  margin: 16px 0;
}
.notification-item {
  border-bottom: 1px solid #222;
  padding: 12px 0;
}
.notification-item.unread {
  background: #2d2250;
}
.notification-title {
  font-weight: bold;
}
.notification-content {
  margin-bottom: 4px;
}
.notification-time {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.empty-notification {
  color: #aaa;
  text-align: center;
  margin: 24px 0;
}
</style>
