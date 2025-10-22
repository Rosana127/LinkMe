<template>
  <aside class="sidebar">
    <!-- Logo 区域 -->
    <div class="logo-section">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h1 class="logo-text">Snapgram</h1>
    </div>
    
    <!-- 用户信息区域 -->
    <div class="user-section">
      <img 
        src="https://modao.cc/ai/uploads/ai_pics/32/327755/aigp_1758963762.jpeg" 
        alt="User avatar" 
        class="user-avatar"
      >
      <div class="user-info">
        <div class="user-name">babycat</div>
        <div class="user-handle">@babycat</div>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <div class="nav-menu">
      <button 
        @click="navigateTo('discover')" 
        :class="['nav-link', { active: $route.name === 'discover' }]"
      >
        <span class="iconify" data-icon="mdi:compass-outline" data-inline="false"></span>
        <span>Explore</span>
      </button>
      <button 
        @click="navigateTo('match')" 
        :class="['nav-link', { active: $route.name === 'match' }]"
      >
        <span class="iconify" data-icon="mdi:account-group-outline" data-inline="false"></span>
        <span>People</span>
      </button>
      <button 
        @click="navigateTo('chat')" 
        :class="['nav-link', { active: $route.name === 'chat' }]"
      >
        <span class="iconify" data-icon="mdi:message-outline" data-inline="false"></span>
        <span>Messages</span>
      </button>
      <button 
        @click="navigateTo('profile')" 
        :class="['nav-link', { active: $route.name === 'profile' }]"
      >
        <span class="iconify" data-icon="mdi:bookmark-outline" data-inline="false"></span>
        <span>Saved</span>
      </button>
      <button 
        @click="navigateTo('home')" 
        :class="['nav-link', { active: $route.name === 'home' }]"
      >
        <span class="iconify" data-icon="mdi:home-outline" data-inline="false"></span>
        <span>Home</span>
      </button>
      <button 
        @click="navigateTo('create')" 
        :class="['nav-link', { active: $route.name === 'create' }]"
      >
        <span class="iconify" data-icon="mdi:plus-circle-outline" data-inline="false"></span>
        <span>Create Post</span>
      </button>
      <button 
        @click="navigateTo('settings')" 
        :class="['nav-link', { active: $route.name === 'settings' }]"
      >
        <span class="iconify" data-icon="mdi:cog-outline" data-inline="false"></span>
        <span>Settings</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: #000000;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid #333333;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding: 12px;
  border-radius: 12px;
  background-color: #1a1a1a;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
}

.user-handle {
  color: #888888;
  font-size: 14px;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.nav-link:hover {
  background-color: #1a1a1a;
}

.nav-link.active {
  background-color: #8b5cf6;
  color: #ffffff;
}

.nav-link .iconify {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.logout-section {
  margin-top: auto;
  padding-top: 20px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: none;
  border: none;
  color: #888888;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.logout-btn:hover {
  background-color: #1a1a1a;
  color: #ffffff;
}

.logout-btn .iconify {
  font-size: 20px;
  width: 20px;
  height: 20px;
}
</style>
