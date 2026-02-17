<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  <main class="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-8 flex items-start justify-between gap-4">
      <div>
        <div class="text-sm text-handbook-ink/60">回信</div>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">给你的一封回信</h1>
      </div>
      <div class="flex gap-2">
        <PrimaryButton variant="ghost" size="md" :disabled="isLoading" @click="reload">刷新</PrimaryButton>
        <PrimaryButton variant="ghost" size="md" @click="goInbox">返回信箱</PrimaryButton>
      </div>
    </header>

    <section v-if="!reply" class="handbook-card">
      <div class="text-lg font-semibold">回信还没到</div>
      <div class="mt-1 text-sm text-handbook-ink/60">id: {{ id }}</div>
      <div class="mt-6 text-sm text-handbook-ink/60">
        你可以稍后再回来看看，或者在信箱里点“刷新”。
      </div>
    </section>

    <section v-else class="handbook-card">
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm text-handbook-ink/60">回应给：{{ moodText }}</div>
        </div>
        <div class="text-xs text-handbook-ink/50">{{ createdAtText }}</div>
      </div>

      <div class="mt-6 whitespace-pre-wrap text-base leading-relaxed">{{ reply.content }}</div>

      <div class="mt-8 flex justify-end">
        <PrimaryButton variant="outline" size="lg" @click="goInbox">我读完了</PrimaryButton>
      </div>
    </section>
  </main>
</template>
