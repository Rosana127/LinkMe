<template>
  <div class="create-post-page">
    <!-- Top navigation: New Post / Post Management -->
    <div class="top-tabs">
      <button :class="['tab', { active: activeTab === 'new' }]" @click="activeTab = 'new'">New Post</button>
      <button :class="['tab', { active: activeTab === 'manage' }]" @click="activeTab = 'manage'">Post Management</button>
    </div>

    <!-- New Post view (原来表单) -->
    <div v-if="activeTab === 'new'" class="create-card">
      <label class="field">
        <div class="label">Title (主题，最多 30 字)</div>
        <input v-model="title" type="text" maxlength="30" placeholder="输入主题，不超过30字" />
        <div class="meta">{{ title.length }} / 30</div>
      </label>

      <label class="field">
        <div class="label">Content</div>
        <textarea v-model="content" rows="6" placeholder="写下你的作品内容..."></textarea>
      </label>

      <label class="field">
        <div class="label">Images</div>
        <input ref="fileInput" type="file" accept="image/*" multiple @change="onFilesChange" />
        <div class="images-preview">
          <div v-for="(img, idx) in images" :key="idx" class="thumb">
            <img :src="img.data" alt="preview" />
            <button class="remove" @click="removeImage(idx)">✕</button>
          </div>
        </div>
      </label>

      <label class="field">
        <div class="label">Tags</div>
        <div class="tags">
          <button
            v-for="tag in availableTags"
            :key="tag"
            :class="['tag', { selected: selectedTags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </label>

      <label class="field">
        <div class="label">Visibility</div>
        <select v-model="visibility">
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="draft">Draft</option>
        </select>
      </label>

      <div class="actions">
        <button class="publish" @click="publish">Publish</button>
        <button class="draft" @click="saveDraft">Save Draft</button>
        <button class="cancel" @click="clearForm">Clear</button>
      </div>

      <div v-if="message" class="message">{{ message }}</div>
    </div>

    <!-- Post Management view -->
    <div v-if="activeTab === 'manage'" class="manage-card">
      <div class="manage-tabs">
        <button :class="['manage-tab', { active: managementTab === 'all' }]" @click="managementTab = 'all'">全部笔记 ({{ counts.all }})</button>
        <button :class="['manage-tab', { active: managementTab === 'published' }]" @click="managementTab = 'published'">已发布 ({{ counts.published }})</button>
        <button :class="['manage-tab', { active: managementTab === 'review' }]" @click="managementTab = 'review'">审核中 ({{ counts.review }})</button>
        <button :class="['manage-tab', { active: managementTab === 'rejected' }]" @click="managementTab = 'rejected'">未通过 ({{ counts.rejected }})</button>
        <button :class="['manage-tab', { active: managementTab === 'drafts' }]" @click="managementTab = 'drafts'">草稿箱 ({{ posts.filter(p=>p.status==='draft').length }})</button>
      </div>

      <!-- optional toolbar below manage-tabs, kept sticky as well -->
      <div class="manage-toolbar">
        <div class="toolbar-left">显示 {{ filteredPosts.length }} 条</div>
        <div class="toolbar-right">排序：最近</div>
      </div>

      <!-- grid wrapper is scrollable so the tabs stay fixed -->
      <div class="manage-grid-wrapper">
        <div v-if="filteredPosts.length === 0" class="empty">暂无帖子</div>
        <div class="manage-grid">
          <div v-for="post in filteredPosts" :key="post.id" class="post-card">
            <div class="card-image">
              <img :src="post.images && post.images.length ? post.images[0].data || post.images[0].url : 'https://via.placeholder.com/400x240?text=No+Image'" alt="post" />
            </div>
            <div class="card-body">
              <div class="card-title">{{ post.title }}</div>
            </div>
            <div class="card-footer">
              <div class="status">{{ statusText(post.status) }}</div>
              <div class="card-actions">
                <button v-if="post.status === 'draft'" @click="editDraft(post.id)">编辑</button>
                <button v-else-if="post.status !== 'published'" @click="setStatus(post.id, 'published')">发布</button>
                <button v-if="post.status !== 'rejected' && post.status !== 'draft'" @click="setStatus(post.id, 'rejected')">驳回</button>
                <button @click="removePost(post.id)" class="danger">删除</button>
              </div>
            </div>
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

// tabs
const activeTab = ref('new') // 'new' or 'manage'

// create form state
const title = ref('')
const content = ref('')
const images = ref([]) // { file, data }
const selectedTags = ref([])
const availableTags = ref(['Art', 'Photography', 'Travel', 'Design', 'Food', 'Lifestyle'])
const visibility = ref('public')
const message = ref('')
const fileInput = ref(null)

// simple in-memory posts list for management demo
const posts = ref([
  { id: 1, title: '猫咪的早晨', content: 'Lovely cat', tags: ['Photography'], images: [], status: 'published' },
  { id: 2, title: '旅行笔记', content: 'Wanderlust', tags: ['Travel'], images: [], status: 'review' },
  { id: 3, title: '美食分享', content: 'Delicious', tags: ['Food'], images: [], status: 'rejected' }
])

const managementTab = ref('all') // all / published / review / rejected / drafts

const counts = computed(() => {
  return {
    all: posts.value.filter(p => p.status !== 'draft').length,
    published: posts.value.filter(p => p.status === 'published').length,
    review: posts.value.filter(p => p.status === 'review').length,
    rejected: posts.value.filter(p => p.status === 'rejected').length
  }
})

const filteredPosts = computed(() => {
  if (managementTab.value === 'all') return posts.value.filter(p => p.status !== 'draft')
  if (managementTab.value === 'published') return posts.value.filter(p => p.status === 'published')
  if (managementTab.value === 'review') return posts.value.filter(p => p.status === 'review')
  if (managementTab.value === 'rejected') return posts.value.filter(p => p.status === 'rejected')
  if (managementTab.value === 'drafts') return posts.value.filter(p => p.status === 'draft')
  return posts.value
})

function onFilesChange(e) {
  const files = Array.from(e.target.files || [])
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      images.value.push({ file, data: reader.result })
    }
    reader.readAsDataURL(file)
  })
  if (fileInput.value) fileInput.value.value = null
}

function removeImage(idx) {
  images.value.splice(idx, 1)
}

function toggleTag(tag) {
  const i = selectedTags.value.indexOf(tag)
  if (i === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(i, 1)
}

function clearForm() {
  title.value = ''
  content.value = ''
  images.value = []
  selectedTags.value = []
  visibility.value = 'public'
  message.value = ''
}

function publish() {
  if (!title.value.trim()) {
    message.value = '请填写主题（不超过30字）'
    return
  }
  if (title.value.length > 30) {
    message.value = '主题不能超过30字'
    return
  }
  if (!content.value.trim() && images.value.length === 0) {
    message.value = '请填写正文或上传图片'
    return
  }

  // create post in-memory
  const id = Math.max(0, ...posts.value.map(p=>p.id)) + 1
  posts.value.unshift({ id, title: title.value.trim(), content: content.value.trim(), tags: selectedTags.value.slice(), images: images.value.slice(), status: visibility.value === 'draft' ? 'draft' : 'review' })
  message.value = 'Publishing...'
  setTimeout(() => {
    message.value = '发布成功！已加入帖子管理'
    // switch to management tab to show
    activeTab.value = 'manage'
    managementTab.value = 'all'
    clearForm()
  }, 600)
}

function saveDraft() {
  const id = Math.max(0, ...posts.value.map(p=>p.id)) + 1
  posts.value.unshift({ id, title: title.value.trim(), content: content.value.trim(), tags: selectedTags.value.slice(), images: images.value.slice(), status: 'draft' })
  message.value = '已保存为草稿'
  clearForm()
}

function editDraft(id) {
  const p = posts.value.find(x => x.id === id && x.status === 'draft')
  if (!p) return
  // load into form
  title.value = p.title
  content.value = p.content
  selectedTags.value = p.tags.slice()
  images.value = p.images.slice()
  // remove draft from list (will be re-saved or published)
  removePost(id)
  activeTab.value = 'new'
}

function statusText(s) {
  if (s === 'published') return '已发布'
  if (s === 'review') return '审核中'
  if (s === 'rejected') return '未通过'
  if (s === 'draft') return '草稿'
  return s
}

function setStatus(id, st) {
  const p = posts.value.find(x => x.id === id)
  if (p) p.status = st
}

function removePost(id) {
  const idx = posts.value.findIndex(x => x.id === id)
  if (idx !== -1) posts.value.splice(idx, 1)
}
</script>

<style scoped>
.create-post-page {
  max-width: 760px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  color: #ffffff;
  margin-bottom: 20px;
}

.create-card {
  background-color: #1a1a1a;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.top-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.tab {
  padding: 8px 14px;
  border-radius: 999px;
  background: #121212;
  color: #ccc;
  border: 1px solid #2a2a2a;
  cursor: pointer;
}

.tab.active {
  background: #8b5cf6;
  color: #fff;
  border-color: #8b5cf6;
}

.manage-card {
  background: #111;
  padding: 12px;
  border-radius: 12px;
}

.manage-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.manage-tab {
  padding: 6px 10px;
  border-radius: 999px;
  background: #0f0f0f;
  color: #ccc;
  border: 1px solid #222;
  cursor: pointer;
}

.manage-tab.active {
  background: #8b5cf6;
  color: #fff;
  border-color: #8b5cf6;
}

.manage-toolbar { display:flex; justify-content:space-between; align-items:center; padding:8px 0; margin-bottom:8px; background:transparent }
.manage-grid-wrapper { max-height: 60vh; overflow:auto; padding-right:6px; }
.manage-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.post-card { background:#0b0b0b; border-radius:10px; overflow:hidden; display:flex; flex-direction:column; }
.card-image { width:100%; aspect-ratio: 16/10; overflow:hidden; }
.card-image img { width:100%; height:100%; object-fit:cover; display:block }
.card-body { padding:10px; }
.card-title { color:#fff; font-weight:600; font-size:16px }
.card-footer { display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border-top:1px solid #1b1b1b }
.card-actions button { background:#222; color:#fff; border:none; padding:6px 8px; border-radius:6px; cursor:pointer }
.card-actions .danger { background:#4a1a1a }
.status { color:#8b5cf6; font-weight:600 }

/* sticky headers: top-tabs and manage-tabs/toolbar stick to top of the page area */
.top-tabs, .manage-tabs, .manage-toolbar {
  position: sticky;
  top: 0; /* will stack; adjust as needed */
  z-index: 20;
}

/* give slight background so sticky area covers content under it */
.top-tabs { background: linear-gradient(180deg, rgba(10,10,10,0.95), rgba(10,10,10,0.9)); padding-top:6px; padding-bottom:6px }
.manage-tabs { background: rgba(10,10,10,0.95); padding:6px 0 }
.manage-toolbar { background: rgba(10,10,10,0.92); padding:6px 0 }


.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  color: #888888;
  font-size: 14px;
}

input[type="text"], textarea, select {
  background-color: #0f0f0f;
  border: 1px solid #2a2a2a;
  color: #ffffff;
  padding: 10px;
  border-radius: 8px;
}

.images-preview {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.thumb {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #0b0b0b;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb .remove {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  border-radius: 12px;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 8px 12px;
  border-radius: 999px;
  background: #121212;
  color: #ccc;
  border: 1px solid #2a2a2a;
  cursor: pointer;
}

.tag.selected {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.actions {
  display: flex;
  gap: 12px;
}

.publish {
  background: #8b5cf6;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.draft {
  background: #444;
  color: #fff;
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel {
  background: #222;
  color: #fff;
  border: 1px solid #333;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.message {
  margin-top: 6px;
  color: #8b5cf6;
}
</style>