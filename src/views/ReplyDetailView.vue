<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock, Heart, Sparkles } from 'lucide-vue-next'

import PrimaryButton from '../components/PrimaryButton.vue'
import { formatDateTime, getReply, moodLabel } from '../lib/db'

const route = useRoute()
const router = useRouter()

const reply = ref(null)
const isLoading = ref(false)

const id = computed(() => String(route.params.id || ''))

const createdAtText = computed(() => (reply.value ? formatDateTime(reply.value.createdAt) : ''))
const moodText = computed(() => (reply.value ? moodLabel(reply.value.mood) : ''))

async function reload() {
  isLoading.value = true
  try {
    reply.value = await getReply(id.value)
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
        <div class="text-[11px] font-bold tracking-[0.2em] text-handbook-ink/30 uppercase">Echo Reply</div>
      </div>
    </header>

    <section v-if="!reply" class="handbook-card !p-12 text-center">
      <div class="text-xl font-semibold text-handbook-ink/80">回信还没到</div>
      <div class="mt-3 text-sm text-handbook-ink/40 leading-relaxed">
        你可以稍后再回来看看，或者在信箱里点“刷新”。
      </div>
      <div class="mt-10">
        <PrimaryButton variant="ghost" size="lg" @click="goInbox">返回信箱</PrimaryButton>
      </div>
    </section>

    <section v-else class="handbook-card relative !p-0">
      <!-- 顶部装饰栏 -->
      <div class="p-10 pb-6 border-b border-black/[0.03] bg-gradient-to-br from-handbook-sage/5 to-transparent">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-handbook-sage uppercase mb-1.5">
              <Sparkles class="h-3 w-3" />
              <span>Response To</span>
            </div>
            <div class="text-xl font-semibold text-handbook-ink">{{ moodText }}</div>
          </div>
          <div class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-handbook-ink/20 uppercase bg-white/40 px-3 py-1.5 rounded-full shadow-sm">
            <Clock class="h-3 w-3" />
            <span>{{ createdAtText }}</span>
          </div>
        </div>
      </div>

      <!-- 回信内容区 -->
      <div class="p-10 pt-8 min-h-[300px] relative">
        <div class="whitespace-pre-wrap text-lg leading-relaxed text-handbook-ink/80 font-medium italic">
          {{ reply.content }}
        </div>
        
        <!-- 装饰图标 -->
        <Heart class="absolute bottom-10 right-10 h-12 w-12 text-handbook-sage/10" />
      </div>

      <!-- 底部操作区 -->
      <div class="p-8 pt-0 flex justify-end items-center border-t border-black/[0.03] mt-4">
        <PrimaryButton
          variant="outline"
          size="lg"
          @click="goInbox"
          class="w-full sm:w-auto !px-10"
        >
          我读完了，谢谢你
        </PrimaryButton>
      </div>
    </section>
  </main>
</template>
