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
      'inline-flex items-center justify-center rounded-handbook font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-gradient-to-b from-handbook-green/80 to-handbook-green text-white shadow-[0_10px_30px_-12px_rgba(168,191,161,0.9)] ring-1 ring-white/60 hover:brightness-[1.03]': props.variant === 'primary',
        'bg-transparent text-handbook-ink/80 hover:bg-black/5': props.variant === 'ghost',
        'border-2 border-handbook-accent/30 text-handbook-accent hover:bg-handbook-accent/5': props.variant === 'outline',
      },
      {
        'px-3 py-1.5 text-sm': props.size === 'sm',
        'px-5 py-2.5 text-base': props.size === 'md',
        'px-8 py-3.5 text-lg': props.size === 'lg',
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
