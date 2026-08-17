<template>
  <div class="space-y-6">
    <!-- Header Banner & Action Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <ArrowLeftRight class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Catatan Transaksi Keuangan</h1>
          <p class="text-xs text-slate-400 mt-0.5">Pencatatan mutasi transaksi debet dan kredit berdasarkan kode akun COA</p>
        </div>
      </div>

      <button 
        @click="openAddModal"
        class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition active:scale-95 self-start sm:self-auto shrink-0"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Transaksi Baru</span>
      </button>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="p-4 sm:p-5 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Search Keyword -->
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            v-model="filters.search" 
            @input="debounceLoad"
            type="text" 
            placeholder="Cari deskripsi / COA..." 
            class="w-full pl-10 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition"
          />
          <button 
            v-if="filters.search" 
            @click="filters.search = ''; loadTransactions()" 
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- COA Selector -->
        <select 
          v-model="filters.coa_id" 
          @change="loadTransactions"
          class="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition"
        >
          <option value="">Semua Akun COA</option>
          <option v-for="c in coaStore.coas" :key="c.id" :value="c.id">{{ c.code }} - {{ c.name }}</option>
        </select>

        <!-- Date Range Filter -->
        <div class="flex items-center gap-2 sm:col-span-2 lg:col-span-2">
          <div class="relative flex-1">
            <input 
              v-model="filters.start_date" 
              @change="loadTransactions"
              type="date" 
              class="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <span class="text-xs text-slate-500 font-semibold shrink-0">s/d</span>
          <div class="relative flex-1">
            <input 
              v-model="filters.end_date" 
              @change="loadTransactions"
              type="date" 
              class="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <button 
            @click="resetFilters" 
            class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95 shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3"
            title="Reset Filter"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <!-- Quick Summary Metric Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
        <div class="flex flex-wrap items-center gap-4 sm:gap-6">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-400"></span>
            <span class="text-slate-400">Total Debit (Expense):</span>
            <strong class="text-rose-400 font-mono font-bold">{{ formatRupiah(totalFilteredDebit) }}</strong>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span class="text-slate-400">Total Credit (Income):</span>
            <strong class="text-emerald-400 font-mono font-bold">{{ formatRupiah(totalFilteredCredit) }}</strong>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-400">Selisih Bersih:</span>
            <strong :class="['font-mono font-bold', netFiltered >= 0 ? 'text-emerald-400' : 'text-rose-400']">
              {{ formatRupiah(netFiltered) }}
            </strong>
          </div>
        </div>
        <span class="text-slate-400 font-medium font-mono text-xs">
          {{ transactions.length }} Transaksi
        </span>
      </div>
    </div>

    <!-- Transactions Data Container -->
    <div class="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      <!-- Loading state -->
      <div v-if="pending" class="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 class="w-6 h-6 animate-spin text-indigo-400" />
        <span>Memuat data transaksi keuangan...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="transactions.length === 0" class="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
          <Receipt class="w-6 h-6" />
        </div>
        <p class="font-semibold text-sm text-slate-300">Belum ada transaksi ditemukan</p>
        <p class="text-slate-500">Sesuaikan filter pencarian atau input transaksi baru.</p>
        <button 
          @click="openAddModal" 
          class="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          <span>Catat Transaksi Sekarang</span>
        </button>
      </div>

      <!-- Data List -->
      <div v-else>
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800 uppercase font-semibold bg-slate-950/50">
                <th class="py-4 px-6">Tanggal</th>
                <th class="py-4 px-6">COA Kode</th>
                <th class="py-4 px-6">Nama Akun & Kategori</th>
                <th class="py-4 px-6">Keterangan / Description</th>
                <th class="py-4 px-6 text-right">Debit (Expense)</th>
                <th class="py-4 px-6 text-right">Credit (Income)</th>
                <th class="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-slate-800/40 transition group">
                <td class="py-4 px-6 text-slate-300 font-mono whitespace-nowrap">{{ tx.date }}</td>
                <td class="py-4 px-6 font-mono text-indigo-400 font-bold text-sm whitespace-nowrap">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/25">
                    {{ tx.coa?.code }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <p class="font-bold text-white text-sm">{{ tx.coa?.name }}</p>
                  <span 
                    :class="[
                      'inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                      tx.coa?.category?.type === 'income' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    ]"
                  >
                    {{ tx.coa?.category?.name }}
                  </span>
                </td>
                <td class="py-4 px-6 text-slate-300 max-w-xs truncate" :title="tx.description">
                  {{ tx.description || '-' }}
                </td>
                <td class="py-4 px-6 text-right font-mono text-rose-400 font-bold text-sm whitespace-nowrap">
                  {{ tx.debit > 0 ? formatRupiah(tx.debit) : '-' }}
                </td>
                <td class="py-4 px-6 text-right font-mono text-emerald-400 font-bold text-sm whitespace-nowrap">
                  {{ tx.credit > 0 ? formatRupiah(tx.credit) : '-' }}
                </td>
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <button 
                    @click="openEditModal(tx)"
                    class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button 
                    @click="promptDelete(tx)"
                    class="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 font-semibold text-xs border border-rose-800/40 transition active:scale-95 inline-flex items-center gap-1.5"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card List View -->
        <div class="md:hidden divide-y divide-slate-800/60 p-3 space-y-3">
          <div 
            v-for="tx in transactions" 
            :key="tx.id" 
            class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 hover:border-slate-700 transition"
          >
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/25">
                COA: {{ tx.coa?.code }}
              </span>
              <span class="text-xs font-mono text-slate-400">{{ tx.date }}</span>
            </div>

            <div>
              <p class="font-bold text-white text-base">{{ tx.coa?.name }}</p>
              <p class="text-xs text-slate-300 mt-1">{{ tx.description || '-' }}</p>
              <span class="inline-block mt-1.5 text-[11px] font-semibold text-slate-500">
                Kategori: {{ tx.coa?.category?.name }}
              </span>
            </div>

            <div class="flex items-center justify-between pt-2.5 border-t border-slate-800/60">
              <div>
                <span v-if="tx.credit > 0" class="font-mono font-extrabold text-sm text-emerald-400">
                  + {{ formatRupiah(tx.credit) }}
                </span>
                <span v-else class="font-mono font-extrabold text-sm text-rose-400">
                  - {{ formatRupiah(tx.debit) }}
                </span>
              </div>
              <div class="space-x-2">
                <button 
                  @click="openEditModal(tx)"
                  class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-indigo-300 font-semibold text-xs inline-flex items-center gap-1"
                >
                  <Edit3 class="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button 
                  @click="promptDelete(tx)"
                  class="px-3.5 py-1.5 rounded-xl bg-rose-950/50 text-rose-300 font-semibold text-xs border border-rose-800/40 inline-flex items-center gap-1"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Add / Edit) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ArrowLeftRight class="w-4 h-4" />
              </div>
              <h3 class="text-base font-extrabold text-white">{{ isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru' }}</h3>
            </div>
            <button @click="showModal = false" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="saveTransaction" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Tanggal Transaksi <span class="text-rose-400">*</span></label>
                <input 
                  v-model="form.date" 
                  type="date" 
                  required
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Akun COA <span class="text-rose-400">*</span></label>
                <select 
                  v-model="form.coa_id" 
                  required
                  @change="onCoaChange"
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option :value="null" disabled>Pilih COA...</option>
                  <option v-for="c in coaStore.coas" :key="c.id" :value="c.id">
                    {{ c.code }} - {{ c.name }} ({{ c.category?.name }})
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Keterangan Transaksi</label>
              <input 
                v-model="form.description" 
                type="text" 
                placeholder="Misal: Pembayaran Biaya Operasional / Penerimaan Pendapatan" 
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-rose-400 mb-1.5">Debit (Biaya / Pengeluaran)</label>
                <input 
                  v-model.number="form.debit" 
                  type="number" 
                  min="0"
                  step="1000"
                  placeholder="0" 
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-rose-300 font-mono focus:outline-none focus:border-rose-500 transition"
                />
                <p v-if="form.debit > 0" class="text-[11px] font-mono text-rose-400 mt-1">
                  {{ formatRupiah(form.debit) }}
                </p>
              </div>
              <div>
                <label class="block text-xs font-semibold text-emerald-400 mb-1.5">Credit (Pemasukan / Income)</label>
                <input 
                  v-model.number="form.credit" 
                  type="number" 
                  min="0"
                  step="1000"
                  placeholder="0" 
                  class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500 transition"
                />
                <p v-if="form.credit > 0" class="text-[11px] font-mono text-emerald-400 mt-1">
                  {{ formatRupiah(form.credit) }}
                </p>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
              💡 <em>Tips:</em> Isi <strong>Debit</strong> untuk pencatatan beban/pengeluaran kas, atau isi <strong>Credit</strong> untuk pencatatan pendapatan masuk.
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                type="button" 
                @click="showModal = false"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="saving"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center gap-2 transition active:scale-95"
              >
                <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ saving ? 'Menyimpan...' : 'Simpan Transaksi' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal Component -->
    <AppConfirmModal 
      v-model="showDeleteModal"
      title="Hapus Catatan Transaksi"
      message="Apakah Anda yakin ingin menghapus catatan transaksi ini?"
      :item-name="txToDelete ? `${txToDelete.date} • ${txToDelete.coa?.code} (${formatRupiah(txToDelete.credit || txToDelete.debit)})` : ''"
      confirm-text="Ya, Hapus Transaksi"
      :loading="deleting"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  RotateCcw, 
  Receipt, 
  Loader2 
} from 'lucide-vue-next'

const { fetchApi } = useApi()
const toast = useToast()
const coaStore = useCoaStore()

const transactions = ref([])
const pending = ref(true)

const filters = ref({
  search: '',
  coa_id: '',
  start_date: '',
  end_date: ''
})

const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const showDeleteModal = ref(false)
const txToDelete = ref(null)
const deleting = ref(false)

let debounceTimer = null
const debounceLoad = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadTransactions()
  }, 300)
}

const form = ref({
  id: null,
  date: new Date().toISOString().split('T')[0],
  coa_id: null,
  description: '',
  debit: 0,
  credit: 0
})

const totalFilteredDebit = computed(() => {
  return transactions.value.reduce((sum, tx) => sum + Number(tx.debit || 0), 0)
})

const totalFilteredCredit = computed(() => {
  return transactions.value.reduce((sum, tx) => sum + Number(tx.credit || 0), 0)
})

const netFiltered = computed(() => {
  return totalFilteredCredit.value - totalFilteredDebit.value
})

const loadTransactions = async () => {
  pending.value = true
  const query = new URLSearchParams()
  if (filters.value.search) query.append('search', filters.value.search)
  if (filters.value.coa_id) query.append('coa_id', filters.value.coa_id)
  if (filters.value.start_date) query.append('start_date', filters.value.start_date)
  if (filters.value.end_date) query.append('end_date', filters.value.end_date)

  const res = await fetchApi(`/transactions?${query.toString()}`)
  if (res.data) transactions.value = res.data
  if (res.error) toast.error(res.error, 'Gagal memuat transaksi')
  pending.value = false
}

const loadCoas = async () => {
  const res = await fetchApi('/coas')
  if (res.data) coas.value = res.data
}

const resetFilters = () => {
  filters.value = { search: '', coa_id: '', start_date: '', end_date: '' }
  loadTransactions()
}

const onCoaChange = () => {
  const selected = coaStore.coas.find(c => c.id === form.value.coa_id)
  if (selected?.category?.type === 'income' && form.value.debit > 0 && form.value.credit === 0) {
    form.value.credit = form.value.debit
    form.value.debit = 0
  } else if (selected?.category?.type === 'expense' && form.value.credit > 0 && form.value.debit === 0) {
    form.value.debit = form.value.credit
    form.value.credit = 0
  }
}

const openAddModal = () => {
  isEditing.value = false
  form.value = {
    id: null,
    date: new Date().toISOString().split('T')[0],
    coa_id: coaStore.coas[0]?.id || null,
    description: '',
    debit: 0,
    credit: 0
  }
  showModal.value = true
}

const openEditModal = (tx) => {
  isEditing.value = true
  form.value = {
    id: tx.id,
    date: tx.date,
    coa_id: tx.coa_id,
    description: tx.description || '',
    debit: tx.debit || 0,
    credit: tx.credit || 0
  }
  showModal.value = true
}

const saveTransaction = async () => {
  if (!form.value.coa_id) {
    toast.warning('Silakan pilih akun COA')
    return
  }
  if ((form.value.debit || 0) === 0 && (form.value.credit || 0) === 0) {
    toast.warning('Nominal Debit atau Credit harus lebih dari 0')
    return
  }

  saving.value = true
  if (isEditing.value) {
    const res = await fetchApi(`/transactions/${form.value.id}`, {
      method: 'PUT',
      body: form.value
    })
    if (res.data) {
      toast.success('Transaksi keuangan berhasil diperbarui')
      showModal.value = false
      await loadTransactions()
    } else {
      toast.error(res.error || 'Gagal memperbarui transaksi')
    }
  } else {
    const res = await fetchApi('/transactions', {
      method: 'POST',
      body: form.value
    })
    if (res.data) {
      toast.success('Transaksi keuangan berhasil ditambahkan')
      showModal.value = false
      await loadTransactions()
    } else {
      toast.error(res.error || 'Gagal menambahkan transaksi')
    }
  }
  saving.value = false
}

const promptDelete = (tx) => {
  txToDelete.value = tx
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!txToDelete.value) return
  deleting.value = true
  const res = await fetchApi(`/transactions/${txToDelete.value.id}`, { method: 'DELETE' })
  if (!res.error) {
    toast.success('Catatan transaksi telah dihapus')
    showDeleteModal.value = false
    await loadTransactions()
  } else {
    toast.error(res.error || 'Gagal menghapus transaksi')
  }
  deleting.value = false
}

onMounted(async () => {
  await coaStore.fetchAll()
  await loadTransactions()
})
</script>
