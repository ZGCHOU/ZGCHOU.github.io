<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check } from 'lucide-vue-next'

import PrimaryButton from '../components/PrimaryButton.vue'
import { getLetter } from '../lib/db'

const route = useRoute()
const router = useRouter()

const id = computed(() => String(route.params.id || ''))

const letter = ref(null)
const isLoading = ref(false)

const phase = ref('init')
const isFlapClosed = computed(() => ['close', 'stamp', 'fly', 'done'].includes(phase.value))
const isStamped = computed(() => ['stamp', 'fly', 'done'].includes(phase.value))
const isFlying = computed(() => phase.value === 'fly')

async function reload() {
  isLoading.value = true
  try {
    letter.value = await getLetter(id.value)
  } finally {
    isLoading.value = false
  }
}

function startSequence() {
  // 初始状态为 init (对应 CSS 中的打开状态)
  // 1. 等待一下让用户看清“信件已折好”
  window.setTimeout(() => {
    phase.value = 'close' // 开始合拢
  }, 800)
  
  window.setTimeout(() => {
    phase.value = 'stamp' // 盖章
  }, 1800)
  
  window.setTimeout(() => {
    phase.value = 'fly' // 飞走
  }, 2800)
  
  window.setTimeout(() => {
    phase.value = 'done' // 完成
  }, 4000)
}

function goLetter() {
  router.push(`/letter/${id.value}`)
}

function goInbox() {
  router.push('/inbox')
}

onMounted(async () => {
  await reload()
  startSequence()
})
</script>

<template>
  <main class="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-8">
      <div class="text-sm text-handbook-ink/60">投递仪式</div>
      <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">把它交给时间</h1>
      <div class="mt-2 text-sm text-handbook-ink/60">
        <span v-if="!letter">正在确认你的信件…</span>
        <span v-else>我们会在合适的时候，把回信交到你手里。</span>
      </div>
    </header>

    <section class="handbook-card">
      <div class="flex flex-col items-center justify-center gap-8">
        <div class="envelope-wrapper">
          <div class="envelope" :class="isFlying ? 'animate-fly-away' : ''">
            <div class="envelope-flap" :class="isFlapClosed ? 'is-closed' : ''" />
            <div class="seal" :class="isStamped ? 'is-stamped' : ''">
              <Check v-if="phase === 'done'" class="h-5 w-5" />
            </div>
          </div>
        </div>

        <div class="text-center">
          <div class="text-lg font-semibold">
            <span v-if="phase === 'init'">准备投递…</span>
            <span v-else-if="phase === 'open'">把信折好</span>
            <span v-else-if="phase === 'close'">封口</span>
            <span v-else-if="phase === 'stamp'">盖上火漆印</span>
            <span v-else-if="phase === 'fly'">投递中…</span>
            <span v-else>已投递</span>
          </div>
          <div class="mt-2 text-sm text-handbook-ink/60">你可以稍后在信箱查看状态。</div>
        </div>

        <div class="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <PrimaryButton size="lg" :disabled="phase !== 'done'" @click="goLetter">查看这封信</PrimaryButton>
          <PrimaryButton variant="ghost" size="lg" :disabled="phase !== 'done'" @click="goInbox">去信箱</PrimaryButton>
        </div>
      </div>
    </section>
  </main>
</template>

