<script setup>
import PaperCard from '../components/PaperCard.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import { Heart, Mail, PenLine, Sparkles, Settings, ArrowRight } from 'lucide-vue-next'

const quote = {
  title: '此刻，写给未来的自己',
  body: '把心事折成纸飞机，投递进岁月的缝隙。这里没有喧嚣，只有最真实的你。',
}
</script>

<template>
  <main class="mx-auto w-full max-w-5xl px-6 pb-24 pt-16 sm:px-10 sm:pt-32">
    <!-- 顶部状态栏：极致白浮动设计 -->
    <header class="mb-28 flex items-start justify-between">
      <div class="fade-up">
        <div class="inline-flex items-center gap-3 rounded-full bg-white/60 px-6 py-2.5 text-[10px] font-medium tracking-[0.3em] text-[#121212]/40 backdrop-blur-3xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <Sparkles class="h-3.5 w-3.5 text-handbook-sage" />
          <span class="uppercase">Pure · Essential · Private</span>
        </div>

        <h1 class="mt-14 text-7xl font-extralight tracking-tight text-[#121212] sm:text-9xl leading-[1]">
          解忧<span class="font-serif italic text-[#121212]/10 ml-4">杂货铺</span>
        </h1>
        <p class="mt-12 max-w-lg text-lg leading-relaxed text-[#121212]/30 font-light tracking-wide">
          在纯净的留白中，听见内心的回响。这里只有光，和你。
        </p>
      </div>

      <button 
        @click="$router.push('/settings')"
        class="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white/80 text-[#121212]/20 transition-all duration-700 hover:text-[#121212] hover:shadow-xl border border-white active:scale-95"
      >
        <Settings class="h-6 w-6 transition-transform duration-1000 group-hover:rotate-180" />
      </button>
    </header>

    <section class="grid gap-16">
      <!-- 核心入口：极致白沉浸设计 -->
      <div class="group relative handbook-card !p-0 border-white bg-white/80 overflow-visible shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)]">
        <div class="relative z-10 flex flex-col lg:flex-row min-h-[520px]">
          <div class="flex-1 p-16 md:p-24 flex flex-col justify-center">
            <div class="mb-14">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#121212] text-white shadow-xl transition-all duration-700 group-hover:scale-110">
                <PenLine class="h-7 w-7" />
              </div>
            </div>
            
            <h2 class="text-5xl font-extralight text-[#121212] tracking-tighter sm:text-6xl">
              {{ quote.title }}
            </h2>
            <p class="mt-10 text-lg text-[#121212]/40 leading-relaxed max-w-md font-light tracking-wide">
              {{ quote.body }}
            </p>

            <div class="mt-16 flex flex-col gap-8 sm:flex-row">
              <PrimaryButton to="/write" size="lg" class="!bg-[#121212] !text-white !px-12 hover:shadow-2xl transition-all duration-500">
                开启书写
              </PrimaryButton>
              <PrimaryButton to="/inbox" variant="ghost" size="lg" class="!bg-transparent !border-none group/btn !text-[#121212]/40 hover:!text-[#121212]">
                <span>进入信箱</span>
                <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
              </PrimaryButton>
            </div>
          </div>
          
          <!-- 艺术展示区：极致极简 -->
          <div class="hidden lg:flex w-[450px] bg-white/20 items-center justify-center border-l border-white/40 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-tr from-white to-transparent opacity-50"></div>
            <Mail class="h-28 w-28 text-[#121212]/5 transition-all duration-1000 group-hover:scale-125 group-hover:opacity-10" />
            <div class="absolute bottom-16 right-16">
              <div class="text-[9px] font-medium tracking-[0.6em] text-[#121212]/10 uppercase">Essential Living</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 次要功能：线性呼吸感设计 -->
      <div class="grid grid-cols-1 gap-12 sm:grid-cols-2">
        <router-link to="/inbox" class="group handbook-card !p-14 !rounded-[2rem] bg-white/40 hover:bg-white border-white shadow-none hover:shadow-2xl transition-all duration-700">
          <div class="flex flex-col gap-10">
            <div class="flex h-12 w-12 items-center justify-center rounded-full border border-[#121212]/5 text-[#121212]/20 group-hover:bg-[#121212] group-hover:text-white transition-all duration-500">
              <Mail class="h-5 w-5" />
            </div>
            <div>
              <div class="text-xs font-semibold tracking-[0.3em] text-[#121212]/60 uppercase">最近投递</div>
              <div class="mt-4 text-base text-[#121212]/30 font-light leading-relaxed">
                时间在白纸上留下的，是成长的刻痕。
              </div>
            </div>
          </div>
        </router-link>

        <router-link to="/inbox" class="group handbook-card !p-14 !rounded-[2rem] bg-white/40 hover:bg-white border-white shadow-none hover:shadow-2xl transition-all duration-700">
          <div class="flex flex-col gap-10">
            <div class="flex h-12 w-12 items-center justify-center rounded-full border border-[#121212]/5 text-[#121212]/20 group-hover:bg-[#121212] group-hover:text-white transition-all duration-500">
              <Heart class="h-5 w-5" />
            </div>
            <div>
              <div class="text-xs font-semibold tracking-[0.3em] text-[#121212]/60 uppercase">收藏回信</div>
              <div class="mt-4 text-base text-[#121212]/30 font-light leading-relaxed">
                被温柔收藏的，不仅仅是文字，更是灵魂。
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- 页脚：品牌调性强化 -->
      <footer class="mt-20 text-center pb-12">
        <div class="inline-block h-px w-24 bg-gradient-to-r from-transparent via-[#1a1c1e]/10 to-transparent mb-10"></div>
        <p class="text-[10px] font-medium tracking-[0.5em] text-[#1a1c1e]/20 uppercase">
          DeYou · Curative Space · Mindful Living
        </p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.fade-up {
  animation: fadeUp 1.4s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 隐藏滚动条但保留滚动功能 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

<style scoped>
.fade-up {
  animation: fadeUp 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
