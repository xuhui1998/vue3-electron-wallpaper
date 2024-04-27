<template>
  <div class="container padding-10">
    <header>
      <span class="title">每日壁纸</span>
    </header>
    <Waterfall
      ref="WaterfallRef"
      :images="state.wallpaperList"
      :border-radius="4"
      :column-gap="8"
      :width="state.screenWidth"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, reactive, defineAsyncComponent, onMounted, nextTick } from 'vue'
import { wallpaperList } from '@/api'

const Waterfall = defineAsyncComponent(() => import('@/components/water-fall.vue'))

const WaterfallRef = shallowRef()
const state = reactive({
  wallpaperList: [],
  screenWidth: '100%' as string | number,
  pageInfo: {
    pageno: 1,
    count: 18
  }
})

const getWallpaperList = async () => {
  const { data } = await wallpaperList(state.pageInfo)
  state.wallpaperList = data.list
}

const handleResize = () => {
  state.screenWidth = window.innerWidth - 15
}

onMounted(() => {
  getWallpaperList()

  // 监听窗口变化，自适应调整图片宽度
  nextTick(() => {
    window.addEventListener('resize', handleResize)
  })
})
</script>

<style lang="less" scoped>
.container {
  .title {
    font-size: 20px;
  }
  .title:hover {
    font-weight: bold;
  }
}
</style>
