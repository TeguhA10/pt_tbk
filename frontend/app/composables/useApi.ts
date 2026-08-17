import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

let axiosInstance: AxiosInstance | null = null

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'

  if (!axiosInstance || axiosInstance.defaults.baseURL !== apiBase) {
    axiosInstance = axios.create({
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
  }

  const fetchApi = async <T = any>(endpoint: string, options: any = {}) => {
    try {
      const { body, ...restOptions } = options
      const requestData = options.data !== undefined ? options.data : body
      const response = await axiosInstance!.request<T>({
        url: endpoint,
        ...restOptions,
        ...(requestData !== undefined ? { data: requestData } : {})
      })
      return { data: response.data, error: null }
    } catch (err: any) {
      console.error(`[Axios Error] ${options.method || 'GET'} ${endpoint}:`, err)
      const message = err?.response?.data?.message || err?.message || 'Terjadi kesalahan koneksi server'
      return { data: null, error: message }
    }
  }

  const get = async <T = any>(url: string, config?: AxiosRequestConfig) => {
    return fetchApi<T>(url, { method: 'GET', ...config })
  }

  const post = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return fetchApi<T>(url, { method: 'POST', data, ...config })
  }

  const put = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return fetchApi<T>(url, { method: 'PUT', data, ...config })
  }

  const deleteApi = async <T = any>(url: string, config?: AxiosRequestConfig) => {
    return fetchApi<T>(url, { method: 'DELETE', ...config })
  }

  return {
    apiBase,
    api: axiosInstance,
    axios: axiosInstance,
    fetchApi,
    get,
    post,
    put,
    deleteApi
  }
}
