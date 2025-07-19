<template>
  <div class="app-header">
    <div class="header-left">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbItems" :to="{path: item.path}">
          <div class="breadcrumb-item">
            <el-icon v-if="item.icon">
              <component :is="item.icon"/>
            </el-icon>
            <span>{{ item.title }}</span>
          </div>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <el-icon class="header-right-icon">
            <user/>
          </el-icon>
          <span style="margin:0 5px">{{ accountName }}</span>
          <el-icon class="header-right-icon">
            <arrow-down/>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">
              <el-icon>
                <switch-button></switch-button>
              </el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
  import {computed} from 'vue'
  import {useUserStore} from "@/stores/user.js"
  import {useRoute, useRouter} from "vue-router"
  import {getRouteTitle} from "@/util/route.js"
  import {User, ArrowDown, SwitchButton} from "@element-plus/icons-vue"
  
  defineOptions({
    name: 'LayoutHeader'
  })
  
  const {userInfo, doLogout} = useUserStore()
  
  const route = useRoute()
  
  const breadcrumbItems = computed(() => {
    const {matched} = route
    return matched.map(item => {
      return {
        title: getRouteTitle(item),
        icon: item.meta?.icon,
        path: item.path
      }
    }).filter(item => item.title)
  })
  
  const router = useRouter()
  
  const handleCommand = async (command) => {
    if (command === "logout") {
      await doLogout()
      setTimeout(() => {
        router.push({
          name: "Login"
        })
      }, 300)
    }
  }
  
  const accountName = computed(() => {
    return userInfo.accountName
  })

</script>

<style scoped>
  
  .app-header {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .app-header > * {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .breadcrumb-item {
    display: flex;
    font-weight: 600;
    align-items: center;
  }
  
  .breadcrumb-item i {
    margin-right: 6px;
  }
  
  .header-right {
    cursor: pointer;
  }
  
  .header-right-icon {
    transform: translateY(10%);
  }
</style>