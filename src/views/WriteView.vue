<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PrimaryButton from '../components/PrimaryButton.vue'
import { Mood, createLetter, ensureDefaultSettings, moodLabel } from '../lib/db'
import { computeReplyDueAt } from '../lib/replyEngine'
import { scheduleForLetterId } from '../lib/scheduler'

const router = useRouter()

const moods = [
  { key: Mood.anxiety, label: moodLabel(Mood.anxiety) },
  { key: Mood.sad, label: moodLabel(Mood.sad) },
  { key: Mood.tired, label: moodLabel(Mood.tired) },
  { key: Mood.lonely, label: moodLabel(Mood.lonely) },
  { key: Mood.stress, label: moodLabel(Mood.stress) },
  { key: Mood.confused, label: moodLabel(Mood.confused) },
  { key: Mood.angry, label: moodLabel(Mood.angry) },
  { key: Mood.happy, label: moodLabel(Mood.happy) },
]

const content = ref('')
const selectedMood = ref(Mood.anxiety)
const isSubmitting = ref(false)

onMounted(async () => {
  await ensureDefaultSettings()
})

function goBack() {
  router.push('/')
}

async function submit() {
  if (isSubmitting.value) return
  const text = content.value.trim()
  if (!text) return

  isSubmitting.value = true
  try {
    const replyDueAt = await computeReplyDueAt()
    const letter = await createLetter({
      content: text,
      mood: selectedMood.value,
      replyDueAt,
    })

    await scheduleForLetterId(letter.id)

    content.value = ''
    router.push(`/post-ritual/${letter.id}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-8">
      <div class="text-sm text-handbook-ink/60">写一封信</div>
      <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">把这一刻写下来</h1>
      <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="m in moods"
          :key="m.key"
          type="button"
          class="shrink-0 rounded-full px-4 py-2 text-sm ring-1 ring-black/10 transition"
          :class="selectedMood === m.key ? 'bg-handbook-green/30 text-handbook-ink' : 'bg-white/50 text-handbook-ink/70 hover:bg-white/70'"
          @click="selectedMood = m.key"
        >
          {{ m.label }}
        </button>
      </div>
    </header>

    <section class="handbook-card">
      <textarea
        v-model="content"
        rows="10"
        class="w-full resize-none rounded-handbook-sm bg-transparent text-base leading-relaxed outline-none placeholder:text-handbook-ink/30"
        placeholder="把烦恼写下来，不需要修饰…"
      />

      <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <PrimaryButton variant="ghost" size="lg" :disabled="isSubmitting" @click="goBack">返回首页</PrimaryButton>
        <PrimaryButton size="lg" :disabled="isSubmitting || !content.trim()" @click="submit">
          {{ isSubmitting ? '投递中…' : '投递' }}
        </PrimaryButton>
      </div>
    </section>
  </main>
</template>
