<template>
  <div v-show="active == tabKey" :data-title="title" :data-key="tabKey" class="pane-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

defineProps<{
  title: string
  tabKey: number
}>()

const active = inject('active')
</script>
