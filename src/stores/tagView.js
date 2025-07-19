import { defineStore } from 'pinia'
import storage from '@/util/storage'
import { useRouter } from 'vue-router'
import { home } from "@/router/routes.js"
import { last, uid } from 'radash'
import { ref, shallowRef, toValue, watch } from 'vue'
import { getRouteIcon, getRouteKey, getRouteTitle, isCloseable } from "@/util/route.js"

export const useTagViewStore = defineStore('tagsView', () => {

  const router = useRouter()

  const tagViews = ref([])
  const currentTagView = ref(null)

  watch(() => [tagViews.value, currentTagView.value], () => {
    const savedValue = tagViews.value.map(it => {
      let tagView = {
        ...it,
        route: {
          name: it.route.name,
          fullPath: it.route.fullPath,
          path: it.route.path,
          meta: toValue(it.route.meta),
          query: it.route.query,
          params: toValue(it.route.params),
        }
      }
      tagView.route.component = null
      tagView.icon = null
      tagView.component = null
      return tagView
    })
    storage.set("tagViews", savedValue)
  }, { deep: true })

  const toTagView = (route, component = null) => {
    const key = getRouteKey(route)
    return {
      id: uid(8),
      title: getRouteTitle(route),
      key: key,
      icon: shallowRef(getRouteIcon(route)),
      route: { ...route },
      component: shallowRef(component),
      closeable: isCloseable(route)
    }
  }

  const cachedTagViews = storage.get("tagViews")
  if (cachedTagViews && cachedTagViews.length !== 0) {
    const readTagViews = cachedTagViews.map(it => {
      const route = it.route
      const tagView = toTagView(router.resolve(route))
      tagView.title = it.title
      return tagView
    })
    tagViews.value.push(...readTagViews)
  } else {
    // 首页
    tagViews.value.push(toTagView(home.children[0], null))
  }

  const open = async (tagView, setCurrent = true) => {
    const key = tagView.key
    let findedTagView = tagViews.value.find(tagView => tagView.key === key)
    if (!findedTagView) {
      findedTagView = tagView
      tagViews.value.push(findedTagView)
    }
    if (tagView.component) {
      findedTagView.component = tagView.component
    }
    if (setCurrent) {
      currentTagView.value = findedTagView
      await router.push(currentTagView.value.route)
    }
  }

  const close = async (tagView) => {
    const isCloseCurrentTagView = tagView.key === currentTagView.value.key
    const key = tagView.key
    const index = tagViews.value.findIndex(tagView => tagView.key === key)
    if (index === -1) {
      return false
    }
    const findedTagView = tagViews.value[index]
    if (findedTagView.closeable === false) {
      return false
    }
    tagViews.value.splice(index, 1)
    if (isCloseCurrentTagView) {
      // 关闭当前标签页的行为 默认打开上一个标签页
      const lastTagView = last(tagViews.value)
      if (lastTagView) {
        await router.push(lastTagView.route)
      }
    }
    return true
  }

  return {
    tagViews,
    currentTagView,
    toTagView,
    open,
    close
  }
})