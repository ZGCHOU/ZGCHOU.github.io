<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Send } from 'lucide-vue-next'

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
  <main class="mx-auto w-full max-w-3xl px-6 pb-24 pt-16 sm:px-10 sm:pt-20">
    <header class="mb-12">
      <div class="flex items-center justify-between">
        <button 
          @click="goBack"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-handbook-ink/40 transition-all hover:bg-white/60 hover:text-handbook-ink shadow-sm ring-1 ring-black/5 active:scale-90"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div class="text-[11px] font-bold tracking-[0.2em] text-handbook-ink/30 uppercase">New Letter</div>
      </div>
      
      <h1 class="mt-8 text-3xl font-semibold tracking-tight text-handbook-ink sm:text-4xl">
        把这一刻写下来
      </h1>
      
      <div class="mt-8 flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
        <button
          v-for="m in moods"
          :key="m.key"
          type="button"
          class="shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-500 ring-1"
          :class="selectedMood === m.key 
            ? 'bg-handbook-ink text-handbook-paper ring-handbook-ink shadow-lg shadow-handbook-ink/20' 
            : 'bg-white/40 text-handbook-ink/50 ring-black/5 hover:bg-white/60'"
          @click="selectedMood = m.key"
        >
          {{ m.label }}
        </button>
      </div>
    </header>

    <section class="handbook-card !p-2 relative">
      <div class="bg-black/[0.02] rounded-[2.5rem] inset-shadow-sm">
        <textarea
          v-model="content"
          rows="12"
          class="w-full resize-none rounded-[2.5rem] bg-transparent p-8 text-lg leading-relaxed text-handbook-ink outline-none placeholder:text-handbook-ink/20"
          placeholder="那些没能说出口的话，都可以在这里写下…"
        />
      </div>

      <div class="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="text-xs text-handbook-ink/30 font-medium ml-2">
          {{ content.trim().length }} 个字符 · 我们会认真倾听
        </div>
        
        <PrimaryButton 
          size="lg" 
          :disabled="isSubmitting || !content.trim()" 
          @click="submit"
          class="sm:min-w-[160px]"
        >
          <template v-if="isSubmitting">投递中…</template>
          <template v-else>
            <div class="flex items-center gap-2">
              <span>完成投递</span>
              <Send class="h-4 w-4" />
            </div>
          </template>
        </PrimaryButton>
      </div>
    </section>
  </main>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.inset-shadow-sm {
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
}
</style>
