<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock, MessageSquare, RefreshCw } from 'lucide-vue-next'

import PrimaryButton from '../components/PrimaryButton.vue'
import { formatDateTime, getLetter, moodLabel, LetterStatus } from '../lib/db'
import { scheduleForLetterId } from '../lib/scheduler'

const route = useRoute()
const router = useRouter()

const letter = ref(null)
const isLoading = ref(false)

const id = computed(() => String(route.params.id || ''))

const moodText = computed(() => (letter.value ? moodLabel(letter.value.mood) : ''))
const createdAtText = computed(() => (letter.value ? formatDateTime(letter.value.createdAt) : ''))

async function reload() {
  isLoading.value = true
  try {
    letter.value = await getLetter(id.value)
    if (letter.value?.status === LetterStatus.sent) {
      await scheduleForLetterId(letter.value.id)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await reload()
})

function goInbox() {
  router.push('/inbox')
}
</script>

<template>
  <main class="mx-auto w-full max-w-3xl px-6 pb-24 pt-16 sm:px-10 sm:pt-20">
    <header class="mb-12 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          @click="goInbox"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-handbook-ink/40 transition-all hover:bg-white/60 hover:text-handbook-ink shadow-sm ring-1 ring-black/5 active:scale-90"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div class="text-[11px] font-bold tracking-[0.2em] text-handbook-ink/30 uppercase">Letter Details</div>
      </div>
      
      <button 
        @click="reload"
        :class="{ 'animate-spin': isLoading }"
        class="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-handbook-ink/40 transition-all hover:bg-white/60 hover:text-handbook-ink shadow-sm ring-1 ring-black/5"
      >
        <RefreshCw class="h-4 w-4" />
      </button>
    </header>

    <section v-if="!letter" class="handbook-card !p-12 text-center">
      <div class="text-xl font-semibold text-handbook-ink/80">找不到这封信</div>
      <div class="mt-3 text-sm text-handbook-ink/40 leading-relaxed">
        它可能已被删除或从未存在。
      </div>
      <div class="mt-10">
        <PrimaryButton variant="ghost" size="lg" @click="goInbox">返回信箱</PrimaryButton>
      </div>
    </section>

    <section v-else class="handbook-card relative !p-0">
      <!-- 顶部信息栏 -->
      <div class="p-10 pb-6 border-b border-black/[0.03]">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-handbook-ink/25 uppercase mb-1.5">
              <span>Mood Status</span>
            </div>
            <div class="text-xl font-semibold text-handbook-ink">{{ moodText }}</div>
          </div>
          <div class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-handbook-ink/20 uppercase bg-black/[0.02] px-3 py-1.5 rounded-full">
            <Clock class="h-3 w-3" />
            <span>{{ createdAtText }}</span>
          </div>
        </div>
      </div>

      <!-- 信件正文区 -->
      <div class="p-10 pt-8 min-h-[300px]">
        <div class="whitespace-pre-wrap text-lg leading-relaxed text-handbook-ink/80 font-medium">
          {{ letter.content }}
        </div>
      </div>

      <!-- 底部操作区 -->
      <div class="p-8 pt-0 flex flex-col gap-4 sm:flex-row sm:justify-end items-center border-t border-black/[0.03] mt-4">
        <div class="flex-1 text-[11px] font-bold tracking-widest text-handbook-ink/20 uppercase flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full" :class="letter.status === LetterStatus.replied ? 'bg-handbook-sage' : 'bg-handbook-coral/40'"></div>
          <span>Status: {{ letter.status === LetterStatus.replied ? 'Replied' : 'Waiting for echo' }}</span>
        </div>

        <PrimaryButton
          v-if="letter.replyId"
          :to="`/reply/${letter.replyId}`"
          size="lg"
          class="w-full sm:w-auto !px-10"
        >
          <div class="flex items-center gap-2">
            <span>查看回信</span>
            <MessageSquare class="h-4 w-4" />
          </div>
        </PrimaryButton>

        <div
          v-else
          class="flex items-center gap-2 px-8 py-4 rounded-full bg-black/5 text-handbook-ink/30 text-sm font-bold tracking-wide"
        >
          <RefreshCw class="h-4 w-4 animate-spin-slow" />
          <span>等待回信中…</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
</style>
