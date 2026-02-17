import { createApp } from 'vue'

import './style.css'
import App from './App.vue'
import router from './router'
import { ensureDefaultSettings } from './lib/db'
import { scheduleAllPendingReplies } from './lib/scheduler'

async function bootstrap() {
  await ensureDefaultSettings()
  await scheduleAllPendingReplies()

  createApp(App).use(router).mount('#app')
}

bootstrap()
