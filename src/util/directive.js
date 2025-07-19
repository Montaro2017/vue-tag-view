import {hasPermission} from "@/util/permission.js"

const hasPermi = (app) => {
  app.directive("hasPermi", {
    mounted(el, binding) {
      const permission = binding.value
      if (!hasPermission(permission)) {
        el.parentNode?.removeChild(el)
      }
    }
  })
}

export const createDirective = (app) => {
  hasPermi(app)
}
