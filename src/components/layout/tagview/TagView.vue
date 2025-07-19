<template>
  <div class="tag-view">
    <TagViewHeader/>
    <TagViewBody/>
  </div>
</template>

<script setup>
import TagViewBody from './Body.vue'
import TagViewHeader from './Header.vue'
import {useRoute, viewDepthKey} from 'vue-router'
import {getRouteComponent} from "@/util/route.js"
import {useTagViewStore} from "@/stores/tagView.js"
import {computed, inject, provide, watch} from 'vue'

defineOptions({
  name: 'TagView'
})

const {name} = defineProps({
  name: {
    type: String,
    default: 'default'
  }
})

const routerViewDepth = inject(viewDepthKey, 0)
provide(viewDepthKey, computed(() => {
  return routerViewDepth.value + 1
}))

const tagViewStore = useTagViewStore()

const { open, toTagView} = tagViewStore

const route = useRoute()
watch(route, () => {
  const component = getRouteComponent(route, routerViewDepth.value, name.value)
  const tagView = toTagView(route, component)
  open(tagView)
}, {immediate: true})

</script>

<style scoped>
.tag-view {
  flex: 1;
  min-height: 0;
  display: flex;
  user-select: none;
  flex-direction: column;
}

.tag-view-content :deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

</style>