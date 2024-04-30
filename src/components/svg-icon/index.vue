<template>
  <svg
    class="svg-icon"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      color: color,
      ...style,
    }"
  >
    <use :xlink:href="`#${iconClass}`"></use>
  </svg>
</template>

<script lang="ts" setup>
  defineProps({
    // SVG 图标名称或在线URL
    iconClass: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 16,
    },
    color: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
    },
  });
</script>

<style lang="less" scoped>
  .svg-icon {
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
