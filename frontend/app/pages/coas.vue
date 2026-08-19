<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <BookOpen class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Master Chart of Account (COA)</h1>
          <p class="text-xs text-slate-400 mt-0.5">Daftar kode akun keuangan beserta pemetaan grup kategori dan
            klasifikasinya</p>
        </div>
      </div>

      <button @click="openAddModal"
        class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition active:scale-95 self-start sm:self-auto shrink-0">
        <Plus class="w-4 h-4" />
        <span>Tambah COA</span>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase">Total Akun COA</p>
          <p class="text-xl font-extrabold text-white mt-1">{{ coaStore.coas.length }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
          <Layers class="w-4 h-4" />
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase">Akun Pendapatan</p>
          <p class="text-xl font-extrabold text-emerald-400 mt-1">{{ coaStore.incomeCount }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <ArrowDownRight class="w-4 h-4" />
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase">Akun Pengeluaran</p>
          <p class="text-xl font-extrabold text-rose-400 mt-1">{{ coaStore.expenseCount }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <ArrowUpRight class="w-4 h-4" />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input v-model="searchQuery" type="text" placeholder="Cari kode atau nama COA..."
            class="w-full pl-10 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition" />
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <select v-model="categoryFilter"
          class="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition">
          <option value="">Semua Kategori</option>
          <option v-for="cat in coaStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }} ({{ cat.type }})
          </option>
        </select>
      </div>

      <span class="text-xs text-slate-400 font-medium self-end sm:self-center font-mono">
        Ditemukan: {{ filteredCoas.length }} Akun COA
      </span>
    </div>

    <div class="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      <div v-if="coaStore.loading"
        class="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 class="w-6 h-6 animate-spin text-indigo-400" />
        <span>Memuat data Master COA...</span>
      </div>

      <div v-else-if="!coaStore.loading && filteredCoas.length === 0"
        class="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
          <BookOpen class="w-6 h-6" />
        </div>
        <p class="font-semibold text-sm text-slate-300">Tidak ada COA ditemukan</p>
        <p class="text-slate-500">Coba sesuaikan pencarian atau tambahkan akun COA baru.</p>
        <button @click="openAddModal"
          class="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2">
          <Plus class="w-4 h-4" />
          <span>Tambah COA Sekarang</span>
        </button>
      </div>

      <div v-else-if="!coaStore.loading">
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800 uppercase font-semibold bg-slate-950/50">
                <th class="py-4 px-6">Kode COA</th>
                <th class="py-4 px-6">Nama Akun COA</th>
                <th class="py-4 px-6">Kategori Master</th>
                <th class="py-4 px-6">Tipe Klasifikasi</th>
                <th class="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-for="coa in filteredCoas" :key="coa.id" class="hover:bg-slate-800/40 transition group">
                <td class="py-4 px-6 font-mono text-indigo-400 font-bold text-sm whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/25">
                    {{ coa.code }}
                  </span>
                </td>
                <td class="py-4 px-6 font-bold text-white text-sm">{{ coa.name }}</td>
                <td class="py-4 px-6">
                  <span
                    class="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-200 font-medium text-xs border border-slate-700/60">
                    {{ coa.category?.name || '-' }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                    coa.category?.type === 'income'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  ]">
                    <component :is="coa.category?.type === 'income' ? ArrowDownRight : ArrowUpRight"
                      class="w-3.5 h-3.5" />
                    <span>{{ coa.category?.type || '-' }}</span>
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                  <button @click="openEditModal(coa)"
                    class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition active:scale-95 inline-flex items-center gap-1.5">
                    <Edit3 class="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button @click="promptDelete(coa)"
                    class="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 font-semibold text-xs border border-rose-800/40 transition active:scale-95 inline-flex items-center gap-1.5">
                    <Trash2 class="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden divide-y divide-slate-800/60 p-3 space-y-3">
          <div v-for="coa in filteredCoas" :key="coa.id"
            class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 hover:border-slate-700 transition">
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/25">
                Kode: {{ coa.code }}
              </span>
              <span :class="[
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                coa.category?.type === 'income'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              ]">
                <component :is="coa.category?.type === 'income' ? ArrowDownRight : ArrowUpRight" class="w-3 h-3" />
                <span>{{ coa.category?.type }}</span>
              </span>
            </div>

            <div>
              <p class="font-bold text-white text-base">{{ coa.name }}</p>
              <p class="text-xs text-slate-400 mt-0.5">Kategori: {{ coa.category?.name }}</p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
              <button @click="openEditModal(coa)"
                class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-indigo-300 font-semibold text-xs flex items-center gap-1">
                <Edit3 class="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button @click="promptDelete(coa)"
                class="px-3.5 py-1.5 rounded-xl bg-rose-950/50 text-rose-300 font-semibold text-xs border border-rose-800/40 flex items-center gap-1">
                <Trash2 class="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div
                class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BookOpen class="w-4 h-4" />
              </div>
              <h3 class="text-base font-extrabold text-white">{{ isEditing ? 'Edit COA' : 'Tambah COA Baru' }}</h3>
            </div>
            <button @click="showModal = false"
              class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="saveCoa" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Kode COA <span
                  class="text-rose-400">*</span></label>
              <input v-model="form.code" type="text" required placeholder="Misal: 404"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Nama Akun COA <span
                  class="text-rose-400">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Misal: Bonus Kinerja / Sewa Bangunan"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Kategori Master <span
                  class="text-rose-400">*</span></label>
              <select v-model="form.category_id" required
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition">
                <option :value="null" disabled>Pilih Kategori...</option>
                <option v-for="cat in coaStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }} ({{ cat.type }})
                </option>
              </select>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" @click="showModal = false"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
                Batal
              </button>
              <button type="submit" :disabled="saving"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center gap-2 transition active:scale-95">
                <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ saving ? 'Menyimpan...' : 'Simpan COA' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AppConfirmModal v-model="showDeleteModal" title="Hapus Akun COA"
      message="Apakah Anda yakin ingin menghapus akun COA ini? Semua mutasi transaksi dengan akun ini dapat terpengaruh."
      :item-name="coaToDelete ? `${coaToDelete.code} - ${coaToDelete.name}` : ''" confirm-text="Ya, Hapus COA"
      :loading="deleting" @confirm="executeDelete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  BookOpen,
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  ArrowDownRight,
  ArrowUpRight,
  Loader2
} from 'lucide-vue-next'

const { fetchApi } = useApi()
const toast = useToast()
const coaStore = useCoaStore()

const searchQuery = ref('')
const categoryFilter = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const showDeleteModal = ref(false)
const coaToDelete = ref(null)
const deleting = ref(false)

const form = ref({
  id: null,
  code: '',
  name: '',
  category_id: null
})

const filteredCoas = computed(() => {
  let list = coaStore.coas

  if (categoryFilter.value) {
    list = list.filter(c => c.category_id == categoryFilter.value)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
  }

  return list
})

const openAddModal = () => {
  isEditing.value = false
  form.value = { id: null, code: '', name: '', category_id: coaStore.categories[0]?.id || null }
  showModal.value = true
}

const openEditModal = (coa) => {
  isEditing.value = true
  form.value = { id: coa.id, code: coa.code, name: coa.name, category_id: coa.category_id }
  showModal.value = true
}

const saveCoa = async () => {
  if (!form.value.code.trim() || !form.value.name.trim()) {
    toast.warning('Kode dan nama COA wajib diisi')
    return
  }

  saving.value = true
  if (isEditing.value) {
    const res = await fetchApi(`/coas/${form.value.id}`, {
      method: 'PUT',
      body: form.value
    })
    if (res.data) {
      toast.success(`Akun COA "${form.value.code} - ${form.value.name}" berhasil diperbarui`)
      showModal.value = false
      await coaStore.refresh()
    } else {
      toast.error(res.error || 'Gagal memperbarui COA')
    }
  } else {
    const res = await fetchApi('/coas', {
      method: 'POST',
      body: form.value
    })
    if (res.data) {
      toast.success(`Akun COA "${form.value.code} - ${form.value.name}" berhasil ditambahkan`)
      showModal.value = false
      await coaStore.refresh()
    } else {
      toast.error(res.error || 'Gagal menambahkan COA')
    }
  }
  saving.value = false
}

const promptDelete = (coa) => {
  coaToDelete.value = coa
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!coaToDelete.value) return
  deleting.value = true
  const res = await fetchApi(`/coas/${coaToDelete.value.id}`, { method: 'DELETE' })
  if (!res.error) {
    toast.success(`Akun COA "${coaToDelete.value.code} - ${coaToDelete.value.name}" telah dihapus`)
    showDeleteModal.value = false
    await coaStore.refresh()
  } else {
    toast.error(res.error || 'Gagal menghapus COA')
  }
  deleting.value = false
}

onMounted(() => {
  coaStore.fetchAll()
})
</script>
