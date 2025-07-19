<template>
  <el-menu :default-active="activeIndex" :ellipsis="false" unique-opened>
    <template v-for="menuItem in menus">
      <layout-menu-item v-if="!(menuItem.meta?.hideInMenu)" :menu-item="menuItem"/>
    </template>
  </el-menu>
</template>

<script setup>
  import LayoutMenuItem from './MenuItem.vue'
  
  defineOptions({
    name: 'LayoutMenu'
  })
  
  const {menus, activeIndex} = defineProps({
    menus: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: String
    }
  })
</script>

<style scoped>

</style>