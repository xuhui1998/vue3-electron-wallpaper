<template>
  <div class="tabs">
    <div class="tabs-nav-wrap">
      <div
        v-for="item in paneItems"
        :key="item.title"
        :class="['tabs-btn', { 'tabs-btn-active': active === item.title }]"
        @click="tabsClick(item)"
      >
        {{ item.title }}
      </div>
      <div class="tabs-inv-bar" :style="barStyle"></div>
    </div>
    <!-- 内容区域 -->
    <div ref="main">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, computed, nextTick } from 'vue'

const paneItems = ref([])
const main = ref()
const active = ref()
const barWidth = ref<number>(0)
const barOffset = ref<number>(0)
provide('active', active)

const emits = defineEmits<{
  (e: 'tabClick', value: string): void
}>()

const barStyle = computed(() => {
  return {
    width: `${barWidth.value}px`,
    left: `${barOffset.value + 16}px` 
  }
})

const initTabs = () => {
  let panes = [...main.value.children]
  panes.forEach((node) => {
    paneItems.value.push({
      title: node.dataset.title,
      key: node.dataset.key
    })
  })
  active.value = paneItems.value[0].title
}

const tabsClick = (item) => {
  console.log(item)
  active.value = item.title
  updateTabBar()
  emits('tabClick', item.key)
}

const updateTabBar = () => {
  nextTick(() => {
    const index = paneItems.value.findIndex((item) => item.title === active.value)
    const elemTabs = document.querySelectorAll('.tabs-btn')
    const elemTab = elemTabs[index]
    barWidth.value = elemTab ? elemTab.offsetWidth : 0
    if (index > 0) {
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += elemTabs[i].offsetWidth + 32
      }
      barOffset.value = offset
    } else {
      barOffset.value = 0
    }
  })
}

onMounted(() => {
  initTabs()
  updateTabBar()
})
</script>

<style lang="less" scoped>
.tabs {
  .tabs-nav-wrap {
    // border-bottom: 1px solid #dcdee2;
    display: flex;
    position: relative;
  }
  .tabs-btn {
    position: relative;
    display: inline-block;
    margin: 0 16px;
    padding: 8px 0;
    cursor: pointer;
  }
  .tabs-inv-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #6078ea;
    height: 2px;
    transition: all 300ms ease-in-out;
  }
  .tabs-btn:hover {
    color: #6078ea;
  }
  .tabs-btn-active {
    color: #6078ea;
  }
}
</style>
