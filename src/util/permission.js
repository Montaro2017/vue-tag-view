import {useUserStore} from "@/stores/user.js"

export const isLogin = () => {
  const {isLogin} = useUserStore()
  return isLogin
}

export const hasPermission = (requiredPermission) => {
  const {getUserInfo} = useUserStore()
  const {permissions} = getUserInfo()
  if (permissions.indexOf("*") !== -1 || !requiredPermission) {
    return true
  }
  return permissions.indexOf(requiredPermission) !== -1
}