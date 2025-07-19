import qs from 'qs'
import axios from 'axios'
import {ElMessage} from 'element-plus'

import router from '@/router/index.js'

const baseUrl = import.meta.env.VITE_BASE_URL

const instance = axios.create({
  baseUr: baseUrl,
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      allowDots: true,
      skipNulls: true
    })
  }
})

instance.interceptors.request.use(config => {
  return config
})

instance.interceptors.response.use(response => {
  const {data} = response
  const {code, msg} = data
  if (code === 40101) {
    ElMessage({
      type: "error",
      message: msg
    })
    router.push({name: "Login"})
    return
  }
  if (code !== 0) {
    ElMessage({
      type: "error",
      message: msg
    })
    return Promise.reject(msg)
  }
  return data
}, err => {
  console.error(err)
  ElMessage.error("请求异常")
})

export const request = instance

export const getRequest = (url, query) => {
  return request({
    url: url,
    method: 'GET',
    params: query
  })
}

export const postRequest = (url, data) => {
  return request({
    url: url,
    method: 'POST',
    data: data
  })
}

export const putRequest = (url, data) => {
  return request({
    url: url,
    method: 'PUT',
    data: data
  })
}

export const deleteRequest = (url) => {
  return request({
    url: url,
    method: 'DELETE'
  })
}