<script setup>
const props = defineProps({
  as: { type: String, default: 'div' },
  hover: { type: Boolean, default: false },
})
</script>

<template>
  <component
    :is="props.as"
    :class="[
      'handbook-card',
      props.hover ? 'handbook-card-hover' : null,
    ]"
  >
    <slot />
  </component>
</template>
