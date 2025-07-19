<template>
  <div>
    <div class="flex w-500px gap-4 p-10px">
      <span class="flex-shrink-0">页面1</span>
      <el-input v-model="page1Id" placeholder="参数ID" />
      <el-button @click="openPage1">打开</el-button>
      <el-button @click="openPage20">打开 x20</el-button>
    </div>
    <div class="flex w-500px gap-4 p-10px">
      <span class="flex-shrink-0">页面2</span>
      <el-input v-model="page2Id" placeholder="参数ID" />
      <el-button @click="openPage2">打开</el-button>
    </div>
    <div>
      <div>多标签页通过动态计算路由的key来实现同一组件多开，默认情况下使用route.fullPath来计算</div>
      <div>可通过route.meta.key自定义，支持字符串和function</div>
      <div>key重复则不会多开</div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter, } from 'vue-router'
import { useTagViewStore } from "@/stores/tagView.js"

const router = useRouter()

const page1Id = ref(null)

const openPage1 = () => {
  router.push({
    path: '/tagview/page1',
    query: {
      id: page1Id.value
    }
  })
}
const { open, toTagView } = useTagViewStore()

const openPage20 = async () => {
  for (let i = 1; i <= 20; i++) {
    let route = router.resolve({
      path: '/tagview/page1',
      query: {
        id: i
      }
    })
    await open(toTagView(route, null), true)
  }
}

const page2Id = ref(null)

const openPage2 = () => {
  router.push({
    path: '/tagview/page2',
    query: {
      id: page2Id.value
    }
  })
}

</script>

<style scoped></style>