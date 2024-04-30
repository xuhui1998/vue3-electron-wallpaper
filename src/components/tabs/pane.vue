<template>
  <div v-show="active === title" :data-title="title" :data-key="key" class="pane-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  title: string;
  key: string | number;
}>()
console.log(props);

const active = inject("active");
</script>
