<script setup>
import PaperCard from '../components/PaperCard.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import { Heart, Mail, PenLine, Sparkles, Settings } from 'lucide-vue-next'

const quote = {
  title: '今天也辛苦你了',
  body: '把心里那团乱线写下来，我们一起慢慢理顺。',
}
</script>

<template>
  <main class="mx-auto w-full max-w-4xl px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
    <!-- 顶部状态栏 -->
    <header class="mb-16 flex items-start justify-between">
      <div class="fade-up">
        <div class="inline-flex items-center gap-2.5 rounded-full bg-white/50 px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-handbook-ink/40 shadow-sm ring-1 ring-black/5">
          <Sparkles class="h-3.5 w-3.5 text-handbook-sage" />
          <span>CURATIVE · OFFLINE · PRIVATE</span>
        </div>

        <h1 class="mt-8 text-4xl font-semibold tracking-tight text-handbook-ink sm:text-6xl">
          解忧杂货铺
        </h1>
        <p class="mt-6 max-w-md text-base leading-relaxed text-handbook-ink/50 sm:text-lg">
          把烦恼写下来，像把纸折好。你不用立刻变好，我们慢慢来。
        </p>
      </div>

      <button 
        @click="$router.push('/settings')"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-white/40 text-handbook-ink/40 transition-all hover:bg-white/60 hover:text-handbook-ink shadow-sm ring-1 ring-black/5 active:scale-90"
      >
        <Settings class="h-5 w-5" />
      </button>
    </header>

    <section class="grid gap-8">
      <!-- 核心创作入口 -->
      <div class="handbook-card group relative !p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <div class="flex-1 p-10 md:p-14">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-handbook-ink/5 text-handbook-ink mb-8">
              <PenLine class="h-7 w-7" />
            </div>
            
            <h2 class="text-2xl font-semibold text-handbook-ink">{{ quote.title }}</h2>
            <p class="mt-3 text-base text-handbook-ink/50 leading-relaxed max-w-sm">
              {{ quote.body }}
            </p>

            <div class="mt-10 flex flex-col gap-4 sm:flex-row">
              <PrimaryButton to="/write" size="lg">
                写一封信
              </PrimaryButton>
              <PrimaryButton to="/inbox" variant="ghost" size="lg">
                去信箱
              </PrimaryButton>
            </div>
          </div>
          
          <!-- 装饰艺术区 -->
          <div class="hidden md:flex w-72 bg-gradient-to-br from-handbook-sage/10 to-handbook-paper items-center justify-center border-l border-white/40">
            <Mail class="h-20 w-20 text-handbook-ink/5 rotate-[-12deg] group-hover:rotate-0 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <!-- 次要功能栅格 -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <PaperCard class="!p-8 !rounded-[2.5rem]">
          <div class="flex items-start gap-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-handbook-paper text-handbook-ink/30 shadow-inner">
              <Mail class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-bold tracking-wide text-handbook-ink/80">最近投递</div>
              <div class="mt-1 text-sm text-handbook-ink/40">在这里查看等待的时间</div>
            </div>
          </div>
        </PaperCard>

        <PaperCard class="!p-8 !rounded-[2.5rem]">
          <div class="flex items-start gap-5">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-handbook-paper text-handbook-ink/30 shadow-inner">
              <Heart class="h-5 w-5" />
            </div>
            <div>
              <div class="text-sm font-bold tracking-wide text-handbook-ink/80">收藏回信</div>
              <div class="mt-1 text-sm text-handbook-ink/40">珍藏那些温暖的瞬间</div>
            </div>
          </div>
        </PaperCard>
      </div>

      <!-- 页脚声明 -->
      <div class="mt-12 text-center">
        <div class="inline-block h-px w-12 bg-handbook-ink/10 mb-6"></div>
        <p class="text-[10px] font-bold tracking-[0.3em] text-handbook-ink/20 uppercase">
          ZGCHOU.GITHUB.IO · 2024
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.fade-up {
  animation: fadeUp 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
