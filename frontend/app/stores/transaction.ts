import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Coa } from './coa'

export interface TransactionItem {
  id: number
  date: string
  coa_id: number
  description: string | null
  debit: number
  credit: number
  created_at?: string
  updated_at?: string
  coa?: Coa
}

export interface TransactionPagination {
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  from: number
  to: number
}

export interface TransactionSummary {
  totalDebit: number
  totalCredit: number
  net: number
}

export interface TransactionFilters {
  search: string
  coa_id: string | number
  start_date: string
  end_date: string
}

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<TransactionItem[]>([])
  const loading = ref(false)
  const initialized = ref(false)

  const pagination = ref<TransactionPagination>({
    currentPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
    from: 0,
    to: 0
  })

  const summary = ref<TransactionSummary>({
    totalDebit: 0,
    totalCredit: 0,
    net: 0
  })

  const filters = ref<TransactionFilters>({
    search: '',
    coa_id: '',
    start_date: '',
    end_date: ''
  })

  const totalFilteredDebit = computed(() => summary.value.totalDebit)
  const totalFilteredCredit = computed(() => summary.value.totalCredit)
  const netFiltered = computed(() => summary.value.net)

  const displayedPages = computed(() => {
    const current = pagination.value.currentPage
    const last = pagination.value.lastPage
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        range.push(i)
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  })

  async function fetchTransactions(page: number | null = null) {
    if (page !== null) {
      pagination.value.currentPage = page
    }

    const { fetchApi } = useApi()
    loading.value = true

    const query = new URLSearchParams()
    query.append('page', String(pagination.value.currentPage))
    query.append('per_page', String(pagination.value.perPage))

    if (filters.value.search) query.append('search', filters.value.search)
    if (filters.value.coa_id) query.append('coa_id', String(filters.value.coa_id))
    if (filters.value.start_date) query.append('start_date', filters.value.start_date)
    if (filters.value.end_date) query.append('end_date', filters.value.end_date)

    const res = await fetchApi(`/transactions?${query.toString()}`)
    if (res.data) {
      if (res.data.data !== undefined) {
        transactions.value = res.data.data
        pagination.value.currentPage = res.data.current_page || 1
        pagination.value.lastPage = res.data.last_page || 1
        pagination.value.total = res.data.total || 0
        pagination.value.from = res.data.from || (transactions.value.length > 0 ? 1 : 0)
        pagination.value.to = res.data.to || transactions.value.length
        if (res.data.summary) {
          summary.value.totalDebit = Number(res.data.summary.total_debit || 0)
          summary.value.totalCredit = Number(res.data.summary.total_credit || 0)
          summary.value.net = Number(res.data.summary.net || 0)
        }
      } else if (Array.isArray(res.data)) {
        transactions.value = res.data
        pagination.value.total = res.data.length
        pagination.value.from = res.data.length > 0 ? 1 : 0
        pagination.value.to = res.data.length
        pagination.value.currentPage = 1
        pagination.value.lastPage = 1
        summary.value.totalDebit = transactions.value.reduce((sum, tx) => sum + Number(tx.debit || 0), 0)
        summary.value.totalCredit = transactions.value.reduce((sum, tx) => sum + Number(tx.credit || 0), 0)
        summary.value.net = summary.value.totalCredit - summary.value.totalDebit
      }
      initialized.value = true
    }

    loading.value = false
    return res
  }

  function changePage(page: number) {
    if (page < 1 || page > pagination.value.lastPage || page === pagination.value.currentPage) return
    return fetchTransactions(page)
  }

  function changePerPage(perPage: number) {
    pagination.value.perPage = perPage
    pagination.value.currentPage = 1
    return fetchTransactions(1)
  }

  function resetFilters() {
    filters.value = { search: '', coa_id: '', start_date: '', end_date: '' }
    pagination.value.currentPage = 1
    return fetchTransactions(1)
  }

  function refresh() {
    return fetchTransactions()
  }

  function refreshFirstPage() {
    pagination.value.currentPage = 1
    return fetchTransactions(1)
  }

  function reset() {
    transactions.value = []
    loading.value = false
    initialized.value = false
    pagination.value = {
      currentPage: 1,
      lastPage: 1,
      perPage: 10,
      total: 0,
      from: 0,
      to: 0
    }
    summary.value = {
      totalDebit: 0,
      totalCredit: 0,
      net: 0
    }
    filters.value = {
      search: '',
      coa_id: '',
      start_date: '',
      end_date: ''
    }
  }

  return {
    transactions,
    loading,
    initialized,
    pagination,
    summary,
    filters,
    totalFilteredDebit,
    totalFilteredCredit,
    netFiltered,
    displayedPages,
    fetchTransactions,
    changePage,
    changePerPage,
    resetFilters,
    refresh,
    refreshFirstPage,
    reset
  }
})
