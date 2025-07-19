<template>
  <iframe class="border-none w-100% h-100%" :src="href"/>
</template>

<script setup>
  import {useRoute} from 'vue-router'
  
  defineOptions({
    name: 'LayoutFrame'
  })
  
  const route = useRoute()
  const href = route.meta?.href
</script>

<style scoped>

</style>