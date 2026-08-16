export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:8000/api'

  const fetchApi = async <T = any>(endpoint: string, options: any = {}) => {
    try {
      const data = await $fetch<T>(`${apiBase}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        }
      })
      return { data, error: null }
    } catch (err: any) {
      console.error(`API Request Error [${endpoint}]:`, err)
      return { data: null, error: err?.data?.message || err?.message || 'Server error occurred' }
    }
  }

  return {
    apiBase,
    fetchApi
  }
}
