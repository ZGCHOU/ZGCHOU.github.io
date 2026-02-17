<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  <main class="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-8 flex items-start justify-between gap-4">
      <div>
        <div class="text-sm text-handbook-ink/60">信件</div>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">你的投递</h1>
      </div>
      <div class="flex gap-2">
        <PrimaryButton variant="ghost" size="md" :disabled="isLoading" @click="reload">刷新</PrimaryButton>
        <PrimaryButton variant="ghost" size="md" @click="goInbox">返回信箱</PrimaryButton>
      </div>
    </header>

    <section v-if="!letter" class="handbook-card">
      <div class="text-lg font-semibold">找不到这封信</div>
      <div class="mt-1 text-sm text-handbook-ink/60">id: {{ id }}</div>
    </section>

    <section v-else class="handbook-card">
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="text-sm text-handbook-ink/60">心情</div>
          <div class="mt-1 text-base font-semibold">{{ moodText }}</div>
        </div>
        <div class="text-xs text-handbook-ink/50">{{ createdAtText }}</div>
      </div>

      <div class="mt-6 whitespace-pre-wrap text-base leading-relaxed">{{ letter.content }}</div>

      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <PrimaryButton
          v-if="letter.replyId"
          :to="`/reply/${letter.replyId}`"
          size="lg"
        >
          查看回信
        </PrimaryButton>

        <PrimaryButton
          v-else
          variant="ghost"
          size="lg"
          disabled
        >
          等待回信中…
        </PrimaryButton>
      </div>

      <div class="mt-6 text-xs text-handbook-ink/50">
        当前状态：{{ letter.status === LetterStatus.replied ? '已回信' : '等待中' }}
      </div>
    </section>
  </main>
</template>
