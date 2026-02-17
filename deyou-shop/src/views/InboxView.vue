<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, Pin, Trash2, PencilLine } from 'lucide-vue-next'

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
  <main class="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-8 flex items-end justify-between gap-4">
      <div>
        <div class="text-sm text-handbook-ink/60">信箱</div>
        <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">你的投递与回信</h1>
      </div>
      <div class="flex gap-2">
        <PrimaryButton to="/settings" variant="ghost" size="md">设置</PrimaryButton>
        <PrimaryButton variant="ghost" size="md" :disabled="isLoading" @click="reload">刷新</PrimaryButton>
        <PrimaryButton to="/write" size="md">写信</PrimaryButton>
      </div>
    </header>

    <section class="grid gap-4">
      <div v-if="viewModels.length === 0" class="handbook-card">
        <div class="text-lg font-semibold">还没有信件</div>
        <div class="mt-1 text-sm text-handbook-ink/60">从第一封开始，我们就慢慢把心情放好。</div>
        <div class="mt-5">
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
          class="handbook-card handbook-card-hover block"
          :class="{ 'ring-2 ring-handbook-accent/20': l.isPinned }"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 text-sm text-handbook-ink/60">
                <Pin v-if="l.isPinned" class="h-3 w-3 text-handbook-accent" />
                <Heart v-if="l.isFavorite" class="h-3 w-3 text-handbook-red fill-current" />
                <span>{{ l.moodLabel }}</span>
              </div>
              
              <div v-if="editingId === l.id" class="mt-2" @click.prevent>
                <textarea
                  v-model="editingText"
                  rows="3"
                  class="w-full rounded-lg bg-black/5 p-3 text-sm outline-none ring-1 ring-black/10 focus:ring-handbook-accent/50"
                />
                <div class="mt-2 flex justify-end gap-2">
                  <button class="text-xs text-handbook-ink/50" @click="editingId = null">取消</button>
                  <button class="text-xs font-semibold text-handbook-accent" @click="saveEdit">保存</button>
                </div>
              </div>
              <div v-else class="mt-1 text-base font-semibold line-clamp-1">{{ l.preview }}</div>
              
              <div class="mt-2 text-xs text-handbook-ink/50">{{ l.createdAtText }}</div>
            </div>

            <div class="flex flex-col items-end gap-3">
              <div
                class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                :class="l.status === LetterStatus.replied ? 'bg-handbook-green/20 text-handbook-ink' : 'bg-black/5 text-handbook-ink/60'"
              >
                {{ l.status === LetterStatus.replied ? '已回信' : '等待中' }}
              </div>

              <!-- 操作区 -->
              <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100" @click.prevent>
                <button
                  class="rounded-full p-2 hover:bg-black/5 transition"
                  :title="l.isPinned ? '取消置顶' : '置顶'"
                  @click="handleTogglePin(l.id)"
                >
                  <Pin class="h-4 w-4" :class="l.isPinned ? 'text-handbook-accent fill-current' : 'text-handbook-ink/40'" />
                </button>
                <button
                  class="rounded-full p-2 hover:bg-black/5 transition"
                  :title="l.isFavorite ? '取消收藏' : '收藏'"
                  @click="handleToggleFavorite(l.id)"
                >
                  <Heart class="h-4 w-4" :class="l.isFavorite ? 'text-handbook-red fill-current' : 'text-handbook-ink/40'" />
                </button>
                <button
                  class="rounded-full p-2 hover:bg-black/5 transition"
                  title="编辑"
                  @click="startEdit(l)"
                >
                  <PencilLine class="h-4 w-4 text-handbook-ink/40" />
                </button>
                <button
                  class="rounded-full p-2 hover:bg-red-50 transition"
                  title="删除"
                  @click="handleDelete(l.id)"
                >
                  <Trash2 class="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
