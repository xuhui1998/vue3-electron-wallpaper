<template>
  <div class="drawer" :class="{ open: isOpen }">
    <div class="header">
      <div class="title">
        {{ title }}
        <slot name="title"></slot>
      </div>
      <Button class="btn-close" type="text" shape="circle" size="small">
        <SvgIcon icon-class="close" :size="16" @click="close" />
      </Button>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
  </div>
  <div v-if="isOpen" class="mask" @click.self="close"></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title?: string
  width?: number
}>()

// 设置一个响应式变量来控制抽屉的开关状态
const isOpen = ref(false)
const drawerWidth = computed(() => {
  if (typeof props.width === 'number') {
    return props.width + 'px'
  }
  return props.width
})

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

// 公开方法，以便能在组件的父级调用
defineExpose({ open, close })
</script>

<style lang="less" scoped>
@import url('@/assets/style/variables.less');
.drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: v-bind(drawerWidth);
  height: 100%;
  background-color: white;
  transition: right 0.5s ease;
  z-index: 100;
  .header {
    height: 44px;
    position: relative;
    border-bottom: 1px solid #f0f0f0;
    .title {
      font-size: 16px;
      font-weight: 600;
      line-height: 44px;
      padding-left: 10px;
      color: @color-text-2;
    }
    .btn-close {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.33);
}
.drawer.open {
  right: 0;
}
.content {
  padding: 20px;
  height: calc(100% - 44px);
  overflow: auto;
}
</style>
