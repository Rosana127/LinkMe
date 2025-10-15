<template>
  <div class="home-page">
    <h1 class="page-title">Home</h1>
    
    <!-- 个人资料卡片 -->
    <div class="profile-card">
      <div class="profile-header">
        <img 
          src="https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg" 
          alt="Profile" 
          class="profile-avatar"
        >
        <div class="profile-info">
          <h2 class="profile-name">babycat</h2>
          <p class="profile-handle">@babycat</p>
          <p class="profile-bio">Love cats, travel and photography 📸</p>
        </div>
        <button class="edit-profile-btn">Edit Profile</button>
      </div>
      
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-number">156</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">1.2K</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">892</span>
          <span class="stat-label">Following</span>
        </div>
      </div>
    </div>
    
    <!-- 我的动态 -->
    <div class="my-posts-section">
      <h3 class="section-title">My Posts</h3>
      <div class="posts-grid">
        <div 
          v-for="post in myPosts" 
          :key="post.id"
          class="post-item"
        >
          <img 
            :src="post.image" 
            :alt="post.caption" 
            class="post-thumbnail"
          >
          <div class="post-overlay">
            <div class="post-stats">
              <span class="stat">
                <span class="iconify" data-icon="mdi:heart" data-inline="false"></span>
                {{ post.likes }}
              </span>
              <span class="stat">
                <span class="iconify" data-icon="mdi:comment" data-inline="false"></span>
                {{ post.comments }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
<<<<<<< HEAD
    <!-- 注意：最近活动部分已移至消息中心页面 -->
=======
    <!-- 最近活动 -->
    <div class="recent-activity">
      <h3 class="section-title">Recent Activity</h3>
      <div class="activity-list">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <img 
            :src="activity.user.avatar" 
            :alt="activity.user.name" 
            class="activity-avatar"
          >
          <div class="activity-content">
            <p class="activity-text">
              <span class="activity-user">{{ activity.user.name }}</span>
              {{ activity.action }}
            </p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>
>>>>>>> 4298baf184477cd5bb16677130bd93ae66da9a2b
  </div>
</template>

<script setup>
import { ref } from 'vue'

const myPosts = ref([
  {
    id: 1,
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg',
    caption: 'Beautiful cat in the world',
    likes: 156,
    comments: 23
  },
  {
    id: 2,
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg',
    caption: 'Amazing sunset in Tokyo',
    likes: 89,
    comments: 12
  },
  {
    id: 3,
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg',
    caption: 'Stockholm, Sweden',
    likes: 234,
    comments: 45
  },
  {
    id: 4,
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327749/aigp_1758963751.jpeg',
    caption: 'Morning coffee',
    likes: 67,
    comments: 8
  },
  {
    id: 5,
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327748/aigp_1758963749.jpeg',
    caption: 'Weekend vibes',
    likes: 123,
    comments: 19
  },
  {
    id: 6,
    image: 'https://modao.cc/ai/uploads/ai_pics/32/327747/aigp_1758963748.jpeg',
    caption: 'Nature walk',
    likes: 78,
    comments: 15
  }
])

<<<<<<< HEAD
// 注意：最近活动数据已移至ChatPage.vue
=======
const recentActivities = ref([
  {
    id: 1,
    user: {
      name: 'Frank',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327754/aigp_1758963760.jpeg'
    },
    action: 'liked your post',
    time: '2 minutes ago'
  },
  {
    id: 2,
    user: {
      name: 'tu',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327752/aigp_1758963757.jpeg'
    },
    action: 'started following you',
    time: '1 hour ago'
  },
  {
    id: 3,
    user: {
      name: 'ha',
      avatar: 'https://modao.cc/ai/uploads/ai_pics/32/327753/aigp_1758963759.jpeg'
    },
    action: 'commented on your post',
    time: '3 hours ago'
  }
])
>>>>>>> 4298baf184477cd5bb16677130bd93ae66da9a2b
</script>

<style scoped>
.home-page {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 30px;
}

.profile-card {
  background-color: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.profile-handle {
  color: #888888;
  font-size: 16px;
  margin: 0 0 8px 0;
}

.profile-bio {
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.edit-profile-btn {
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-profile-btn:hover {
  background-color: #7c3aed;
}

.profile-stats {
  display: flex;
  gap: 40px;
  padding-top: 20px;
  border-top: 1px solid #333333;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.stat-label {
  font-size: 14px;
  color: #888888;
  margin-top: 4px;
}

.my-posts-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.post-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.post-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.post-item:hover .post-overlay {
  opacity: 1;
}

.post-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
}

.stat .iconify {
  font-size: 16px;
}

.recent-activity {
  margin-bottom: 30px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #1a1a1a;
  border-radius: 8px;
}

.activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #ffffff;
  font-size: 14px;
  margin: 0 0 4px 0;
}

.activity-user {
  font-weight: 600;
}

.activity-time {
  color: #888888;
  font-size: 12px;
}
</style>
