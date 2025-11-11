<template>
  <div class="post-detail-page">
    <!-- 返回按钮 -->
    <button @click="goBack" class="back-button">
      <span class="iconify" data-icon="mdi:arrow-left" data-inline="false"></span>
      <span>返回</span>
    </button>
    
    <div class="post-detail-card">
      <div class="post-header">
        <img :src="post.author.avatar" class="user-avatar" />
        <div class="user-info">
          <div class="username">{{ post.author.name }}</div>
          <div class="user-handle">@{{ post.author.handle }}</div>
        </div>
        <div class="meta">
          <div class="time">{{ post.time }}</div>
          <div class="location">{{ post.location }}</div>
        </div>
      </div>

      <div class="post-body">
        <p class="caption">{{ post.caption }}</p>
        <div class="hashtags">{{ post.hashtags }}</div>
        <div v-if="post.image" class="post-image">
          <img :src="post.image" alt="post image" />
        </div>
      </div>

      <div class="post-interact">
        <button :class="['like-btn', { liked: liked.value }]" @click="toggleLike">
          <span class="iconify" :data-icon="liked.value ? 'mdi:heart' : 'mdi:heart-outline'" data-inline="false"></span>
          <span>{{ likes }}</span>
        </button>
        <!-- 收藏（bookmark）显示及交互 -->
        <button :class="['fav-btn', { favorited: favorited.value }]" @click="toggleFavorite">
          <span class="iconify" :data-icon="favorited.value ? 'mdi:bookmark' : 'mdi:bookmark-outline'" data-inline="false"></span>
          <span>{{ favorites }}</span>
        </button>
        <button class="comment-btn" @click="focusCommentInput">
          <span class="iconify" data-icon="mdi:comment-outline" data-inline="false"></span>
          评论 ({{ comments.length }})
        </button>
      </div>

  <!-- 收藏成功提示 -->
  <div v-if="showFavToast" class="toast">{{ favorited.value ? '收藏成功' : '已取消收藏' }}</div>

      <div class="comments-section">
        <div class="add-comment">
          <input ref="commentInput" v-model="newComment" placeholder="写评论..." @keydown.enter.prevent="addComment" />
          <button @click="addComment" :disabled="loading">
            <span v-if="loading">发布中...</span>
            <span v-else>发布</span>
          </button>
        </div>
        <div v-if="error" class="comment-error" style="color:#ef4444;margin-top:6px">{{ error }}</div>

        <div class="comment" v-for="c in comments" :key="c.id">
          <div style="display:flex; justify-content:space-between; align-items:center">
            <div class="comment-author">{{ c.author }}</div>
            <div class="comment-time" style="color:#9ca3af; font-size:12px">{{ formatTime(c.createdAt) }}</div>
          </div>
          <div class="comment-text">{{ c.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, getComments, postComment } from '@/api/posts'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const id = route.params.id

const post = ref({ author: {}, caption:'', hashtags:'', image:'', likes:0 })

// local reactive state for likes/comments
const likes = ref(0)
const comments = ref([])
const favorites = ref(0)
const newComment = ref('')
const commentInput = ref(null)

// toggleable states
const liked = ref(false)
const favorited = ref(false)
const loading = ref(false)
const error = ref('')

function toggleLike() {
  if (liked.value) {
    likes.value = Math.max(0, likes.value - 1)
    liked.value = false
  } else {
    likes.value = likes.value + 1
    liked.value = true
  }
}

// 收藏
const showFavToast = ref(false)
function toggleFavorite() {
  if (favorited.value) {
    favorites.value = Math.max(0, favorites.value - 1)
    favorited.value = false
    toastMessage('已取消收藏')
  } else {
    favorites.value = (favorites.value || 0) + 1
    favorited.value = true
    toastMessage('收藏成功')
  }
}

function toastMessage(text) {
  showFavToast.value = true
  // 将消息放在模板渲染处
  const t = document.createElement('div')
  // 不操作 DOM here — use reactive template showFavToast + message instead
  setTimeout(() => { showFavToast.value = false }, 1200)
}

function addComment() {
  if (!newComment.value.trim()) return
  // post comment to backend
  const content = newComment.value.trim()
  const userId = authStore.userId
  const payload = {
    postId: id,
    userId: userId,
    content,
    // parentId should be null for top-level comments to avoid FK constraint failure
    parentId: null
  }
  loading.value = true
  postComment(id, payload).then(res => {
    // after posting, reload comments
    newComment.value = ''
    loadComments()
  }).catch(err => {
    error.value = err.message || '发表评论失败'
  }).finally(() => {
    loading.value = false
    // list is newest-first, ensure view shows top (newest) comment below input
    setTimeout(() => { const el = document.querySelector('.comments-section'); if (el) el.scrollTop = 0 }, 100)
  })
}

function focusCommentInput() { commentInput.value?.focus() }

async function loadPost() {
  loading.value = true
  try {
    const res = await getPost(id)
    const data = res && res.id ? res : (res?.data ? res.data : res)
    // map backend fields to view
    // 后端现在直接在Post对象中包含用户信息字段（nickname, username, avatarUrl）
    const author = data.user || data.author || data.creator || {}
    const images = Array.isArray(data.images) ? data.images : (data.images ? [data.images] : [])
    const firstImage = images.length ? (typeof images[0] === 'string' ? images[0] : (images[0].url || images[0].path || images[0].data || null)) : null
    post.value = {
      id: data.id ?? data._id ?? data.postId,
      author: {
        avatar: data.avatarUrl || author.avatar || author.photo || author.image || author.avatarUrl || 'https://via.placeholder.com/80',
        name: data.nickname || author.nickname || data.username || author.name || author.username || '匿名',
        handle: data.username || author.handle || author.username || (data.nickname ? data.nickname.replace(/\s+/g, '') : (author.nickname ? author.nickname.replace(/\s+/g, '') : ''))
      },
      time: data.createdAt ? new Date(data.createdAt).toLocaleString() : (data.time || ''),
      location: data.location || '',
      caption: data.topic || data.title || data.content || data.caption || '',
      hashtags: Array.isArray(data.tags) ? data.tags.join(' ') : (data.tags || ''),
      image: firstImage,
      likes: data.likes ?? data.likeCount ?? 0,
      favorites: data.favorites ?? data.bookmarks ?? 0
    }
    likes.value = post.value.likes
    favorites.value = post.value.favorites || 0
    // load comments
    await loadComments()
  } catch (e) {
    error.value = e.message || '加载帖子失败'
  } finally {
    loading.value = false
  }
}

async function loadComments() {
  try {
    const res = await getComments(id)
    const arr = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data) ? res.data : [])
    comments.value = arr.map(c => ({ 
      id: c.commentId ?? c.comment_id ?? c.id ?? c._id, 
      author: c.nickname || c.userName || c.authorName || (c.user && (c.user.nickname || c.user.name)) || c.username || '匿名', 
      text: c.content || c.text || '', 
      createdAt: c.created_at ?? c.createdAt 
    }))
      // sort newest first so they appear directly below the input
      .sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return tb - ta
      })
  } catch (e) {
    // if comments endpoint not available, keep comments empty
    comments.value = []
  }
}

function formatTime(ts) {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return d.toLocaleString()
  } catch (e) {
    return ts
  }
}

function goBack() {
  // 返回到上一个页面，如果没有历史记录则返回到explore页面
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/discover')
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-detail-page { 
  max-width: 800px; 
  margin: 80px auto; 
  position: relative;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 300px; /* 放在侧边栏右侧，侧边栏宽度280px + 20px间距 */
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1001; /* 高于侧边栏的z-index: 1000 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateX(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.back-button .iconify {
  font-size: 18px;
}
.post-detail-card { background:#fff; padding:20px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.05) }
.post-header { display:flex; align-items:center; gap:12px }
.user-avatar { width:48px; height:48px; border-radius:50%; object-fit:cover }
.user-info .username { font-weight:700 }
.post-body { margin-top:12px }
.post-image img { width:100%; border-radius:8px; margin-top:8px }
.post-interact { display:flex; gap:12px; margin-top:12px }
.like-btn, .comment-btn { padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer }
.comments-section { margin-top:16px; max-height:300px; overflow:auto }
.comment { padding:8px 0; border-bottom:1px solid #f3f4f6 }
.add-comment { display:flex; gap:8px; margin-top:8px }
.add-comment input { flex:1; padding:8px; border-radius:8px; border:1px solid #e5e7eb }
.add-comment button { padding:8px 12px; border-radius:8px; background:#8b5cf6; color:#fff; border:none }

.fav-btn { padding:8px 12px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; margin-left:8px }
.fav-btn .iconify { margin-right:6px }
.toast { position: fixed; top: 90px; right: 40px; background: rgba(17,24,39,0.95); color: #fff; padding: 10px 14px; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,23,42,0.25); z-index: 200 }
.like-btn.liked { color: #ef4444 }
.fav-btn.favorited { color: #10b981 }
</style>
