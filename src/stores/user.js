import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import storage from '@/util/storage.js'

export const useUserStore = defineStore('user', () => {

  const userInfo = ref({
    loginName: null,
    accountName: null,
    tokenName: null,
    tokenValue: null,
    permissions: []
  })

  const isLogin = computed(() => {
    return userInfo.value.tokenValue != null
  })

  const doLogin = async (loginName, loginPassword) => {
    userInfo.value = {
      loginName: loginName,
      accountName: loginName,
      tokenName: 'AuthToken',
      tokenValue: loginName,
      permissions: []
    }
    storage.set("userInfo", userInfo.value)
  }

  const doLogout = async () => {
    // try {
    //   await logout()
    // } catch (e) {
    //   console.error(e)
    // }
    userInfo.value = {
      loginName: null,
      accountName: null,
      tokenName: null,
      tokenValue: null,
      permissions: []
    }
    storage.clear("userInfo")
  }

  const getUserInfo = () => {
    if (!isLogin || !userInfo.value.tokenValue) {
      const localUserInfo = storage.get("userInfo")
      if (localUserInfo) {
        userInfo.value = localUserInfo
      }
    }
    return userInfo.value
  }

  return {
    isLogin,
    userInfo,
    getUserInfo,
    doLogin,
    doLogout
  }
})