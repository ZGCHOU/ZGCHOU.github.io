<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const props = defineProps({
  to: { type: String, default: null },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
})

const classes = computed(() =>
  twMerge(
    clsx(
      'inline-flex items-center justify-center rounded-full font-semibold tracking-wide transition-all duration-500 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-handbook-ink text-handbook-paper shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.4)]': props.variant === 'primary',
        'bg-white/40 text-handbook-ink backdrop-blur-md ring-1 ring-black/5 hover:bg-white/60': props.variant === 'ghost',
        'border-2 border-handbook-ink/10 text-handbook-ink hover:bg-black/5': props.variant === 'outline',
      },
      {
        'px-4 py-2 text-sm': props.size === 'sm',
        'px-6 py-3 text-base': props.size === 'md',
        'px-10 py-4 text-lg': props.size === 'lg',
      }
    )
  )
)
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <button v-else :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
