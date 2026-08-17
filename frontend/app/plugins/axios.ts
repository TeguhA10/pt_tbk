import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'

  const axiosInstance = axios.create({
    baseURL: apiBase,
    timeout: 15000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })

  axiosInstance.interceptors.request.use(
    (requestConfig) => {
      return requestConfig
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorMsg = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server'
      return Promise.reject(new Error(errorMsg))
    }
  )

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
