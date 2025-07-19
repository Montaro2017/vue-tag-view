<template>
  <div class="login-container">
    <div class="login-wrapper">
      <el-form-item>
        <div class="login-title">{{ title }}</div>
      </el-form-item>
      <el-form>
        <el-form-item>
          <el-input v-model="form.loginName" placeholder="账号" @keydown.enter="login" :prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.loginPassword" placeholder="密码" @keydown.enter="login" show-password
            :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <div class="flex justify-between w-100%">
            <el-checkbox v-model="isSaveLoginName">记住账号</el-checkbox>
            <div class="color-#909399">输入任意用户名和密码登录</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-100%" @click="login" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from "@/stores/user.js"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"

import { homePage } from '@/router/routes.js'

const title = import.meta.env.VITE_APP_TITLE

const form = ref({
  loginName: null,
  loginPassword: null
})

const loading = ref(false)

const route = useRoute()
const router = useRouter()

const login = () => {
  const { doLogin } = useUserStore()
  loading.value = true
  doLogin(form.value.loginName, form.value.loginPassword).then(_ => {
    const target = route.query.target ?? homePage
    ElMessage.success("登录成功")
    if (isSaveLoginName.value) {
      saveLoginName(form.value.loginName)
    }
    setTimeout(() => {
      router.push(target)
    }, 500)
  }).finally(() => {
    loading.value = false
  })
}

const isSaveLoginName = ref(false)

const saveLoginName = (loginName) => {
  localStorage.setItem("loginName", loginName)
}

const loadLoginName = () => {
  return localStorage.getItem("loginName")
}

onMounted(() => {
  const loginName = loadLoginName()
  if (loginName) {
    form.value.loginName = loginName
  }
})

</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  background-color: #2d3a4b;
}

.login-wrapper {
  width: 100%;
  padding: 24px;
  display: flex;
  max-width: 360px;
  border: 1px solid;
  flex-direction: column;
  background: #FFF;
  justify-content: center;
  border-color: var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.login-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 16px 0;
  text-align: center;
}
</style>