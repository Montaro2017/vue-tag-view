<template>
  <el-menu-item v-if="onlyShowChild" :index="firstChild.index" @click="handleMenuItemClick"
                :route="menuItemIsExternalLink ? null: firstChild.route">
    <span class="app-menu-icon">
      <el-icon>
        <component :is="firstChild.icon"/>
      </el-icon>
    </span>
    <span class="app-menu-title">{{ firstChild.title }}</span>
  </el-menu-item>
  <el-sub-menu v-else-if="menuItem.children" :index="menuItem.index">
    <template #title>
      <el-icon>
        <component :is="menuItem.icon"/>
      </el-icon>
      <span class="app-menu-title">{{ menuItem.title }}</span>
    </template>
    <template v-for="child in menuItem.children">
      <layout-menu-item v-if="!(child.meta?.hideInMenu)" :menuItem="child"/>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="menuItem.index" @click="handleMenuItemClick"
                :route="menuItemIsExternalLink ? null: menuItem.route">
    <span class="app-menu-icon">
      <el-icon>
        <component :is="menuItem.icon"/>
      </el-icon>
    </span>
    <span class="app-menu-title">{{ menuItem.title }}</span>
  </el-menu-item>
</template>

<script setup>
  import {computed} from 'vue'
  import {useRouter} from 'vue-router'
  import LayoutMenuItem from './MenuItem.vue'
  import {isExternalLink} from "@/util/route.js"
  
  defineOptions({
    name: 'LayoutMenuItem'
  })
  
  const {menuItem} = defineProps({
    menuItem: {
      type: Object
    }
  })
  
  const alwaysShow = computed(() => {
    return menuItem.route.meta?.alwaysShow || false
  })
  
  const childCount = computed(() => {
    return menuItem.children?.length || 0
  })
  
  const onlyShowChild = computed(() => {
    return childCount.value === 1 && !alwaysShow.value
  })
  
  const firstChild = computed(() => {
    if (!onlyShowChild.value) {
      return null
    }
    return menuItem.children[0]
  })
  
  const menuItemIsExternalLink = computed(() => {
    return isExternalLink(menuItem.route)
  })
  
  const router = useRouter()
  
  const handleMenuItemClick = () => {
    if (!menuItemIsExternalLink.value) {
      const item = firstChild.value ? firstChild.value : menuItem
      router.push(item.route || item.index)
      return
    }
    const href = menuItem.route.meta?.href
    const target = menuItem.route.meta?.target || '_blank'
    jump(href, target)
  }
  
  const jump = (href, target) => {
    window.open(href, target)
  }
</script>

<style scoped>

</style>