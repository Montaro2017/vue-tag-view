import {clone, toggle} from 'radash'
import {routes} from './routes.js'
import Frame from '@/components/layout/Frame.vue'
import {createRouter} from 'vue-router'
import {hasPermission, isLogin} from "@/util/permission.js"
import {useUserStore} from "@/stores/user.js"
import {ElMessage} from "element-plus"
import {getRouteTitle} from "@/util/route.js"
import { createWebHashHistory } from 'vue-router'

const appTitle = import.meta.env.VITE_APP_TITLE

const constantRoutes = [{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login.vue'),
  meta: {
    title: `登录`,
    checkLogin: false
  }
}]

const appendedRoutes = []

const handleRoutes = (routes) => {
  const handleOne = (route, routes) => {
    const {meta} = route
    const href = meta?.href
    const target = meta?.target || '_self'
    if (href && target !== '_self') {
      toggle(routes, route)
      return
    }
    if (href && target === '_self' && !route.component) {
      route.component = Frame
    }
    if (route.children) {
      handleRoutes(route.children)
    }
  }
  routes.forEach(route => {
    handleOne(route, routes)
  })
  return routes
}

const handledRoutes = handleRoutes(clone(routes))
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...handledRoutes, ...appendedRoutes],
})

router.beforeEach(async (to, from) => {
  const {getUserInfo} = useUserStore()
  await getUserInfo()

  const fullPath = to.fullPath
  const loginRoute = {
    name: 'Login',
    query: {
      target: fullPath,
    }
  }
  const isCheckLogin = getIsCheckLogin(to, true)
  const requiredPermissions = getRequiredPermissions(to)

  if (isCheckLogin && !isLogin()) {
    ElMessage.error("账号未登录或已过期")
    return loginRoute
  }
  if (requiredPermissions && !hasPermission(requiredPermissions)) {
    ElMessage.error("权限不足")
    return loginRoute
  }
  document.title = routeTitle(to)
  return true
})

const getMatchedRoute = (to) => {
  if (to.matched) {
    return to.matched[to.matched.length - 1]
  }
  return to
}

const routeTitle = (to) => {
  let matchedRoute = getMatchedRoute(to)
  return getRouteTitle(matchedRoute, true)
}

const getIsCheckLogin = (to, defaultValue) => {
  let isCheckLogin = defaultValue
  let matchedRoute = getMatchedRoute(to)
  if (matchedRoute?.meta?.checkLogin != null) {
    isCheckLogin = matchedRoute.meta.checkLogin
  }
  return isCheckLogin
}

const getRequiredPermissions = (to) => {
  let matchedRoute = getMatchedRoute(to)
  return matchedRoute?.meta?.permission
}

export default router
