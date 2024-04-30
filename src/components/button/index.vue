<template>
  <button :class="['btn', `btn-${type}`, `btn-${size}`, `btn-${shape}`]" :disabled="disabled" @click="onClick">
    <slot />
    <!-- 默认的插槽用于传递内容 -->
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

type TypeProps = 'primary' | 'secondary' | 'danger' | 'text'
type SizeProps = 'small' | 'normal' | 'large'
type ShapeProps = 'circle' | 'square' | 'round'
const props = withDefaults(
  defineProps<{
    type?: TypeProps
    disabled?: boolean
    size?: SizeProps
    shape?: ShapeProps
  }>(),
  {
    type: 'primary',
    size: 'normal',
    shape: 'square',
  }
)

// 定义组件的事件
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 定义点击事件的方法
const onClick = (event) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event) // 触发 click 事件
}
</script>

<style lang="less" scoped>
@import '@/assets/style/common.less';
.btn {
  border: none;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: #fff;
}
.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}
.btn-danger {
  background-color: #dc3545;
  color: #fff;
}
.btn-text {
  background-color: transparent;
  color: #4d5869;
}
.btn-text:hover {
  background-color: #f2f3f5;
}
.btn-text:active {
  background-color: #e5e6eb;
}
.btn-small {
  font-size: 14px;
  height: 24px;
  padding: 0 7px;
  border-radius: 4px;
}
.btn-normal {
  font-size: 14px;
  height: 32px;
  padding: 4px 15px;
  border-radius: 6px;
}
.btn-large {
  font-size: 16px;
  height: 40px;
  padding: 6px 15px;
  border-radius: 8px;
}
.btn-circle {
  border-radius: 50%;
}
.btn-small.btn-circle {
  width: 24px;
  height: 24px;
  &:extend(.flex-center);
}
.btn-normal.btn-circle {
  width: 32px;
  height: 32px;
  &:extend(.flex-center);
}
.btn-large.btn-circle {
  width: 40px;
  height: 40px;
  &:extend(.flex-center);
}
.btn-small.btn-round {
  border-radius: 12px;
}
.btn-normal.btn-round {
  border-radius: 18px;
}
.btn-large.btn-round {
  border-radius: 20px;
}
.btn-c
[disabled] {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>
