<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <!-- 高级感背景装饰层 -->
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-handbook-sage/10 blur-[120px] animate-pulse"></div>
      <div class="absolute top-[20%] -right-[5%] w-[35%] h-[35%] rounded-full bg-handbook-coral/10 blur-[100px] animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute -bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-handbook-sky/10 blur-[130px] animate-pulse" style="animation-delay: 4s"></div>
    </div>

    <!-- 主视图容器 -->
    <main class="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <RouterView v-slot="{ Component }">
        <transition
          name="premium-fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
/* 升级转场动画：位移 + 缩放 + 透明度 */
.premium-fade-enter-active,
.premium-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.premium-fade-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.premium-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}

/* 自定义滚动条样式，提升细节感 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
