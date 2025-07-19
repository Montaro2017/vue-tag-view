const APP_TITLE = import.meta.env.VITE_APP_TITLE

export const getRouteTitle = (route, withPrefix = false) => {
  const title = route.meta?.title
  if (!title) {
    if (withPrefix) {
      return APP_TITLE
    } else {
      return ''
    }
  }
  if (withPrefix) {
    return `${APP_TITLE} - ${title}`
  }
  return `${title}`
}

export const getRouteKey = (route) => {
  const key = route.meta?.key
  if (!key) {
    return route.fullPath
  }
  if (key instanceof Function) {
    return key.apply(null, route)
  }
  return key
}

export const getRouteIcon = (route) => {
  return route.meta?.icon
}

export const getRouteComponent = (route, routerViewDepth, name = 'default') => {
  return route.matched[routerViewDepth]?.components[name]
}

export const isUseLink = (route) => {
  const href = route.meta?.href
  return !!href
}

export const isInnerFrame = (route) => {
  return isUseLink(route) && (route.meta?.target || '_self') !== '_blank'
}

export const isExternalLink = (route) => {
  return isUseLink(route) && (route.meta?.target || '_self') === '_blank'
}

export const isCloseable = (route) => {
  const allowClose = route?.meta?.closeable
  return allowClose !== false
}