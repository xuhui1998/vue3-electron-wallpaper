<template>
  <div class="container">
    <header>
      <span class="title pl-10">精选壁纸</span>
      <SvgIcon class="menu-icon" icon-class="menu" @click="drawerMenu.open()" :size="24" />
      <div class="search-box">
        <input class="search-input" placeholder="请输入关键词" />
      </div>
      <div class="tabs">
        <Tabs v-model="state.activeKey" @tabClick="handleTabClick">
          <TabPane :tab-key="1" title="推荐"></TabPane>
          <TabPane :tab-key="2" title="壁纸库"></TabPane>
        </Tabs>
      </div>
    </header>
    <Drawer ref="drawerMenu" title="分类" :width="360">
      <template #content>
        <div class="category-list flex">
          <div
            class="category-item"
            v-for="item in state.categoryList"
            :key="item.old_id"
            @click="handleCategoryClick(item)"
          >
            <img class="category-item-cover" :src="item.icon" :alt="item.category" />
          </div>
        </div>
      </template>
    </Drawer>
    <div v-show="state.activeKey === 1" class="recommend-list" @scroll="checkScroll">
      <Waterfall
        ref="WaterfallRef"
        :images="state.wallpaperList"
        :border-radius="4"
        :column-gap="8"
        :width="state.screenWidth"
        @set-wallpaper="setWallpaper"
      />
    </div>
    <div v-show="state.activeKey === 2">
      <Waterfall
        v-if="state.wallpaperStore.length"
        ref="WaterfallRef"
        :images="state.wallpaperStore"
        :border-radius="4"
        :column-gap="8"
        :width="state.screenWidth"
        @set-wallpaper="setWallpaper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive, defineAsyncComponent, onMounted, nextTick } from 'vue'
import { wallpaperList, wallpaperSort, wallpaperSortDetail } from '@/api'
import { throttle } from 'lodash'
import type { WallpaperListItem, CategoryListItem, CategoryDetailList } from '@/types'

const Waterfall = defineAsyncComponent(() => import('@/components/water-fall/index.vue'))

const WaterfallRef = shallowRef()
const drawerMenu = ref()
const state = reactive({
  wallpaperList: [] as WallpaperListItem[],
  wallpaperStore: [] as CategoryDetailList[],
  screenWidth: (window.innerWidth - 15) as string | number,
  screenHeight: (window.innerHeight + 'px') as string | number,
  pageInfo: {
    pageno: 1,
    count: 18
  },
  storePageInfo: {
    pageno: 1,
    count: 18
  },
  noMore: false,
  categoryList: [],
  drawerVisible: false,
  activeKey: 1
})

/**
 * 获取推荐页壁纸
 * @param load 是否加载更多
 */
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

/**
 * 获取壁纸库壁纸
 * @param load 是否加载更多
 */
const getWallpaperStoreList = async (cid: string, load = false) => {
  try {
    if (load) {
      state.storePageInfo.pageno += 1
      const { data } = await wallpaperSortDetail({ ...state.storePageInfo, cids: cid })
      if (data.list.length === 0) {
        state.noMore = true
        return
      }
      state.wallpaperStore = [...state.wallpaperStore, ...data.list]
      return
    }
    const { data } = await wallpaperSortDetail({ ...state.storePageInfo, cids: cid })
    state.wallpaperStore = data.list.map((item) => {
      return {
        ...item,
        src: item.url
      }
    })
  } catch {
    console.log('fetch error')
  }
}

const handleTabClick = (key: number) => {
  state.activeKey = key
}

const getCategory = async () => {
  try {
    const { data } = await wallpaperSort()
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
}, 200)

const handleResize = () => {
  state.screenWidth = window.innerWidth - 15
  state.screenHeight = window.innerHeight + 'px'
}

const handleCategoryClick = (item: CategoryListItem) => {
  state.activeKey = 2
  state.wallpaperStore = []
  getWallpaperStoreList(item.old_id)
  drawerMenu.value.close()
}

/**
 * 设置壁纸
 * @param url 图片地址
 */
const setWallpaper = (url: string) => {
  window.electronAPI.setWallpaper(url)
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
    height: 50px;
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
    .search-box {
      position: absolute;
      right: 80px;
      top: 6px;
      padding: 4px 10px;
      border-radius: 18px;
      color: #000000e0;
      line-height: 1.5;
      background-color: #fff;
      border: 1px solid #d9d9d9;
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }
    .search-box:focus-within {
      border-color: #4096ff;
      box-shadow: 0 0 0 2px #0591ff1a;
      border-inline-end-width: 1px;
      outline: 0;
      width: 200px;
      transition: all 5s;
    }
    .search-input {
      font-size: 13px;
      line-height: 1.5;
      min-width: 0;
      background-color: #fff;
      border: none;
      outline: none;
      text-overflow: ellipsis;
      transition: all 0.2s;
    }
    .tabs {
      width: 200px;
      position: absolute;
      top: 0;
      left: 70px;
    }
  }
  .nav {
    width: 150px;
    height: 100%;
    position: fixed;
    left: 0;
  }
  .category-list {
    flex-wrap: wrap;
    gap: 5px;
    .category-item {
      width: calc(50% - 5px);
      cursor: pointer;
      .category-item-cover {
        width: 100%;
        height: 100%;
      }
    }
  }
  .recommend-list {
    height: calc(100% - 50px);
    overflow: auto;
  }
}
</style>
