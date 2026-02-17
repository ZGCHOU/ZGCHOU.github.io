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
      'inline-flex items-center justify-center rounded-full font-medium tracking-wider transition-all duration-500 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-[#1a1c1e] text-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5': props.variant === 'primary',
        'bg-white/10 text-[#1a1c1e] backdrop-blur-md border border-white/20 hover:bg-white/20 shadow-sm': props.variant === 'ghost',
        'border border-[#1a1c1e]/10 text-[#1a1c1e] hover:bg-[#1a1c1e]/5': props.variant === 'outline',
      },
      {
        'px-5 py-2 text-xs uppercase': props.size === 'sm',
        'px-8 py-3.5 text-sm': props.size === 'md',
        'px-12 py-5 text-base': props.size === 'lg',
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
