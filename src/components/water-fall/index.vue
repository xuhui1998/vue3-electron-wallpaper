<template>
  <div
    class="m-waterfall"
    ref="waterfall"
    :style="`--borderRadius: ${borderRadius}px; background-color: ${backgroundColor}; width: ${totalWidth}; height: ${height}px;`"
  >
    <Spin
      v-for="(property, index) in imagesProperty"
      :key="property?.id"
      v-show="loaded[index] !== undefined"
      :class="['m-image', { 'm-image-active': property?.id === currentZoomImage }]"
      :style="`width: ${property?.width}px; height: ${property?.height}px; top: ${property && property.top}px; left: ${property && property.left}px;`"
      :spinning="!loaded[index]"
      size="small"
      indicator="dynamic-circle"
      @click="toggleZoom(property)"
    >
      <img class="u-image" :src="images[index].url" @load="onLoaded(index)" />
      <div class="tags text-center omit">{{ property?.tag }}</div>
    </Spin>
    <transition name="image-preview">
      <div v-if="currentZoomImage" class="image-preview" @click="toggleZoom(null)">
        <img :src="currentZoomImage.url" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, watch, watchPostEffect } from 'vue'
import { WallpaperListItem } from '@/types'

interface Props {
  images: WallpaperListItem[] // 图片数组
  columnCount?: number // 要划分的列数
  columnGap?: number // 各列之间的间隙，单位px
  width?: string | number // 瀑布流区域的总宽度
  borderRadius?: number // 瀑布流区域和图片圆角，单位px
  backgroundColor?: string // 瀑布流区域背景填充色
}
const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  columnCount: 3,
  columnGap: 20,
  width: '100%',
  borderRadius: 8,
  backgroundColor: '#FFFFFF'
})
const imagesProperty = ref<any[]>([])
const currentZoomImage = ref<WallpaperListItem | null>(null)
const preColumnHeight = ref<number[]>(Array(props.columnCount).fill(0)) // 每列的高度
const waterfall = shallowRef() // ref() 的浅层作用形式
const imageWidth = ref()
const totalWidth = computed(() => {
  if (typeof props.width === 'number') {
    return props.width + 'px'
  } else {
    return props.width
  }
})
const len = computed(() => {
  return props.images.length
})
const height = computed(() => {
  return Math.max(...preColumnHeight.value) + props.columnGap
})
const loaded = ref(Array(len.value)) // 图片是否加载完成
const rerender = ref(false)
const toggleZoom = (item: WallpaperListItem | null) => {
  currentZoomImage.value = item
}
watch(
  () => [props.columnCount, props.columnGap, props.width],
  () => {
    rerender.value = true
    preColumnHeight.value = Array(props.columnCount).fill(0)
    onPreload(len.value)
  },
  {
    deep: true, // 强制转成深层侦听器
    flush: 'post' // 在侦听器回调中访问被 Vue 更新之后的 DOM
  }
)
watchPostEffect(() => {
  // console.log(props.images)
  if (props.images.length) {
    onPreload(props.images.length)
  }
})
async function onPreload(imageLength?: number) {
  // 计算每列的图片宽度
  // const rect = waterfall.value.getBoundingClientRect()
  imageWidth.value = (waterfall.value.offsetWidth - (props.columnCount + 1) * props.columnGap) / props.columnCount
  const startIndex = imageLength - 18
  for (let i = startIndex; i < len.value; i++) {
    await loadImage(props.images[i], i)
  }
}
function loadImage(imageInfo: WallpaperListItem, n: number) {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageInfo.url
    image.onload = function () {
      // 图片加载完成时执行，此时可通过image.width和image.height获取到图片原始宽高
      if (!rerender.value) {
        loaded.value[n] = false
      }
      var height = image.height / (image.width / imageWidth.value)
      imagesProperty.value[n] = {
        // 存储图片宽高和位置信息
        width: imageWidth.value,
        height: height,
        ...imageInfo,
        ...getPosition(n, height)
      }
      resolve('load')
    }
  })
}
function getPosition(i: number, height: number) {
  // 获取图片位置信息（top，left）
  if (i < props.columnCount) {
    preColumnHeight.value[i] = props.columnGap + height
    return {
      top: props.columnGap,
      left: (imageWidth.value + props.columnGap) * i + props.columnGap
    }
  } else {
    const top = Math.min(...preColumnHeight.value)
    let index = 0
    for (let n = 0; n < props.columnCount; n++) {
      if (preColumnHeight.value[n] === top) {
        index = n
        break
      }
    }
    preColumnHeight.value[index] = top + props.columnGap + height
    return {
      top: top + props.columnGap,
      left: (imageWidth.value + props.columnGap) * index + props.columnGap
    }
  }
}
function onLoaded(index: number) {
  loaded.value[index] = true
}
</script>

<style lang="less" scoped>
.m-waterfall {
  position: relative;
  border-radius: var(--borderRadius);
  // flex-wrap: wrap;
  height: 100%;
  .m-image {
    // justify-content: center;
    // position: relative;
    position: absolute;
    .u-image {
      width: 100%;
      height: 100%;
      border-radius: var(--borderRadius);
      display: inline-block;
      vertical-align: bottom;
    }
    .tags {
      width: 100%;
      position: absolute;
      bottom: 0;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.33);
      font-size: 14px;
      line-height: 24px;
      height: 24px;
    }
  }
  .m-image:hover {
    transform: scale(1.02);
    transition: all 0.5s;
  }
  .m-image-active {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover; /* 或者 'contain' 保持比例 */
    z-index: 10;
  }
  .image-preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    inset: 0;
    transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
    img {
      width: 100%;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
    }
  }
  .image-preview-enter-active,
  .image-preview-leave-active {
    transition: opacity 0.5s;
  }

  .image-preview-enter-from,
  .image-preview-leave-to {
    opacity: 0;
  }
}
</style>
