<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Download, ShieldCheck, Upload } from 'lucide-vue-next'

import PrimaryButton from '../components/PrimaryButton.vue'
import { ensureDefaultSettings, getAllData, getSetting, importAllData, setSetting } from '../lib/db'

const router = useRouter()

const delayMin = ref('')
const delayMax = ref('')
const isSavingDelay = ref(false)

const pin = ref('')
const hasPin = ref(false)
const isSavingPin = ref(false)

const fileInput = ref(null)

async function loadSettings() {
  await ensureDefaultSettings()
  const min = await getSetting('devReplyDelayMinMs', 10000)
  const max = await getSetting('devReplyDelayMaxMs', 30000)
  delayMin.value = String(Math.round(min / 1000))
  delayMax.value = String(Math.round(max / 1000))

  const existingPin = await getSetting('pinCode', '')
  hasPin.value = !!existingPin
}

async function saveDelay() {
  const minSec = Number(delayMin.value) || 0
  const maxSec = Number(delayMax.value) || 0
  if (minSec <= 0 || maxSec <= 0 || maxSec < minSec) {
    alert('请填写合理的延迟区间（秒），且最大值不小于最小值。')
    return
  }

  isSavingDelay.value = true
  try {
    await setSetting('devReplyDelayMinMs', minSec * 1000)
    await setSetting('devReplyDelayMaxMs', maxSec * 1000)
    alert('已保存延迟区间')
  } finally {
    isSavingDelay.value = false
  }
}

async function savePin() {
  const trimmed = pin.value.trim()
  if (trimmed && trimmed.length < 4) {
    alert('密码至少需要 4 位')
    return
  }

  isSavingPin.value = true
  try {
    await setSetting('pinCode', trimmed)
    hasPin.value = !!trimmed
    pin.value = ''
    alert(trimmed ? '已设置解锁密码' : '已关闭解锁密码')
  } finally {
    isSavingPin.value = false
  }
}

async function handleExport() {
  try {
    const data = await getAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `deyou_backup_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  } catch (e) {
    alert(`导出失败：${e?.message || e}`)
  }
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleImport(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (!confirm('导入备份将覆盖当前所有信件和设置，确定继续吗？')) return

  const text = await file.text()
  try {
    const data = JSON.parse(text)
    await importAllData(data)
    alert('导入成功，即将刷新页面')
    window.location.reload()
  } catch (err) {
    alert(`导入失败：${err?.message || err}`)
  } finally {
    e.target.value = ''
  }
}

function goBack() {
  router.push('/inbox')
}

onMounted(async () => {
  await loadSettings()
})
</script>

<template>
  <main class="mx-auto w-full max-w-2xl px-5 pb-24 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-8 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-handbook-ink/60 shadow-sm ring-1 ring-black/5 transition hover:bg-white/80"
          @click="goBack"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>

        <div>
          <div class="text-sm text-handbook-ink/60">设置</div>
          <h1 class="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">偏好与安全</h1>
        </div>
      </div>
    </header>

    <section class="grid gap-6">
      <div class="handbook-card">
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-handbook-blue/10 text-handbook-blue">
            <Clock class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <div class="text-base font-semibold">回信延迟</div>
            <div class="mt-1 text-sm text-handbook-ink/60">设置「回信」的随机等待区间（秒）。</div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-2">
                <input
                  v-model="delayMin"
                  type="number"
                  min="1"
                  class="w-20 rounded-lg bg-black/5 px-3 py-2 text-center text-sm outline-none ring-1 ring-black/10 focus:ring-handbook-accent/30"
                />
                <span class="text-handbook-ink/40">~</span>
                <input
                  v-model="delayMax"
                  type="number"
                  min="1"
                  class="w-20 rounded-lg bg-black/5 px-3 py-2 text-center text-sm outline-none ring-1 ring-black/10 focus:ring-handbook-accent/30"
                />
                <span class="text-sm text-handbook-ink/60">秒</span>
              </div>
              <PrimaryButton size="sm" :disabled="isSavingDelay" @click="saveDelay">
                {{ isSavingDelay ? '保存中…' : '保存' }}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      <div class="handbook-card">
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-handbook-accent/10 text-handbook-accent">
            <ShieldCheck class="h-5 w-5" />
          </div>
          <div class="flex-1">
            <div class="text-base font-semibold">信箱锁（PIN）</div>
            <div class="mt-1 text-sm text-handbook-ink/60">设置本地解锁密码。清空后保存可关闭。</div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <input
                v-model="pin"
                type="password"
                maxlength="12"
                placeholder="输入 4-12 位密码"
                class="min-w-[220px] flex-1 rounded-lg bg-black/5 px-4 py-2 text-sm outline-none ring-1 ring-black/10 focus:ring-handbook-accent/30"
              />
              <PrimaryButton size="sm" :disabled="isSavingPin" @click="savePin">
                {{ isSavingPin ? '处理中…' : (hasPin ? '更新/关闭' : '开启') }}
              </PrimaryButton>
            </div>

            <div class="mt-2 text-xs" :class="hasPin ? 'text-handbook-green' : 'text-handbook-ink/40'">
              {{ hasPin ? '已开启密码保护' : '未开启密码保护' }}
            </div>
          </div>
        </div>
      </div>

      <div class="handbook-card">
        <div class="flex flex-col gap-5">
          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-handbook-ink/50">
              <Download class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <div class="text-base font-semibold">导出备份</div>
              <div class="mt-1 text-sm text-handbook-ink/60">导出所有信件/回信/设置为 JSON 文件。</div>
              <div class="mt-3">
                <PrimaryButton variant="ghost" size="sm" @click="handleExport">导出 JSON</PrimaryButton>
              </div>
            </div>
          </div>

          <div class="h-px w-full bg-black/5" />

          <div class="flex items-start gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-handbook-ink/50">
              <Upload class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <div class="text-base font-semibold">导入恢复</div>
              <div class="mt-1 text-sm text-handbook-ink/60">从备份 JSON 恢复（会覆盖当前数据）。</div>
              <div class="mt-3 flex items-center gap-3">
                <PrimaryButton variant="ghost" size="sm" @click="triggerImport">选择文件</PrimaryButton>
                <input ref="fileInput" class="hidden" type="file" accept="application/json,.json" @change="handleImport" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-2 text-center text-[11px] font-semibold tracking-[0.22em] text-handbook-ink/25">
        OFFLINE FIRST · NO ACCOUNT · NO CLOUD
      </div>
    </section>
  </main>
</template>
