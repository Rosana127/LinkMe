import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import DiscoverPage from '../views/DiscoverPage.vue'
import MatchPage from '../views/MatchPage.vue'
import ChatPage from '../views/ChatPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import CreatePost from '../views/CreatePost.vue'

const routes = [
  {
    path: '/',
    redirect: '/discover'
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage
  },
  {
    path: '/discover',
    name: 'discover',
    component: DiscoverPage
  },
  {
    path: '/match',
    name: 'match',
    component: MatchPage
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage
  }
  ,{
    path: '/create',
    name: 'create',
    component: CreatePost
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
