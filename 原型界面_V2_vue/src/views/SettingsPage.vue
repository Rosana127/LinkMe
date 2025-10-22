<template>
  <div class="settings-page">
    <div class="settings-container">
      <h1 class="page-title">Settings</h1>
      
      <div class="settings-sections">
        <!-- Account Settings -->
        <div class="settings-section">
          <h2 class="section-title">Account</h2>
          <div class="settings-item">
            <div class="item-info">
              <h3>Profile Information</h3>
              <p>Update your profile details</p>
            </div>
            <button class="settings-btn">Edit</button>
          </div>
          <div class="settings-item">
            <div class="item-info">
              <h3>Privacy Settings</h3>
              <p>Control who can see your content</p>
            </div>
            <button class="settings-btn">Manage</button>
          </div>
        </div>

        <!-- App Settings -->
        <div class="settings-section">
          <h2 class="section-title">App</h2>
          <div class="settings-item">
            <div class="item-info">
              <h3>Notifications</h3>
              <p>Manage your notification preferences</p>
            </div>
            <button class="settings-btn">Configure</button>
          </div>
          <div class="settings-item">
            <div class="item-info">
              <h3>Theme</h3>
              <p>Choose your preferred theme</p>
            </div>
            <button class="settings-btn">Change</button>
          </div>
        </div>

        <!-- Support -->
        <div class="settings-section">
          <h2 class="section-title">Support</h2>
          <div class="settings-item">
            <div class="item-info">
              <h3>Help Center</h3>
              <p>Get help and support</p>
            </div>
            <button class="settings-btn">Visit</button>
          </div>
          <div class="settings-item">
            <div class="item-info">
              <h3>Contact Us</h3>
              <p>Send us feedback or report issues</p>
            </div>
            <button class="settings-btn">Contact</button>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="settings-section danger-section">
          <h2 class="section-title">Danger Zone</h2>
          <div class="settings-item">
            <div class="item-info">
              <h3>Logout</h3>
              <p>Sign out of your account</p>
            </div>
            <button class="settings-btn danger-btn" @click="handleLogout">
              <span class="iconify" data-icon="mdi:logout" data-inline="false"></span>
              Logout
            </button>
          </div>
          <div class="settings-item">
            <div class="item-info">
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all data</p>
            </div>
            <button class="settings-btn danger-btn">
              <span class="iconify" data-icon="mdi:delete-outline" data-inline="false"></span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  // 这里可以添加登出逻辑
  console.log('Logging out...')
  // 例如：清除token、重定向到登录页等
  // router.push('/login')
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
  padding: 20px;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #ffffff;
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.settings-section {
  background-color: #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #333333;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ffffff;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #333333;
}

.settings-item:last-child {
  border-bottom: none;
}

.item-info h3 {
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.item-info p {
  font-size: 14px;
  color: #888888;
  margin: 0;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #8b5cf6;
  color: #ffffff;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-btn:hover {
  background-color: #7c3aed;
}

.settings-btn .iconify {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.danger-section {
  border-color: #dc2626;
}

.danger-btn {
  background-color: #dc2626;
}

.danger-btn:hover {
  background-color: #b91c1c;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 20px 10px;
  }
  
  .settings-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .settings-btn {
    align-self: flex-end;
  }
}
</style>
