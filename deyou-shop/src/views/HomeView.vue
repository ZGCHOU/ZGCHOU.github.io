<script setup>
import PaperCard from '../components/PaperCard.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import { Heart, Mail, PenLine, Sparkles } from 'lucide-vue-next'

const quote = {
  title: '今天也辛苦你了',
  body: '把心里那团乱线写下来，我们一起慢慢理顺。',
}
</script>

<template>
  <main class="mx-auto w-full max-w-2xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
    <header class="mb-10">
      <div class="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-handbook-ink/60 shadow-handbook ring-1 ring-black/5">
        <Sparkles class="h-4 w-4 text-handbook-accent" />
        <span>离线 · 私密 · 手帐</span>
      </div>

      <h1 class="mt-4 text-4xl font-semibold tracking-tight text-handbook-ink sm:text-5xl">
        解忧杂货铺
      </h1>
      <p class="mt-3 max-w-prose text-base leading-relaxed text-handbook-ink/60 sm:text-lg">
        把烦恼写下来，像把纸折好。你不用立刻变好，我们慢慢来。
      </p>
    </header>

    <section class="grid gap-5">
      <PaperCard>
        <div class="flex items-start gap-4">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-handbook-accent/10 text-handbook-accent">
            <PenLine class="h-6 w-6" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="text-lg font-semibold">{{ quote.title }}</div>
            <div class="mt-1 text-sm leading-relaxed text-handbook-ink/70">
              {{ quote.body }}
            </div>

            <div class="mt-4 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton to="/write" size="lg">
                写一封信
              </PrimaryButton>
              <PrimaryButton to="/inbox" variant="ghost" size="lg">
                去信箱
              </PrimaryButton>
            </div>
          </div>
        </div>
      </PaperCard>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PaperCard>
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-handbook-blue/10 text-handbook-blue">
              <Mail class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold">最近投递</div>
              <div class="mt-1 text-sm text-handbook-ink/60">还没有信件</div>
            </div>
          </div>
        </PaperCard>

        <PaperCard>
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-handbook-green/10 text-handbook-green">
              <Heart class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-semibold">收藏回信</div>
              <div class="mt-1 text-sm text-handbook-ink/60">还没有收藏</div>
            </div>
          </div>
        </PaperCard>
      </div>

      <div class="pt-2 text-center text-[11px] font-semibold tracking-[0.22em] text-handbook-ink/30">
        OFFLINE FIRST · NO ACCOUNT · NO CLOUD
      </div>
    </section>
  </main>
</template>
