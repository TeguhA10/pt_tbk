import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
}

export interface Coa {
  id: number
  code: string
  name: string
  category_id: number
  category?: Category
}

export const useCoaStore = defineStore('coa', () => {
  const coas = ref<Coa[]>([])
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const initialized = ref(false)

  const incomeCount = computed(() =>
    coas.value.filter(c => c.category?.type === 'income').length
  )

  const expenseCount = computed(() =>
    coas.value.filter(c => c.category?.type === 'expense').length
  )

  async function fetchAll(force = false) {
    if (initialized.value && !force) return

    const { fetchApi } = useApi()
    loading.value = true

    const [resCoas, resCats] = await Promise.all([
      fetchApi('/coas'),
      fetchApi('/categories'),
    ])

    if (resCoas.data) coas.value = resCoas.data
    if (resCats.data) categories.value = resCats.data

    loading.value = false
    initialized.value = true
  }

  async function refresh() {
    return fetchAll(true)
  }

  function reset() {
    coas.value = []
    categories.value = []
    initialized.value = false
    loading.value = false
  }

  return {
    coas,
    categories,
    loading,
    initialized,
    incomeCount,
    expenseCount,
    fetchAll,
    refresh,
    reset,
  }
})
