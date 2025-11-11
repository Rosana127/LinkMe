<template>
  <div class="register-page-wrapper">
    <div class="register-container">
      <!-- 返回按钮 -->
      <button @click="goBack" class="back-button">
        <span class="iconify" data-icon="mdi:arrow-left" data-inline="false"></span>
        <span>返回</span>
      </button>
      
      <div class="register-card">
      <div class="register-header">
        <h1 class="register-title">创建账号</h1>
        <p class="register-subtitle">加入LinkMe，开始你的交友之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username" class="form-label">用户名 *</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <label for="nickname" class="form-label">昵称 *</label>
          <input
            id="nickname"
            v-model="form.nickname"
            type="text"
            class="form-input"
            placeholder="请输入昵称"
            required
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">邮箱 *</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="请输入邮箱"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone" class="form-label">手机号 *</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            class="form-input"
            placeholder="请输入手机号"
            required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">密码 *</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="请输入密码（至少8位）"
            required
            minlength="8"
          />
        </div>

        <div class="form-row">
          <div class="form-group" style="flex: 1">
            <label for="gender" class="form-label">性别 *</label>
            <select
              id="gender"
              v-model="form.gender"
              class="form-input"
              required
            >
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div class="form-group" style="flex: 1">
            <label for="birthday" class="form-label">生日 *</label>
            <input
              id="birthday"
              v-model="form.birthday"
              type="date"
              class="form-input"
              required
            />
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button 
          type="submit" 
          class="register-button"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>

        <div class="register-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  password: '',
  gender: '',
  birthday: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const result = await authStore.register(form.value)
    
    if (result.success) {
      successMessage.value = result.message || '注册成功！'
      // 延迟跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      errorMessage.value = result.message || '注册失败，请重试'
    }
  } catch (error) {
    errorMessage.value = error.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  // 总是返回到explore页面
  router.push('/discover')
}
</script>

<style scoped>
/* 注册页面全屏背景包装器 */
.register-page-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgb(239, 183, 193),rgb(151, 174, 223));
  position: relative;
  overflow: hidden;
}

.register-container {
  width: 100%;
  max-width: 600px;
  position: relative;
  padding: 20px;
  margin: 0 auto;
}

/* 返回按钮相对于全屏背景定位 */
.register-page-wrapper .back-button {
  position: fixed;
  top: 20px;
  left: 20px;
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
  z-index: 10;
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

.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 85vh;
  overflow-y: auto;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-title {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 14px;
  color: #666;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input::placeholder {
  color: #999;
}

.error-message {
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 14px;
}

.success-message {
  padding: 12px;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 8px;
  color: #3c3;
  font-size: 14px;
}

.register-button {
  padding: 12px;
  background: white;
  color: #333;
  border: 2px solid #333;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.register-button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #000;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.register-button:disabled {
  background: #f5f5f5;
  color: #999;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-footer .link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-footer .link:hover {
  text-decoration: underline;
}
</style>

