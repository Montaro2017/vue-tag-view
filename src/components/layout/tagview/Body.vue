<template>
  <el-main class="tag-view-content">
    <el-scrollbar class="tag-view-content-scrollbar">
      <template v-for="tagView in tagViews">
        <template v-if="!isInnerFrame(tagView.route)">
          <KeepAlive :key="tagView.key">
            <Component :is="tagView.component" v-if="tagView.key === currentTagView.key"/>
          </KeepAlive>
        </template>
        <template v-else>
          <Component :is="tagView.component" :key="tagView.key" v-show="tagView.key === currentTagView.key"/>
        </template>
      </template>
    </el-scrollbar>
  </el-main>
</template>

<script setup>
import {storeToRefs} from 'pinia'
import {isInnerFrame} from "@/util/route.js"
import {useTagViewStore} from "@/stores/tagView.js"

defineOptions({
  name: 'TagViewBody'
})

const tagViewStore = useTagViewStore()

const {tagViews, currentTagView} = storeToRefs(tagViewStore)

</script>


<style scoped>
.tag-view-content-scrollbar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>