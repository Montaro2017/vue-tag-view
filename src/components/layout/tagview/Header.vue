<template>
  <div class="tag-view-tags" @wheel="handleWheel">
    <div class="tag-view-tag-btn">
      <el-icon @mousedown="startScrollLeft" @mouseup="stopScroll">
        <CaretLeft />
      </el-icon>
    </div>
    <div class="tag-view-tags-wrapper" ref="tagViewTagsWrapper">
      <template v-for="tagView in tagViews">
        <div class="tag-view-tag" :ref="(el) => tagViewTagRefMap[tagView.key] = el"
          @mousedown="e => handleMouseDown(e, tagView)" @mouseup="e => handleMouseUp(e, tagView)"
          :class="{ closeable: tagView.closeable, active: tagView.key === currentTagView.key }" :title="tagView.title">
          <span class="tag-view-icon" v-if="tagView.icon">
            <el-icon>
              <Component :is="tagView.icon" />
            </el-icon>
          </span>
          <span class="tag-view-title">{{ tagView.title }}</span>
          <span class="tag-view-close" v-if="tagView.closeable" @mousedown.stop="handleCloseMouseDown(tagView)"
            @mouseup.stop="handleCloseMouseUp(tagView)">
            <el-icon>
              <Close />
            </el-icon>
          </span>
        </div>
      </template>
    </div>
    <div class="tag-view-tag-btn">
      <el-icon @mousedown="startScrollRight" @mouseup="stopScroll">
        <CaretRight />
      </el-icon>
    </div>
  </div>
</template>

<script setup>

import { storeToRefs } from 'pinia'
import { nextTick, ref, watch } from 'vue'
import { useTagViewStore } from "@/stores/tagView.js"
import { CaretLeft, CaretRight, Close } from '@element-plus/icons-vue'

defineOptions({
  name: 'TagViewHeader'
})

const tagViewStore = useTagViewStore()

const { close, open } = tagViewStore
const { tagViews, currentTagView } = storeToRefs(tagViewStore)

const closeMouseDown = ref(false)
const handleCloseMouseDown = (tagView) => {
  closeMouseDown.value = true
}

const handleCloseMouseUp = (tagView) => {
  if (closeMouseDown.value) {
    close(tagView)
  }
}

const tagViewTagsWrapper = ref()
const tagViewTagRefMap = ref({})

const handleWheel = async (e) => {
  const { deltaY } = e
  const nowScrollLeft = tagViewTagsWrapper.value.scrollLeft
  const scrollLeft = nowScrollLeft + deltaY
  await scrollAnimation(scrollLeft, 50)
}

const MOUSE_BUTTON = {
  LEFT: 0,
  MIDDLE: 1,
}

const tagButtonStatus = ref({})

const handleMouseDown = (e, tagView) => {
  const key = tagView.key
  const button = e.button
  tagButtonStatus.value[key] = button
  if (button === MOUSE_BUTTON.MIDDLE) {
    // 阻止变成可左右滚动的箭头
    e.preventDefault()
  }
}

const handleMouseUp = (e, tagView) => {
  const key = tagView.key
  const button = e.button
  if (button === tagButtonStatus.value[key]) {
    if (button === MOUSE_BUTTON.LEFT) {
      open(tagView)
    } else if (button === MOUSE_BUTTON.MIDDLE) {
      closeTagView(tagView)
    }
    e.preventDefault()
  }
  tagButtonStatus.value[key] = null
}

const scrollFlag = ref(false)

const startScrollLeft = async () => {
  stopScroll()
  await nextTick()
  const scroll = async () => {
    if (scrollFlag.value) {
      const key = currentTagView.value.key
      const width = tagViewTagRefMap.value[key].offsetWidth
      const nowScrollLeft = tagViewTagsWrapper.value.scrollLeft
      const scrollLeft = nowScrollLeft - width
      await scrollAnimation(scrollLeft)
      setTimeout(scroll, 70)
    }
  }
  scrollFlag.value = true
  await scroll()
}

const startScrollRight = async () => {
  stopScroll()
  await nextTick()
  const scroll = async () => {
    if (scrollFlag.value) {
      const key = currentTagView.value.key
      const width = tagViewTagRefMap.value[key].offsetWidth
      const nowScrollLeft = tagViewTagsWrapper.value.scrollLeft
      const scrollLeft = nowScrollLeft + width
      await scrollAnimation(scrollLeft)
      setTimeout(scroll, 70)
    }
  }
  scrollFlag.value = true
  await scroll()
}

const stopScroll = () => {
  scrollFlag.value = false
}

const scrollToCenter = async (key) => {
  await nextTick()
  const tag = tagViewTagRefMap.value[key]
  let scrollLeft = tag.offsetLeft - (tagViewTagsWrapper.value.offsetWidth / 2) - (tag.offsetWidth / 2)
  if (scrollLeft < 0) {
    scrollLeft = 0
  }
  await scrollAnimation(scrollLeft)
}

const scrollAnimation = (toScrollLeft, time = 200) => {
  return new Promise((resolve) => {
    const fromScrollLeft = tagViewTagsWrapper.value.scrollLeft
    const speed = (toScrollLeft - fromScrollLeft) / time
    let start, previousTimestamp;
    let done = false
    const step = (timestamp) => {
      if (start === undefined) {
        start = timestamp
      }
      const elapsed = timestamp - start
      if (previousTimestamp !== timestamp) {
        const scrollLeft = fromScrollLeft + elapsed * speed
        tagViewTagsWrapper.value.scrollTo(scrollLeft, 0)
        if (scrollLeft === toScrollLeft) {
          done = true
        }
      }
      if (elapsed < time) {
        previousTimestamp = timestamp
        if (!done) {
          window.requestAnimationFrame(step)
        }
      } else {
        tagViewTagsWrapper.value.scrollTo(toScrollLeft, 0)
        resolve()
      }
    }
    window.requestAnimationFrame(step)
  })
}

watch(currentTagView, () => {
  const key = currentTagView.value.key
  scrollToCenter(key)
}, { immediate: true })
</script>

<style scoped>
.tag-view-tags {
  display: flex;
  color: #000;
  padding: 8px;
  flex-shrink: 0;
  overflow: hidden;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--el-border-color);
}

.tag-view-tag-btn {
  padding: 0 4px;
  cursor: pointer;
  border-radius: 50%;
}

.tag-view-tag-btn:hover {
  color: #409EFF;
}

.tag-view-tags-wrapper {
  min-width: 0;
  display: flex;
  overflow-x: auto;
}

.tag-view-tags-wrapper {
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.tag-view-tag {
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
  flex-wrap: nowrap;
  white-space: nowrap;
  padding: 4px 16px;
  border-radius: 18px;
  display: inline-flex;
  transition: all .1s;
  align-items: center;
  border: 1px solid var(--el-border-color);
}

.tag-view-tag.closeable {
  padding-right: 12px;
}

.tag-view-tag.active {
  color: #FFF;
  background-color: #409EFF;
}

.tag-view-tag+.tag-view-tag {
  margin-left: 8px;
}

.tag-view-icon {
  display: flex;
  align-items: center;
}

.tag-view-title {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-view-close {
  display: flex;
  padding: 1px;
  border-radius: 50%;
  align-items: center;
}

.tag-view-close:hover {
  background-color: #ccc;
}
</style>