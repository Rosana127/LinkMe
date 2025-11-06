<template>
  <div class="post-detail-page">
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
        <div class="comment" v-for="c in comments" :key="c.id">
          <div class="comment-author">{{ c.author }}</div>
          <div class="comment-text">{{ c.text }}</div>
        </div>

        <div class="add-comment">
          <input ref="commentInput" v-model="newComment" placeholder="写评论..." />
          <button @click="addComment">发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findPostById } from '@/data/posts'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const post = ref(findPostById(id) || { author: {}, caption:'', hashtags:'', image:'', likes:0, comments:[] })

// local reactive state for likes/comments
const likes = ref(post.value.likes || 0)
const comments = ref(post.value.comments ? [...post.value.comments] : [])
const favorites = ref(post.value.favorites || 0)
const newComment = ref('')
const commentInput = ref(null)

// toggleable states
const liked = ref(post.value.liked || false)
const favorited = ref(post.value.favorited || false)

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
  const c = { id: Date.now(), author: 'You', text: newComment.value.trim() }
  comments.value.push(c)
  newComment.value = ''
  // 简单滚动到最后一条评论
  setTimeout(() => {
    const el = document.querySelector('.comments-section')
    if (el) el.scrollTop = el.scrollHeight
  }, 50)
}

function focusCommentInput() { commentInput.value?.focus() }
</script>

<style scoped>
.post-detail-page { max-width: 800px; margin: 80px auto; }
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
