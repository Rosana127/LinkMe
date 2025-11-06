import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '../views/HomePage.vue'
import DiscoverPage from '../views/DiscoverPage.vue'
import MatchPage from '../views/MatchPage.vue'
import ChatPage from '../views/ChatPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import CreatePost from '../views/CreatePost.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import PostDetail from '../views/PostDetail.vue'

const routes = [
  {
    path: '/',
    redirect: '/discover'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/discover',
    name: 'discover',
    component: DiscoverPage,
    meta: { requiresAuth: false } // 不需要登录即可访问
  },
  {
    path: '/match',
    name: 'match',
    component: MatchPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/create',
    name: 'create',
    component: CreatePost,
    meta: { requiresAuth: true }
  }
  ,
  {
    path: '/post/:id',
    name: 'post',
    component: PostDetail,
    props: true,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    if (authStore.isAuthenticated) {
      next()
    } else {
      // 未登录，重定向到登录页
      next({ name: 'login', query: { redirect: to.fullPath } })
    }
  } else {
    // 如果已登录用户访问登录/注册页，重定向到首页
    if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
      next({ name: 'discover' })
    } else {
      next()
    }
  }
})

export default router
