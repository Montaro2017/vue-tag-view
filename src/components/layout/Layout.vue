<template>
  <el-container class="layout">
    <el-aside class="app-sidebar">
      <div class="app-title">{{ appTitle }}</div>
      <el-scrollbar>
        <layout-menu class="app-menu" :menus="menus" :active-index="activeIndex"/>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <header-header/>
      </el-header>
      <TagView/>
    </el-container>
  </el-container>
</template>

<script setup>
  import {computed} from 'vue'
  import {useRoute} from 'vue-router'
  import HeaderHeader from './Header.vue'
  import LayoutMenu from './menu/Menu.vue'
  import {routes} from '@/router/routes.js'
  import {hasPermission} from "@/util/permission.js"
  import TagView from '@/components/layout/tagview/TagView.vue'
  import {getRouteIcon, getRouteTitle} from "@/util/route.js"
  
  defineOptions({
    name: 'Layout'
  })
  
  const appTitle = import.meta.env.VITE_APP_TITLE
  
  const computeMenuIndex = (path, parentPath = '') => {
    let index = ''
    if (!parentPath.endsWith('/') && !path.startsWith('/')) {
      index = parentPath + '/' + path
    } else {
      index = parentPath + path
    }
    if (index.endsWith('/')) {
      index = index.substring(0, index.length - 1)
    }
    if (index === '') {
      index = '/'
    }
    return index
  }
  
  const menus = computed(() => {
    const map = (route, parent) => {
      const index = computeMenuIndex(route.path, parent?.index)
      
      let menu = {
        title: getRouteTitle(route),
        icon: getRouteIcon(route),
        meta: route.meta,
        index: index,
        route: route,
      }
      if (route.children) {
        menu.children = route.children.filter(r => hasPermission(r.meta?.permission)).map(route => map(route, menu))
      }
      return menu
    }
    return routes.filter(r => hasPermission(r.meta?.permission)).map(route => map(route, null))
  })
  
  const route = useRoute()
  
  const getActiveIndex = (currentRoute) => {
    let path = currentRoute.path
    if (currentRoute.meta?.activeMenu) {
      path = currentRoute.meta.activeMenu
    }
    return computeMenuIndex(path)
  }
  
  const activeIndex = computed(() => {
    return getActiveIndex(route)
  })

</script>

<style scoped>
  
  .layout {
    width: 100%;
    height: 100%;
  }
  
  .app-sidebar {
    width: 210px;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    --el-menu-bg-color: #304156;
    --el-menu-text-color: #bfcbd9;
    --el-menu-hover-bg-color: rgba(0, 0, 0, 0.06);
    --el-menu-active-color: var(--el-color-primary);
    --el-menu-sub-bg-color: #1f2d3d;
    background-color: var(--el-menu-bg-color);
  }
  
  .app-title {
    color: #fff;
    height: 50px;
    flex-shrink: 0;
    text-align: center;
    line-height: 40px;
    padding-top: 21px;
  }
  
  .app-menu {
    flex: 1;
    border: none !important;
  }
  
  :deep(.el-sub-menu .el-menu-item) {
    background-color: var(--el-menu-sub-bg-color) !important;
  }
  
  .layout-header {
    border-bottom: 1px solid var(--el-border-color);
  }
</style>