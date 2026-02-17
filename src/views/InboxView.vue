<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Pin, Trash2, PencilLine, ArrowLeft, RefreshCw, Plus } from 'lucide-vue-next'

import PrimaryButton from '../components/PrimaryButton.vue'
import { formatDateTime, listLetters, moodLabel, LetterStatus, toggleFavorite, togglePin, deleteLetter, updateLetter } from '../lib/db'

const letters = ref([])
const isLoading = ref(false)

const editingId = ref(null)
const editingText = ref('')

const viewModels = computed(() => {
  const sorted = [...letters.value].sort((a, b) => {
    const ap = a.isPinned ? 1 : 0
    const bp = b.isPinned ? 1 : 0
    if (ap !== bp) return bp - ap

    const af = a.isFavorite ? 1 : 0
    const bf = b.isFavorite ? 1 : 0
    if (af !== bf) return bf - af

    return (b.createdAt || 0) - (a.createdAt || 0)
  })

  return sorted.map((l) => ({
    id: l.id,
    moodLabel: moodLabel(l.mood),
    preview: (l.content || '').trim().slice(0, 60) || '（空）',
    createdAtText: formatDateTime(l.createdAt),
    status: l.status,
    replyId: l.replyId,
    replyDueAt: l.replyDueAt,
    isPinned: !!l.isPinned,
    isFavorite: !!l.isFavorite,
    content: l.content || '',
  }))
})

async function reload() {
  isLoading.value = true
  try {
    letters.value = await listLetters()
  } finally {
    isLoading.value = false
  }
}

async function handleTogglePin(id) {
  await togglePin(id)
  await reload()
}

async function handleToggleFavorite(id) {
  await toggleFavorite(id)
  await reload()
}

async function handleDelete(id) {
  if (!confirm('确定要删除这封信吗？（对应回信也会被删除）')) return
  await deleteLetter(id)
  await reload()
}

function startEdit(l) {
  editingId.value = l.id
  editingText.value = l.content
}

async function saveEdit() {
  if (!editingId.value) return
  await updateLetter(editingId.value, { content: editingText.value })
  editingId.value = null
  await reload()
}

onMounted(async () => {
  await reload()
})
</script>

<template>
  <main class="mx-auto w-full max-w-3xl px-6 pb-24 pt-16 sm:px-10 sm:pt-20">
    <header class="mb-12 flex items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-4 mb-6">
          <button 
            @click="$router.push('/')"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-handbook-ink/40 transition-all hover:bg-white/60 hover:text-handbook-ink shadow-sm ring-1 ring-black/5 active:scale-90"
          >
            <ArrowLeft class="h-5 w-5" />
          </button>
          <div class="text-[11px] font-bold tracking-[0.2em] text-handbook-ink/30 uppercase">Your Inbox</div>
        </div>
        <h1 class="text-3xl font-semibold tracking-tight text-handbook-ink sm:text-4xl">你的投递与回信</h1>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="reload"
          :class="{ 'animate-spin': isLoading }"
          class="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 text-handbook-ink/40 transition-all hover:bg-white/60 hover:text-handbook-ink shadow-sm ring-1 ring-black/5"
        >
          <RefreshCw class="h-5 w-5" />
        </button>
        <PrimaryButton to="/write" size="md" class="!px-6">
          <Plus class="h-5 w-5 mr-1" />
          <span>写信</span>
        </PrimaryButton>
      </div>
    </header>

    <section class="grid gap-6">
      <div v-if="viewModels.length === 0" class="handbook-card !p-12 text-center">
        <div class="text-xl font-semibold text-handbook-ink/80">还没有信件</div>
        <div class="mt-3 text-sm text-handbook-ink/40 leading-relaxed">
          从第一封开始，我们就慢慢把心情放好。
        </div>
        <div class="mt-10">
          <PrimaryButton to="/write" size="lg">写第一封</PrimaryButton>
        </div>
      </div>

      <div
        v-for="l in viewModels"
        :key="l.id"
        class="group relative"
      >
        <RouterLink
          :to="`/letter/${l.id}`"
          class="handbook-card handbook-card-hover block !p-8"
          :class="{ 'ring-2 ring-handbook-sage/30': l.isPinned }"
        >
          <div class="flex items-start justify-between gap-6">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-3 text-[11px] font-bold tracking-widest text-handbook-ink/30 uppercase mb-3">
                <div v-if="l.isPinned" class="flex items-center gap-1 text-handbook-sage">
                  <Pin class="h-3 w-3 fill-current" />
                  <span>PINNED</span>
                </div>
                <div v-if="l.isFavorite" class="flex items-center gap-1 text-handbook-coral">
                  <Heart class="h-3 w-3 fill-current" />
                  <span>FAVORITE</span>
                </div>
                <span>{{ l.moodLabel }}</span>
              </div>
              
              <div v-if="editingId === l.id" class="mt-2" @click.prevent>
                <textarea
                  v-model="editingText"
                  rows="3"
                  class="w-full rounded-2xl bg-black/[0.03] p-4 text-sm leading-relaxed outline-none ring-1 ring-black/5 focus:ring-handbook-sage/40"
                />
                <div class="mt-3 flex justify-end gap-3">
                  <button class="text-xs font-bold text-handbook-ink/30 hover:text-handbook-ink transition" @click="editingId = null">取消</button>
                  <button class="text-xs font-bold text-handbook-sage hover:brightness-90 transition" @click="saveEdit">保存变更</button>
                </div>
              </div>
              <div v-else class="text-lg font-semibold text-handbook-ink leading-snug line-clamp-1">
                {{ l.preview }}
              </div>
              
              <div class="mt-4 text-[10px] font-bold tracking-wider text-handbook-ink/20 uppercase">
                {{ l.createdAtText }}
              </div>
            </div>

            <div class="flex flex-col items-end gap-4">
              <div
                class="shrink-0 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase shadow-sm ring-1"
                :class="l.status === LetterStatus.replied 
                  ? 'bg-handbook-sage/10 text-handbook-sage ring-handbook-sage/20' 
                  : 'bg-black/5 text-handbook-ink/30 ring-black/5'"
              >
                {{ l.status === LetterStatus.replied ? 'Replied' : 'Pending' }}
              </div>

              <!-- 悬浮操作区 -->
              <div class="flex items-center gap-1 opacity-0 transition-all duration-500 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0" @click.prevent>
                <button
                  class="rounded-full p-2.5 hover:bg-white/60 transition-all active:scale-90"
                  @click="handleTogglePin(l.id)"
                >
                  <Pin class="h-4 w-4" :class="l.isPinned ? 'text-handbook-sage fill-current' : 'text-handbook-ink/20'" />
                </button>
                <button
                  class="rounded-full p-2.5 hover:bg-white/60 transition-all active:scale-90"
                  @click="handleToggleFavorite(l.id)"
                >
                  <Heart class="h-4 w-4" :class="l.isFavorite ? 'text-handbook-coral fill-current' : 'text-handbook-ink/20'" />
                </button>
                <button
                  class="rounded-full p-2.5 hover:bg-white/60 transition-all active:scale-90"
                  @click="startEdit(l)"
                >
                  <PencilLine class="h-4 w-4 text-handbook-ink/20" />
                </button>
                <button
                  class="rounded-full p-2.5 hover:bg-red-50 transition-all active:scale-90"
                  @click="handleDelete(l.id)"
                >
                  <Trash2 class="h-4 w-4 text-handbook-coral/40 hover:text-handbook-coral" />
                </button>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.group:hover .handbook-card {
  background: rgba(255, 255, 255, 0.55);
}
</style>

