<template>
  <div v-show="active === title" :data-title="title" :data-key="tabKey" class="pane-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  title: string;
  tabKey: string | number;
}>()

const active = inject("active");
</script>
