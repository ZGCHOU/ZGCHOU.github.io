import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import WriteView from '../views/WriteView.vue'
import PostRitualView from '../views/PostRitualView.vue'
import InboxView from '../views/InboxView.vue'
import LetterDetailView from '../views/LetterDetailView.vue'
import ReplyDetailView from '../views/ReplyDetailView.vue'
import SettingsView from '../views/SettingsView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/write',
    name: 'write',
    component: WriteView,
  },
  {
    path: '/post-ritual/:id',
    name: 'post-ritual',
    component: PostRitualView,
  },
  {
    path: '/inbox',
    name: 'inbox',
    component: InboxView,
  },
  {
    path: '/letter/:id',
    name: 'letter-detail',
    component: LetterDetailView,
  },
  {
    path: '/reply/:id',
    name: 'reply-detail',
    component: ReplyDetailView,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
