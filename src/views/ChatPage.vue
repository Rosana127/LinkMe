<template>
  <div class="chat-page-container">
    <!-- 聊天列表和活动通知 -->
    <div class="grid grid-cols-3 gap-6 h-full">
      <!-- 聊天列表和活动通知 -->
      <div
        class="col-span-1 bg-gray-900 rounded-xl shadow-sm overflow-hidden border border-gray-700 flex flex-col"
      >
        <!-- 标签页切换 -->
        <div class="flex border-b border-gray-700">
          <button
            @click="activeTab = 'messages'"
            :class="[
              'flex-1 py-3 text-center font-medium',
              activeTab === 'messages'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400',
            ]"
          >
            聊天
          </button>
          <button
            @click="activeTab = 'notifications'"
            :class="[
              'flex-1 py-3 text-center font-medium',
              activeTab === 'notifications'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400',
            ]"
          >
            通知
            <span
              v-if="unreadNotificationsCount > 0"
              class="ml-2 px-2 py-0.5 bg-purple-500 text-xs rounded-full"
            >
              {{ unreadNotificationsCount }}
            </span>
          </button>
        </div>

        <!-- 搜索框 -->
        <div class="p-4 border-b border-gray-700">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-white flex items-center gap-2">
              {{ activeTab === "messages" ? "消息中心" : "通知中心" }}
              <!-- WebSocket连接状态指示器 -->
              <span
                v-if="activeTab === 'messages'"
                :class="[
                  'inline-block w-2 h-2 rounded-full',
                  isWebSocketConnected ? 'bg-green-500' : 'bg-red-500'
                ]"
                :title="isWebSocketConnected ? 'WebSocket已连接（实时更新）' : 'WebSocket未连接'"
              ></span>
            </h3>
            <!-- 标记所有通知为已读按钮 -->
            <button
              v-if="
                activeTab === 'notifications' && unreadNotificationsCount > 0
              "
              @click="markAllAsRead"
              class="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center"
            >
              <span
                class="iconify mr-1"
                data-icon="mdi:check-all"
                data-inline="false"
              ></span>
              全部已读
            </button>
          </div>
          <div class="relative">
            <input
              type="text"
              :placeholder="
                activeTab === 'messages' ? '搜索聊天...' : '搜索通知...'
              "
              class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-purple-500"
              v-model="searchQuery"
            />
            <span
              class="iconify absolute left-3 top-2 text-gray-400"
              data-icon="mdi:magnify"
              data-inline="false"
            ></span>
          </div>
        </div>

        <!-- 内容区域 - 根据标签页显示不同内容 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 聊天列表 -->
          <!-- 聊天列表部分的修改 -->
          <div
            v-if="activeTab === 'messages'"
            class="message-list p-2 space-y-1"
          >
            <div
              v-for="chat in filteredChats"
              :key="chat.id"
              class="flex items-center py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
              :class="{ 
                'special-care': chat.id === selectedChatId,
                'bg-gray-800 bg-opacity-50': chat.isPinned
              }"
              @click="selectChat(chat.id)"
            >
              <!-- 头像部分添加固定宽度和z-index，确保不被消息挤占 -->
              <div class="relative flex-shrink-0">
                <img
                  :src="getAvatarUrl(chat.avatar, chat.name)"
                  :alt="chat.name"
                  class="w-12 h-12 rounded-full"
                  @error="handleAvatarError($event, chat.name)"
                />
                <span
                  v-if="chat.isOnline"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"
                ></span>
              </div>
              <!-- 消息内容区域添加flex布局，确保文本正确截断 -->
              <div class="ml-3 flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium text-white truncate">
                    {{ chat.name }}
                  </h3>
                  <span class="text-xs text-gray-400 whitespace-nowrap">{{
                    chat.lastMessageTime
                  }}</span>
                </div>
                <div class="flex items-center">
                  <p class="text-xs text-gray-400 truncate flex-1 mr-2">
                    {{ chat.lastMessage }}
                  </p>
                  <!-- 未读消息显示：免打扰时显示圆点，否则显示数字 -->
                  <span
                    v-if="chat.unreadCount && chat.unreadCount > 0"
                    :class="
                      chat.isMuted
                        ? 'w-2 h-2 rounded-full bg-purple-500'
                        : 'px-2 py-0.5 bg-purple-500 text-xs rounded-full text-white'
                    "
                    class="flex-shrink-0"
                  >
                    {{ chat.isMuted ? "" : chat.unreadCount }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 活动通知列表（只用后端数据，字段映射一致） -->
          <div v-else class="notification-list p-2 space-y-1">
            <div
              v-if="filteredNotifications.length === 0"
              class="empty-notification"
            >
              暂无通知
            </div>
            <div
              v-for="n in filteredNotifications"
              :key="n.notificationId"
              class="flex flex-col py-3 px-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors notification-item"
              :class="{ unread: !n.isRead }"
            >
              <div class="flex items-center mb-1">
                <span class="notification-title font-bold text-white mr-2">{{
                  n.title
                }}</span>
                <span
                  v-if="!n.isRead"
                  class="w-2 h-2 bg-purple-500 rounded-full inline-block"
                ></span>
              </div>
              <div class="notification-content text-sm text-gray-200 mb-1">
                {{ n.content }}
              </div>
              <div class="notification-time text-xs text-gray-400 mb-1">
                {{ formatTime(n.createdAt) }}
              </div>
              <div class="flex gap-2 mt-1">
                <button
                  v-if="!n.isRead"
                  @click="markAsRead(n.notificationId)"
                  class="px-2 py-1 text-xs bg-purple-600 text-white rounded"
                >
                  标记为已读
                </button>
                <button
                  @click="deleteNotification(n.notificationId)"
                  class="px-2 py-1 text-xs bg-gray-700 text-white rounded"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天界面 -->
      <div
        class="col-span-2 bg-gray-900 rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-700"
      >
        <!-- 聊天头 -->
        <div
          class="flex items-center p-4 border-b border-gray-700 justify-between"
        >
          <div class="flex items-center">
            <div class="relative">
              <img
                :src="getAvatarUrl(selectedChat?.avatar, selectedChat?.name)"
                :alt="selectedChat?.name"
                class="w-12 h-12 rounded-full"
                @error="handleAvatarError($event, selectedChat?.name)"
              />
              <span
                v-if="selectedChat?.isOnline"
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"
              ></span>
            </div>
            <div class="ml-3">
              <div class="font-medium text-white">{{ selectedChat?.name }}</div>
              <div class="text-xs text-gray-400">
                {{ selectedChat?.isOnline ? "在线" : "离线" }}
              </div>
            </div>
          </div>
          <div class="flex space-x-4">
            <button
              class="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <span
                class="iconify text-xl text-gray-400"
                data-icon="mdi:video"
                data-inline="false"
              ></span>
            </button>
            <button
              class="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <span
                class="iconify text-xl text-gray-400"
                data-icon="mdi:phone"
                data-inline="false"
              ></span>
            </button>
            <div class="relative">
              <button
                @click.stop="showOptionsMenu = !showOptionsMenu"
                class="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <span
                  class="iconify text-xl text-gray-400"
                  data-icon="mdi:dots-vertical"
                  data-inline="false"
                ></span>
              </button>
              <!-- 下拉菜单 -->
              <div
                v-if="showOptionsMenu"
                class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
                @click.stop
              >
                <button
                  @click="toggleFollow"
                  class="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white text-sm flex items-center"
                >
                  <span
                    class="iconify mr-2"
                    :data-icon="
                      isFollowing ? 'mdi:account-minus' : 'mdi:account-plus'
                    "
                    data-inline="false"
                  ></span>
                  {{ isFollowing ? "取消关注" : "关注" }}
                </button>
                <button
                  @click="toggleMute"
                  class="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white text-sm flex items-center"
                >
                  <span
                    class="iconify mr-2"
                    :data-icon="
                      selectedChat?.isMuted ? 'mdi:bell' : 'mdi:bell-off'
                    "
                    data-inline="false"
                  ></span>
                  {{ selectedChat?.isMuted ? "取消免打扰" : "消息免打扰" }}
                </button>
                <button
                  @click="togglePin"
                  class="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white text-sm flex items-center"
                >
                  <span
                    class="iconify mr-2"
                    :data-icon="
                      selectedChat?.isPinned ? 'mdi:pin-off' : 'mdi:pin'
                    "
                    data-inline="false"
                  ></span>
                  {{ selectedChat?.isPinned ? "取消置顶" : "置顶聊天" }}
                </button>
                <button
                  @click="blockMessages"
                  class="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-white text-sm flex items-center"
                >
                  <span
                    class="iconify mr-2"
                    :data-icon="
                      isBlocking ? 'mdi:account-check' : 'mdi:block-helper'
                    "
                    data-inline="false"
                  ></span>
                  {{ isBlocking ? "取消屏蔽" : "屏蔽消息" }}
                </button>
                <button
                  @click="clearChatHistory"
                  class="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors text-red-400 text-sm flex items-center rounded-b-lg"
                >
                  <span
                    class="iconify mr-2"
                    data-icon="mdi:delete-sweep"
                    data-inline="false"
                  ></span>
                  清空聊天记录
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 消息区域 - 添加ref属性 -->
        <div
          class="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-800"
          ref="messagesContainer"
        >
          <div
            v-for="message in selectedChat?.messages"
            :key="message.id"
            class="flex"
            :class="message.isFromUser ? 'justify-end' : 'justify-start'"
          >
            <div class="flex items-end space-x-2" v-if="!message.isFromUser">
              <img
                :src="
                  getAvatarUrl(
                    message.senderAvatar || selectedChat?.avatar,
                    message.senderNickname || selectedChat?.name
                  )
                "
                :alt="message.senderNickname || selectedChat?.name"
                class="w-8 h-8 rounded-full"
                @error="
                  handleAvatarError(
                    $event,
                    message.senderNickname || selectedChat?.name
                  )
                "
              />
              <div class="chat-bubble bg-gray-700 max-w-md">
                <div v-if="message.isAI" class="flex items-center mb-1">
                  <span
                    class="iconify mr-1 text-purple-400"
                    data-icon="mdi:robot"
                    data-inline="false"
                  ></span>
                  <span class="text-xs font-medium text-purple-400"
                    >AI 推荐</span
                  >
                </div>
                <div v-html="message.content" class="text-white"></div>
                <div
                  v-if="message.aiSuggestion"
                  class="ai-suggestion-bubble rounded-lg mt-3 py-2 px-3 text-sm bg-purple-900 text-purple-200"
                >
                  <span class="ai-label">AI建议</span>
                  {{ message.aiSuggestion }}
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ message.time }}</div>
              </div>
            </div>
            <div v-else class="chat-bubble bg-purple-600 max-w-md">
              <div v-html="message.content" class="text-white"></div>
              <div class="text-xs text-gray-300 mt-1 text-right">
                {{ message.time }}
              </div>
            </div>
          </div>

          <!-- AI 情感助手提示 -->
          <div
            class="p-3 rounded-lg bg-gray-700 shadow-sm border border-gray-600 max-w-md mx-auto"
          >
            <div class="flex items-center mb-2">
              <span
                class="iconify mr-2 text-purple-400"
                data-icon="mdi:lightbulb"
                data-inline="false"
              ></span>
              <span class="text-sm font-medium text-white"
                >AI 情感助手提示</span
              >
            </div>
            <p class="text-sm text-gray-300">{{ aiTip }}</p>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="p-4 border-t border-gray-700 bg-gray-800">
          <div
            class="ai-suggestion-bubble rounded-lg mb-3 px-4 py-3 bg-purple-900"
          >
            <div class="flex justify-between items-center">
              <span class="text-sm flex-1 text-purple-200"
                >尝试这样回复：{{ aiSuggestion }}</span
              >
              <button
                @click="useAISuggestion"
                class="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                使用
              </button>
            </div>
          </div>
          <div class="flex items-center bg-gray-700 rounded-lg p-1">
            <button
              class="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span
                class="iconify text-xl"
                data-icon="mdi:emoticon-outline"
                data-inline="false"
              ></span>
            </button>
            <button
              class="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span
                class="iconify text-xl"
                data-icon="mdi:attachment"
                data-inline="false"
              ></span>
            </button>
            <input
              type="text"
              placeholder="输入消息..."
              class="flex-1 px-3 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              v-model="newMessage"
              @keyup.enter="sendMessage"
            />
            <button
              @click="sendMessage"
              class="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <span
                class="iconify text-xl"
                data-icon="mdi:send"
                data-inline="false"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import * as chatApi from "@/api/chat";
import * as userApi from "@/api/user";

// ========== 模块级 WebSocket 单例管理 ==========
// 将 WebSocket 放在模块级别，避免 HMR 时创建多个实例
const wsState = {
  instance: null,
  reconnectTimer: null,
  reconnectAttempts: 0,
  isIntentionalClose: false,
  messageHandlers: new Set(),  // 消息处理器集合
  connectionId: 0  // 用于追踪连接
};

// HMR 清理 - 确保热更新时不会重复创建连接
if (import.meta.hot) {
  import.meta.hot.accept();
  // 保存 WebSocket 状态到 HMR 数据中
  import.meta.hot.data.wsState = import.meta.hot.data.wsState || wsState;
  // 恢复之前的状态
  Object.assign(wsState, import.meta.hot.data.wsState);
}

const route = useRoute();
const authStore = useAuthStore();
const searchQuery = ref("");
const selectedChatId = ref(null);
const newMessage = ref("");
const activeTab = ref("messages"); // 'messages' 或 'notifications'
const messagesContainer = ref(null);
const showOptionsMenu = ref(false); // 控制下拉菜单显示
const isFollowing = ref(false); // 当前是否已关注对方
const isBlocking = ref(false); // 当前是否已屏蔽对方

// WebSocket连接状态（响应式）
const isWebSocketConnected = ref(false);
const MAX_RECONNECT_ATTEMPTS = 5;  // 最大重连次数

// 生成文字头像（显示用户名字前两个字）
function generateTextAvatar(name) {
  if (!name) return null;

  // 获取名字前两个字
  const text = name.length >= 2 ? name.substring(0, 2) : name.substring(0, 1);

  // 创建 canvas 生成头像
  const canvas = document.createElement("canvas");
  canvas.width = 80;
  canvas.height = 80;
  const ctx = canvas.getContext("2d");

  // 生成随机背景色（基于名字的哈希值）
  const colors = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#6366f1",
  ];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgColor = colors[hash % colors.length];

  // 绘制背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制文字
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas.toDataURL();
}

// 获取头像 URL（优先使用真实头像，否则生成文字头像）
function getAvatarUrl(avatar, name) {
  if (avatar && avatar.trim() !== "") {
    return avatar;
  }

  // 如果没有头像，生成文字头像
  if (name) {
    return generateTextAvatar(name) || "";
  }

  return "";
}

// 处理头像加载错误
function handleAvatarError(event, name) {
  // 如果头像加载失败，生成文字头像
  if (name) {
    const textAvatar = generateTextAvatar(name);
    if (textAvatar) {
      event.target.src = textAvatar;
    }
  }
}

// 会话列表（从后端拉取）
const chats = ref([]);

// 通知列表（从后端拉取）
const notifications = ref([]);

// 拉取通知列表
async function loadNotifications() {
  try {
    const res = await chatApi.getNotifications();
    console.log("通知API返回", res);
    notifications.value = Array.isArray(res) ? res : res?.data || [];
  } catch (e) {
    notifications.value = [];
    console.error("加载通知失败", e);
  }
}

// 拉取未读通知数量
const unreadNotificationsCount = computed(
  () => notifications.value.filter((n) => !n.isRead).length
);

// 标记单条通知为已读
async function markAsRead(notificationId) {
  try {
    await chatApi.markNotificationRead(notificationId);
    await loadNotifications();
  } catch (e) {
    console.error("标记通知为已读失败", e);
  }
}

// 标记所有通知为已读
async function markAllAsRead() {
  try {
    await chatApi.markAllNotificationsRead();
    await loadNotifications();
  } catch (e) {
    console.error("全部标记为已读失败", e);
  }
}

// 删除通知
async function deleteNotification(notificationId) {
  try {
    await chatApi.deleteNotification(notificationId);
    await loadNotifications();
  } catch (e) {
    console.error("删除通知失败", e);
  }
}

// const unreadNotificationsCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredChats = computed(() => {
  let result = chats.value;
  
  // 1. 搜索过滤
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.lastMessage || "").toLowerCase().includes(q)
    );
  }

  // 2. 排序：置顶优先，然后按时间倒序
  return [...result].sort((a, b) => {
    // 置顶判断
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // 时间判断
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return timeB - timeA;
  });
});

const filteredNotifications = computed(() => {
  if (!searchQuery.value) return notifications.value;
  const q = searchQuery.value.toLowerCase();
  return notifications.value.filter(
    (n) =>
      (n.title || "").toLowerCase().includes(q) ||
      (n.content || "").toLowerCase().includes(q)
  );
});

const selectedChat = computed(
  () => chats.value.find((c) => c.id === selectedChatId.value) || null
);

function formatTime(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch (e) {
    return ts;
  }
}

// AI 建议
const aiSuggestion = computed(() => {
  // 简单示例：基于最近一条消息的内容做固定建议，也可以替换为调用 AI 服务
  const last = selectedChat.value?.messages?.slice(-1)[0];
  if (!last) return "我很乐意！周六见。";
  // 如果对方问了问题，建议肯定/约定类回复
  if (/(吗|吗\?|\?|？|怎么样|怎样)/.test(last.content))
    return "好的，我同意，我们周末见。";
  return "听起来不错！我也很期待。";
});

const aiTip = computed(() => {
  return "你们的对话进展很顺利！注意保持自然的交流节奏。";
});

// 将后端会话结构映射为前端展示结构
function mapConversationToChat(conv) {
  // Support backend ConversationResponse shape (conversationId, otherUserId, otherUserNickname, otherUserAvatar)
  const id = conv.conversationId ?? conv.id ?? conv.conversation_id;
  const otherId =
    conv.otherUserId ??
    (conv.other &&
      (conv.other.id ?? conv.other.userId ?? conv.other.user_id)) ??
    null;
  const name =
    conv.otherUserNickname ?? conv.other?.nickname ?? conv.name ?? `对话 ${id}`;
  const avatar =
    conv.otherUserAvatar ?? conv.other?.avatarUrl ?? conv.other?.avatar ?? "";
  const lastMessage =
    conv.lastMessage ??
    (conv.lastMessageObj &&
      (conv.lastMessageObj.content || conv.lastMessageObj.text)) ??
    "";
  const lastMessageTime =
    conv.lastMessageTime ??
    conv.last_message_time ??
    conv.updatedAt ??
    conv.updated_at;
  return {
    id,
    name,
    avatar,
    isOnline: !!conv.isOnline,
    lastMessage,
    lastMessageTime,
    unreadCount: conv.unreadCount ?? conv.unread_count ?? 0,
    messages: [],
    otherId,
    isMuted: conv.isMuted ?? false,
    isPinned: conv.isPinned ?? false,
  };
}

async function loadConversations() {
  try {
    const res = await chatApi.getConversations();
    let arr;
    if (Array.isArray(res)) arr = res;
    else if (res && Array.isArray(res.data)) arr = res.data;
    else arr = [];
    chats.value = arr.map(mapConversationToChat);
    // 补全会话的参与者信息（如果后端 conversations 列表未包含），逐条请求详情并更新
    for (let i = 0; i < chats.value.length; i++) {
      const c = chats.value[i];
      if ((!c.name || c.name.startsWith("对话")) && c.id) {
        try {
          const detail = await chatApi.getConversation(c.id);
          const data =
            detail && detail.id ? detail : detail?.data ? detail.data : detail;
          const participants = data.participants || data.users || [];
          const other =
            (Array.isArray(participants) &&
              participants.find((p) => p.id !== authStore.userId)) ||
            participants[0] ||
            {};
          c.name = other.nickname || other.username || data.name || c.name;
          c.avatar = other.avatarUrl || other.avatar || c.avatar;
          c.otherId = other.id || other.userId || other.user_id || c.otherId;
        } catch (err) {
          // ignore per-item failure
        }
      }
    }
    // 只有在没有路由参数指定用户时才自动选择第一个聊天
    const routeUserId = route.params.userId;
    if (!selectedChatId.value && chats.value.length && !routeUserId) {
      selectedChatId.value = chats.value[0].id;
      await loadMessages(selectedChatId.value);
      // 检查关注状态
      await checkFollowStatus();
    }
    // 排序：置顶的在前
    // sortChats();
  } catch (e) {
    console.error("加载会话失败", e);
    chats.value = [];
  }
}

async function loadMessages(conversationId) {
  if (!conversationId) return;
  try {
    console.log("开始加载消息，会话ID:", conversationId);
    const res = await chatApi.getMessages(conversationId);
    console.log("从后端获取的原始消息数据:", res);
    let arr;
    if (Array.isArray(res)) arr = res;
    else if (res && Array.isArray(res.data)) arr = res.data;
    else arr = [];
    console.log("提取的消息数组:", arr);
    // map to message objects used in模板
    const msgs = arr.map((m) => ({
      id: m.messageId ?? m.message_id ?? m.id,
      content: m.content ?? m.text ?? m.body,
      time: formatTime(m.createdAt ?? m.created_at ?? m.time),
      isFromUser:
        (m.senderId ?? m.sender_id ?? m.from_user_id ?? m.userId) ===
        authStore.userId,
      senderNickname: m.senderNickname ?? m.sender_nickname,
      senderAvatar: m.senderAvatar ?? m.sender_avatar,
    }));
    console.log("映射后的消息数组:", msgs);
    const idx = chats.value.findIndex((c) => c.id === conversationId);
    console.log("找到的会话索引:", idx);
    if (idx >= 0) {
      chats.value[idx].messages = msgs;
      chats.value[idx].lastMessage = msgs.length
        ? msgs[msgs.length - 1].content
        : chats.value[idx].lastMessage;
      chats.value[idx].lastMessageTime = msgs.length
        ? msgs[msgs.length - 1].time
        : chats.value[idx].lastMessageTime;
      console.log("更新后的会话消息:", chats.value[idx].messages);
    } else {
      // if conversation not present, push a minimal entry
      chats.value.push({
        id: conversationId,
        name: `对话 ${conversationId}`,
        avatar: "",
        isOnline: false,
        lastMessage: "",
        lastMessageTime: "",
        unreadCount: 0,
        messages: msgs,
      });
      console.log("新添加的会话:", chats.value[chats.value.length - 1]);
    }
    nextTick(() => scrollToBottom());
  } catch (e) {
    console.error("加载消息失败", e);
  }
}

const selectChat = async (chatId) => {
  selectedChatId.value = chatId;
  await loadMessages(chatId);

  // Mark messages as read when opening a chat
  if (chatId) {
    try {
      await chatApi.markRead(chatId);
      // Update the unreadCount for this chat in the local state
      const idx = chats.value.findIndex((c) => c.id === chatId);
      if (idx >= 0) {
        chats.value[idx].unreadCount = 0;
      }
    } catch (e) {
      // 如果是404或400错误，可能是会话不存在或用户无权限，这是正常的（比如会话刚被删除）
      // 只记录错误，不中断流程
      const errorMessage = e.message || "";
      if (
        errorMessage.includes("不存在") ||
        errorMessage.includes("无权限") ||
        e.status === 404 ||
        e.status === 400
      ) {
        console.warn(
          "标记消息为已读失败（会话可能不存在或无权限）:",
          chatId,
          e.message
        );
      } else {
        console.error("标记消息为已读失败:", e);
      }
    }
  }

  // 检查是否关注对方
  await checkFollowStatus();
};

// 根据 userId 创建或选择聊天
const createOrSelectChatByUserId = async (userId) => {
  if (!userId) {
    console.log("createOrSelectChatByUserId: userId 为空");
    return;
  }

  const targetUserId = typeof userId === "string" ? parseInt(userId) : userId;
  if (isNaN(targetUserId)) {
    console.error("无效的用户ID:", userId);
    return;
  }

  console.log(
    "createOrSelectChatByUserId: 开始处理，目标用户ID:",
    targetUserId,
    "当前聊天列表数量:",
    chats.value.length
  );

  // 先检查是否已存在与该用户的聊天
  const existingChat = chats.value.find((chat) => {
    const otherId = chat.otherId || chat.otherUserId;
    const match =
      otherId === targetUserId ||
      otherId === userId ||
      String(otherId) === String(targetUserId) ||
      String(otherId) === String(userId);
    if (match) {
      console.log("找到已存在的聊天:", {
        chatId: chat.id,
        otherId,
        targetUserId,
      });
    }
    return match;
  });

  if (existingChat) {
    // 如果已存在，直接选择该聊天
    console.log(
      "找到已存在的聊天，ID:",
      existingChat.id,
      "otherId:",
      existingChat.otherId
    );
    await selectChat(existingChat.id);
    return;
  }

  // 如果不存在，创建新聊天
  try {
    console.log("创建新聊天，目标用户ID:", targetUserId);
    // 后端期望的字段是 userId，不是 otherUserId
    const payload = { userId: targetUserId };
    console.log("发送创建聊天请求，payload:", payload);

    const response = await chatApi.createConversation(payload);
    console.log("创建聊天响应:", response);
    console.log(
      "响应类型:",
      typeof response,
      "是否为数组:",
      Array.isArray(response)
    );

    // 处理不同的响应格式
    let conversationId = null;
    let conversationData = null;

    if (response) {
      // 如果 response 本身就是 ConversationResponse 对象
      if (response.conversationId) {
        conversationId = response.conversationId;
        conversationData = response;
      } else if (response.id) {
        conversationId = response.id;
        conversationData = response;
      } else if (response.data) {
        // 如果 response 有 data 字段（统一响应格式 R<T>）
        const data = response.data;
        conversationId = data.conversationId || data.id || data.conversation_id;
        conversationData = data;
      }
    }

    console.log("解析得到的会话ID:", conversationId);
    console.log("会话数据:", conversationData);

    if (conversationId) {
      // 如果响应中包含了完整的会话数据，直接添加到聊天列表
      if (conversationData) {
        const newChat = mapConversationToChat(conversationData);
        console.log("映射后的新聊天对象:", newChat);

        // 检查是否已存在（避免重复）
        const exists = chats.value.find((c) => c.id === newChat.id);
        if (!exists) {
          chats.value.push(newChat);
          console.log("新聊天已添加到列表");
        }

        // 选择新创建的聊天
        await selectChat(newChat.id);
      } else {
        // 如果只有ID，重新加载会话列表
        console.log("重新加载会话列表...");
        await loadConversations();
        console.log("会话列表重新加载完成，当前聊天数量:", chats.value.length);

        // 查找新创建的聊天并选择它
        const newChat = chats.value.find((chat) => {
          const chatId = chat.id || chat.conversationId;
          const otherId = chat.otherId || chat.otherUserId;
          const match =
            chatId === conversationId ||
            otherId === targetUserId ||
            otherId === userId ||
            String(otherId) === String(targetUserId);
          if (match) {
            console.log("找到新创建的聊天:", {
              chatId,
              conversationId,
              otherId,
              targetUserId,
            });
          }
          return match;
        });

        if (newChat) {
          console.log("选择新创建的聊天，ID:", newChat.id);
          await selectChat(newChat.id);
        } else {
          // 如果找不到，直接使用 conversationId
          console.log(
            "未在列表中找到，直接使用 conversationId:",
            conversationId
          );
          await selectChat(conversationId);
        }
      }
    } else {
      console.error(
        "创建聊天失败：未返回会话ID，完整响应:",
        JSON.stringify(response, null, 2)
      );
    }
  } catch (error) {
    console.error("创建聊天失败:", error);
    console.error("错误详情:", error.response || error.message || error);
    // 如果创建失败，尝试重新加载会话列表，可能聊天已经存在
    await loadConversations();
    const existingChatAfterReload = chats.value.find((chat) => {
      const otherId = chat.otherId || chat.otherUserId;
      return (
        otherId === targetUserId ||
        otherId === userId ||
        String(otherId) === String(targetUserId)
      );
    });
    if (existingChatAfterReload) {
      console.log("重新加载后找到已存在的聊天:", existingChatAfterReload.id);
      await selectChat(existingChatAfterReload.id);
    } else {
      console.error("创建聊天失败，且重新加载后仍未找到对应的聊天");
    }
  }
};

// 检查关注状态
const checkFollowStatus = async () => {
  if (!selectedChat.value?.otherId) return;
  try {
    const res = await userApi.checkFollowing(selectedChat.value.otherId);
    isFollowing.value = res?.data?.isFollowing || res?.isFollowing || false;

    // 同时检查屏蔽状态
    const blockRes = await userApi.checkBlocking(selectedChat.value.otherId);
    isBlocking.value =
      blockRes?.data?.isBlocking || blockRes?.isBlocking || false;
  } catch (e) {
    console.error("检查关注/屏蔽状态失败", e);
    isFollowing.value = false;
    isBlocking.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChat.value) return;
  const content = newMessage.value.trim();
  const receiverId = selectedChat.value.otherId; // 对方用户ID
  const conversationId = selectedChat.value.id;
  const payload = {
    receiverId, // 对方用户ID
    contentType: "text", // 仅支持文本消息
    content,
  };

  // 创建临时消息对象，立即显示在聊天界面
  const tempMessage = {
    id: Date.now(), // 使用时间戳作为临时ID
    content: content,
    time: formatTime(new Date()),
    isFromUser: true,
    senderNickname: authStore.user?.nickname || authStore.user?.username,
    senderAvatar: authStore.user?.avatarUrl,
    isMine: true,
    timestamp: new Date().toISOString(),
  };

  // 将临时消息添加到前端消息列表
  const chatIdx = chats.value.findIndex((c) => c.id === conversationId);
  if (chatIdx >= 0) {
    chats.value[chatIdx].messages.push(tempMessage);
    chats.value[chatIdx].lastMessage = content;
    chats.value[chatIdx].lastMessageTime = tempMessage.time;
  }

  // 滚动到底部显示新消息
  nextTick(() => scrollToBottom());

  // 清空输入框
  newMessage.value = "";

  try {
    // 发送消息到后端
    await chatApi.postMessage(conversationId, payload);
    console.log("消息发送成功，WebSocket将自动推送给对方");
    
    // 不需要重新加载消息列表，WebSocket会自动处理
    // 如果需要确认消息ID等信息，可以选择性地重新加载
    // await loadMessages(conversationId);
  } catch (e) {
    // 错误处理，提示用户
    console.error("发送消息失败", e);
    alert(e.message || "发送消息失败");

    // 如果发送失败，从前端消息列表中移除临时消息
    if (chatIdx >= 0) {
      chats.value[chatIdx].messages = chats.value[chatIdx].messages.filter(
        (m) => m.id !== tempMessage.id
      );
      // 更新最后一条消息和时间
      if (chats.value[chatIdx].messages.length > 0) {
        const lastMsg =
          chats.value[chatIdx].messages[
            chats.value[chatIdx].messages.length - 1
          ];
        chats.value[chatIdx].lastMessage = lastMsg.content;
        chats.value[chatIdx].lastMessageTime = lastMsg.time;
      } else {
        chats.value[chatIdx].lastMessage = "";
        chats.value[chatIdx].lastMessageTime = "";
      }
    }
  }
};

const useAISuggestion = () => {
  newMessage.value = "我很乐意！周六见。";
};

// 切换关注状态
const toggleFollow = async () => {
  if (!selectedChat.value?.otherId) return;
  try {
    if (isFollowing.value) {
      await userApi.unfollowUser(selectedChat.value.otherId);
      isFollowing.value = false;
      console.log("取消关注成功");
    } else {
      await userApi.followUser(selectedChat.value.otherId);
      isFollowing.value = true;
      console.log("关注成功");
    }
    showOptionsMenu.value = false;
  } catch (e) {
    console.error("关注操作失败", e);
  }
};

// 消息免打扰
const toggleMute = async () => {
  if (!selectedChat.value) return;
  try {
    const newMutedStatus = !selectedChat.value.isMuted;
    await chatApi.setMuteStatus(selectedChat.value.id, newMutedStatus);
    // 更新本地状态
    selectedChat.value.isMuted = newMutedStatus;
    const chatInList = chats.value.find((c) => c.id === selectedChat.value.id);
    if (chatInList) {
      chatInList.isMuted = newMutedStatus;
    }
    showOptionsMenu.value = false;
    
    // 自动刷新会话列表以保持同步
    console.log(`消息免打扰状态已更新为: ${newMutedStatus}`);
  } catch (e) {
    console.error("设置免打扰失败", e);
    alert("设置免打扰失败");
  }
};

// 置顶聊天
const togglePin = async () => {
  if (!selectedChat.value) return;
  try {
    const newPinnedStatus = !selectedChat.value.isPinned;
    await chatApi.setPinStatus(selectedChat.value.id, newPinnedStatus);
    // 更新本地状态
    selectedChat.value.isPinned = newPinnedStatus;
    const chatInList = chats.value.find((c) => c.id === selectedChat.value.id);
    if (chatInList) {
      chatInList.isPinned = newPinnedStatus;
    }
    // 重新排序聊天列表：置顶的在前
    // sortChats();
    showOptionsMenu.value = false;
    
    console.log(`置顶状态已更新为: ${newPinnedStatus}，列表已重新排序`);
  } catch (e) {
    console.error("设置置顶失败", e);
    alert("设置置顶失败");
  }
};


// 屏蔽消息
const blockMessages = async () => {
  if (!selectedChat.value?.otherId) return;

  const action = isBlocking.value ? "取消屏蔽" : "屏蔽";
  const confirmMsg = isBlocking.value
    ? "确定要取消屏蔽此用户吗？"
    : "确定要屏蔽此用户的消息吗？";

  if (confirm(confirmMsg)) {
    try {
      if (isBlocking.value) {
        await userApi.unblockUser(selectedChat.value.otherId);
        isBlocking.value = false;
      } else {
        await userApi.blockUser(selectedChat.value.otherId);
        isBlocking.value = true;
      }
      showOptionsMenu.value = false;
    } catch (e) {
      console.error(`${action}失败`, e);
    }
  }
};

// 清空聊天记录
const clearChatHistory = async () => {
  if (confirm("确定要清空此聊天的所有记录吗？此操作不可恢复！")) {
    if (selectedChat.value) {
      try {
        await chatApi.clearChatMessages(selectedChat.value.id);
        // 清空成功后，清空前端显示的消息列表和最后一条消息
        selectedChat.value.messages = [];
        selectedChat.value.lastMessage = "";
        selectedChat.value.lastMessageTime = null;

        // 同时更新会话列表中的对应项
        const chatIndex = chats.value.findIndex(
          (c) => c.id === selectedChat.value.id
        );
        if (chatIndex !== -1) {
          chats.value[chatIndex].lastMessage = "";
          chats.value[chatIndex].lastMessageTime = null;
        }

        console.log("聊天记录已清空，界面已自动更新");
      } catch (error) {
        console.error("清空聊天记录失败:", error);
        alert("清空聊天记录失败，请重试");
      }
    }
    showOptionsMenu.value = false;
  }
};

// 点击页面其他地方关闭下拉菜单
const closeOptionsMenu = () => {
  showOptionsMenu.value = false;
};

const scrollToBottom = () => {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
};

watch(selectedChatId, () => {
  nextTick(() => scrollToBottom());
});

// 当前组件实例的消息处理器
let currentMessageHandler = null;

// 初始化WebSocket连接（模块级单例）
const initWebSocket = () => {
  // 清除之前的重连定时器
  if (wsState.reconnectTimer) {
    clearTimeout(wsState.reconnectTimer);
    wsState.reconnectTimer = null;
  }
  
  // 如果已经有连接且是打开状态，只需注册消息处理器
  if (wsState.instance && wsState.instance.readyState === WebSocket.OPEN) {
    console.log("✅ WebSocket已连接，复用现有连接");
    isWebSocketConnected.value = true;
    return;
  }
  
  // 如果连接正在建立中，等待
  if (wsState.instance && wsState.instance.readyState === WebSocket.CONNECTING) {
    console.log("⏳ WebSocket正在连接中，等待...");
    return;
  }
  
  // 如果有旧连接但状态不是打开，先关闭
  if (wsState.instance) {
    wsState.isIntentionalClose = true;
    try {
      wsState.instance.close();
    } catch (e) {
      console.log("关闭旧WebSocket连接:", e);
    }
    wsState.instance = null;
  }

  const token = authStore.token;
  if (!token) {
    console.error("未找到token，无法建立WebSocket连接");
    return;
  }

  // 增加连接ID用于追踪
  const connectionId = ++wsState.connectionId;
  
  // WebSocket服务器地址
  const wsUrl = `ws://localhost:8080/ws/chat?token=${token}`;
  console.log(`[连接#${connectionId}] 正在建立WebSocket连接...`);

  try {
    wsState.isIntentionalClose = false;
    wsState.instance = new WebSocket(wsUrl);

    wsState.instance.onopen = () => {
      // 检查是否是最新的连接
      if (connectionId !== wsState.connectionId) {
        console.log(`[连接#${connectionId}] 不是最新连接，忽略`);
        return;
      }
      console.log(`[连接#${connectionId}] ✅ WebSocket连接成功`);
      isWebSocketConnected.value = true;
      wsState.reconnectAttempts = 0;  // 重置重连次数
    };

    wsState.instance.onmessage = (event) => {
      // 检查是否是最新的连接
      if (connectionId !== wsState.connectionId) {
        return;
      }
      console.log("收到WebSocket消息:", event.data);
      try {
        const message = JSON.parse(event.data);
        // 调用所有注册的消息处理器
        wsState.messageHandlers.forEach(handler => {
          try {
            handler(message);
          } catch (e) {
            console.error("消息处理器错误:", e);
          }
        });
      } catch (error) {
        console.error("解析WebSocket消息失败:", error);
      }
    };

    wsState.instance.onerror = (error) => {
      if (connectionId !== wsState.connectionId) return;
      console.error(`[连接#${connectionId}] WebSocket错误:`, error);
      isWebSocketConnected.value = false;
    };

    wsState.instance.onclose = (event) => {
      // 检查是否是最新的连接
      if (connectionId !== wsState.connectionId) {
        console.log(`[连接#${connectionId}] 旧连接关闭，忽略`);
        return;
      }
      
      console.log(`[连接#${connectionId}] WebSocket连接关闭, code:`, event.code, "reason:", event.reason);
      isWebSocketConnected.value = false;
      wsState.instance = null;
      
      // 如果是主动关闭，不重连
      if (wsState.isIntentionalClose) {
        console.log("主动关闭，不进行重连");
        return;
      }
      
      // code 1000 表示正常关闭（通常是后端踢掉旧连接），稍后重连
      // 检查是否超过最大重连次数
      if (wsState.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log("已达到最大重连次数，停止重连");
        return;
      }
      
      // 指数退避重连，但如果是被踢掉（code 1000），延迟稍长一些
      const baseDelay = event.code === 1000 ? 3000 : 5000;
      const delay = Math.min(baseDelay * Math.pow(1.5, wsState.reconnectAttempts), 30000);
      wsState.reconnectAttempts++;
      
      console.log(`${delay/1000}秒后尝试第${wsState.reconnectAttempts}次重连...`);
      wsState.reconnectTimer = setTimeout(() => {
        if (authStore.token && wsState.messageHandlers.size > 0) {
          initWebSocket();
        }
      }, delay);
    };
  } catch (error) {
    console.error("创建WebSocket连接失败:", error);
  }
};

// 处理WebSocket消息
const handleWebSocketMessage = async (message) => {
  console.log("处理WebSocket消息:", message);

  // 判断消息类型：
  // 1. 如果有type字段且为chat/message，则是聊天消息
  // 2. 如果有conversationId和content字段（即使没有type），也当作聊天消息
  const isChatMessage = 
    (message.type === "chat" || message.type === "message") ||
    (message.conversationId && message.content !== undefined);

  if (isChatMessage) {
    const { conversationId, senderId, content, contentType, createdAt, senderNickname, senderAvatar, messageId } = message;
    
    console.log("✅ 收到聊天消息:", { conversationId, senderId, content });
    console.log("📋 当前会话列表:", chats.value.map(c => ({ id: c.id, name: c.name })));
    console.log("🔍 当前用户ID:", authStore.userId, "类型:", typeof authStore.userId);
    console.log("🔍 消息发送者ID:", senderId, "类型:", typeof senderId);

    // 查找对应的会话（会话对象的id字段对应conversationId）
    // 注意：需要转换类型进行比较，因为可能一个是数字一个是字符串
    const chatIndex = chats.value.findIndex(
      (chat) => String(chat.id) === String(conversationId)
    );
    
    console.log("🔍 查找会话结果: conversationId=", conversationId, "chatIndex=", chatIndex);

    if (chatIndex !== -1) {
      // 更新会话的最后一条消息
      chats.value[chatIndex].lastMessage = content;
      chats.value[chatIndex].lastMessageTime = createdAt || new Date().toISOString();
      
      console.log("✅ 已更新会话最后一条消息:", chats.value[chatIndex].name);

      // 如果不是当前用户发送的消息，增加未读数
      // 注意：类型转换比较，避免数字和字符串比较失败
      const isMyMessage = String(senderId) === String(authStore.userId);
      console.log("🔍 是否是我发送的消息:", isMyMessage);
      
      if (!isMyMessage) {
        // 如果当前正在查看这个会话，标记为已读
        if (selectedChatId.value === chats.value[chatIndex].id) {
          // 标记消息为已读
          try {
            await chatApi.markRead(conversationId);
          } catch (error) {
            console.error("标记已读失败:", error);
          }
        } else {
          // 否则增加未读数
          chats.value[chatIndex].unreadCount = (chats.value[chatIndex].unreadCount || 0) + 1;
        }
      }

      // 列表排序由 filteredChats 计算属性自动处理
      /*
      // 将该会话移到列表最前面（如果不是置顶状态）
      const chat = chats.value.splice(chatIndex, 1)[0];
      if (!chat.isPinned) {
        // 找到第一个非置顶会话的位置
        const firstNonPinnedIndex = chats.value.findIndex((c) => !c.isPinned);
        if (firstNonPinnedIndex !== -1) {
          chats.value.splice(firstNonPinnedIndex, 0, chat);
        } else {
          chats.value.push(chat);
        }
      } else {
        // 置顶会话保持在最前面
        chats.value.unshift(chat);
      }
      */

      // 如果当前正在查看这个会话，更新消息列表
      if (selectedChatId.value === chat.id) {
        const newMsg = {
          id: messageId || Date.now(),
          content: content,
          isMine: String(senderId) === String(authStore.userId),
          isFromUser: String(senderId) === String(authStore.userId),
          timestamp: createdAt || new Date().toISOString(),
          time: formatTime(createdAt || new Date().toISOString()),
          contentType: contentType || "text",
          senderNickname: senderNickname || chat.name,
          senderAvatar: senderAvatar || chat.avatar,
        };
        
        const selectedChatObj = chats.value.find((c) => c.id === selectedChatId.value);
        if (selectedChatObj && selectedChatObj.messages) {
          // 检查消息是否已存在（避免重复）
          const exists = selectedChatObj.messages.some(m => 
            m.id === newMsg.id || (m.content === newMsg.content && Math.abs(new Date(m.timestamp) - new Date(newMsg.timestamp)) < 1000)
          );
          if (!exists) {
            selectedChatObj.messages.push(newMsg);
            console.log("✅ 消息已添加到当前会话并显示:", newMsg);
            // 滚动到底部
            nextTick(() => scrollToBottom());
          } else {
            console.log("⚠️ 消息已存在，跳过重复添加");
          }
        }
      } else {
        console.log("📝 消息属于其他会话，已更新会话列表但未添加到当前显示");
      }
    } else {
      // 如果会话不存在，重新加载会话列表
      console.log("🔄 收到新会话的消息，重新加载会话列表");
      await loadConversations();
    }
  } else if (message.type === "notification") {
    // 收到新通知，刷新通知列表
    console.log("🔔 收到新通知");
    await loadNotifications();
  } else if (message.type === "connected") {
    // 连接成功确认消息，忽略
    console.log("✅ WebSocket连接确认:", message.message);
  } else {
    console.log("❓ 未知的消息格式:", message);
  }
};

// 关闭WebSocket连接（仅在没有其他处理器时关闭）
const closeWebSocket = () => {
  // 移除当前组件的消息处理器
  if (currentMessageHandler) {
    wsState.messageHandlers.delete(currentMessageHandler);
    currentMessageHandler = null;
    console.log("已移除消息处理器，当前处理器数量:", wsState.messageHandlers.size);
  }
  
  // 只有当没有其他处理器时才关闭连接
  if (wsState.messageHandlers.size === 0) {
    // 清除重连定时器
    if (wsState.reconnectTimer) {
      clearTimeout(wsState.reconnectTimer);
      wsState.reconnectTimer = null;
    }
    
    if (wsState.instance) {
      console.log("主动关闭WebSocket连接（没有其他处理器）");
      wsState.isIntentionalClose = true;
      wsState.instance.close();
      wsState.instance = null;
      isWebSocketConnected.value = false;
    }
  } else {
    console.log("还有其他处理器在使用，保持WebSocket连接");
  }
};

onMounted(async () => {
  await loadConversations();
  await loadNotifications();

  // 注册当前组件的消息处理器
  currentMessageHandler = handleWebSocketMessage;
  wsState.messageHandlers.add(currentMessageHandler);
  console.log("已注册消息处理器，当前处理器数量:", wsState.messageHandlers.size);
  
  // 初始化WebSocket连接
  initWebSocket();

  // 检查路由参数，如果有 userId，创建或选择对应的聊天
  const userId = route.params.userId;
  if (userId) {
    console.log("从路由参数获取到 userId:", userId);
    // 等待会话列表加载完成后再创建/选择聊天
    await nextTick();
    await createOrSelectChatByUserId(userId);
  }

  // 点击页面其他地方关闭下拉菜单
  document.addEventListener("click", closeOptionsMenu);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener("click", closeOptionsMenu);
  // 移除消息处理器（可能保持连接供其他组件使用）
  closeWebSocket();
});
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
