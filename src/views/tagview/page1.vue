<template>
  <div class="flex-1">
    <div class="w-300px">
      <el-input v-model="modelValue" />
    </div>
    <div>输入文字后切换页面，查看输入的内容是否还存在</div>
    <div class="flex flex-center flex-cross-center">
      ID = {{ id }}
    </div>
    <div class="flex w-300px gap-8px">
      <el-input v-model="modelValue2" />
      <el-button @click="currentTagView.title = modelValue2">修改标签页标题</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTagViewStore } from "@/stores/tagView.js"

const modelValue = ref(null)

const route = useRoute()

const { currentTagView } = useTagViewStore()
const title = currentTagView.title
const id = ref(route.query.id)
// 判断一下是不是手动修改过标题
// 否则页面加载后，保存的标题又被代码修改了
if (title.startsWith('页面1')) {
  if (id.value) {
    currentTagView.title = `页面1 - ${id.value}`
  } else {
    currentTagView.title = '页面1'
  }
}

const modelValue2 = ref(null)

</script>

<style scoped>
</style>