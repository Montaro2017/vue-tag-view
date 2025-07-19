import {postRequest} from "@/util/request.js"

export const login = (loginName, loginPassword) => {
  return postRequest("/api/login", {
    loginName,
    loginPassword
  })
}

export const logout = () => {
  return postRequest("/api/logout")
}