<template>
  <div class="container" @scroll="checkScroll">
    <header>
      <span class="title pl-10">精选壁纸</span>
      <SvgIcon class="menu-icon" icon-class="menu" @click="drawerMenu.open()" :size="24" />
      <div class="tabs">
        <Tabs @tabClick="handleTabClick">
          <TabPane key="1" title="推荐">推荐</TabPane>
          <TabPane key="2" title="壁纸库">壁纸库</TabPane>
        </Tabs>
      </div>
    </header>
    <Drawer ref="drawerMenu" title="分类" :width="360">
      <template #content>
        <div class="category-list flex">
          <div class="category-item" v-for="item in state.categoryList" :key="item.old_id">
            <img class="category-item-cover" :src="item.icon" :alt="item.category" />
          </div>
        </div>
      </template>
    </Drawer>
    <main class="wallpaper-list">
      <Waterfall
        ref="WaterfallRef"
        :images="state.wallpaperList"
        :border-radius="4"
        :column-gap="8"
        :width="state.screenWidth"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive, defineAsyncComponent, onMounted, nextTick } from 'vue'
import { wallpaperList, wallpaperSort } from '@/api'
import { throttle } from 'lodash'

const Waterfall = defineAsyncComponent(() => import('@/components/water-fall/index.vue'))

const WaterfallRef = shallowRef()
const drawerMenu = ref()
const state = reactive({
  wallpaperList: [],
  screenWidth: (window.innerWidth - 15) as string | number,
  screenHeight: (window.innerHeight + 'px') as string | number,
  pageInfo: {
    pageno: 1,
    count: 18
  },
  noMore: false,
  categoryList: [],
  drawerVisible: false,
  activeKey: ''
})

const getWallpaperList = async (load = false) => {
  try {
    if (load) {
      state.pageInfo.pageno += 1
      const { data } = await wallpaperList(state.pageInfo)
      if (data.list.length === 0) {
        state.noMore = true
        return
      }
      state.wallpaperList = [...state.wallpaperList, ...data.list]
      return
    }
    const { data } = await wallpaperList(state.pageInfo)
    state.wallpaperList = data.list.map((item) => {
      return {
        ...item,
        src: item.url
      }
    })
  } catch {
    console.log('fetch error')
  }
}

const handleTabClick = (key: string) => {
  console.log(key)
}

const getCategory = async () => {
  try {
    const { data } = await wallpaperSort({})
    state.categoryList = data
  } catch {
    console.log('fetch error')
  }
}

const checkScroll = throttle((event) => {
  const { scrollTop, offsetHeight, scrollHeight } = event.target

  if (scrollTop + offsetHeight >= scrollHeight - 5) {
    if (state.noMore) return
    getWallpaperList(true)
  }
}, 200) // 在这里，200ms 是节流的时间间隔

const handleResize = () => {
  state.screenWidth = window.innerWidth - 15
  state.screenHeight = window.innerHeight + 'px'
}

onMounted(() => {
  getWallpaperList()
  getCategory()

  // 监听窗口变化，自适应调整图片宽度
  nextTick(() => {
    window.addEventListener('resize', handleResize)
  })
})
</script>

<style lang="less" scoped>
.container {
  height: v-bind('state.screenHeight');
  overflow: auto;
  header {
    position: relative;
    .title {
      font-size: 24px;
      height: 36px;
      line-height: 36px;
      font-weight: 500;
      background-image: linear-gradient(135deg, #17ead9, #6078ea);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .menu-icon {
      position: absolute;
      right: 20px;
      top: 10px;
    }
  }
  .nav {
    width: 150px;
    height: 100%;
    position: fixed;
    left: 0;
  }
}
.category-list {
  flex-wrap: wrap;
  gap: 5px;
  .category-item {
    width: calc(50% - 5px);
    .category-item-cover {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
