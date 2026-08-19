<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
      <div class="flex items-center gap-3.5">
        <div
          class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <FolderTree class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Master Kategori COA</h1>
          <p class="text-xs text-slate-400 mt-0.5">Kelola pengelompokan akun pemasukan (Income) dan pengelompokan biaya
            operasional (Expense)</p>
        </div>
      </div>

      <button @click="openAddModal"
        class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition active:scale-95 self-start sm:self-auto shrink-0">
        <Plus class="w-4 h-4" />
        <span>Tambah Kategori</span>
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase">Total Kategori</p>
          <p class="text-xl font-extrabold text-white mt-1">{{ categories.length }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
          <FolderOpen class="w-4 h-4" />
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase">Kategori Income</p>
          <p class="text-xl font-extrabold text-emerald-400 mt-1">{{ incomeCategoriesCount }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <ArrowDownRight class="w-4 h-4" />
        </div>
      </div>
      <div class="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase">Kategori Expense</p>
          <p class="text-xl font-extrabold text-rose-400 mt-1">{{ expenseCategoriesCount }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
          <ArrowUpRight class="w-4 h-4" />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative w-full sm:w-72">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input v-model="searchQuery" type="text" placeholder="Cari nama kategori..."
            class="w-full pl-10 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition" />
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800/80 self-start">
          <button @click="typeFilter = ''" :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition',
            typeFilter === '' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          ]">
            Semua ({{ categories.length }})
          </button>
          <button @click="typeFilter = 'income'" :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5',
            typeFilter === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          ]">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Income</span>
          </button>
          <button @click="typeFilter = 'expense'" :class="[
            'px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5',
            typeFilter === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          ]">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>Expense</span>
          </button>
        </div>
      </div>

      <span class="text-xs text-slate-400 font-medium self-end sm:self-center font-mono">
        Ditemukan: {{ filteredCategories.length }} Kategori
      </span>
    </div>

    <div class="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      <div v-if="pending"
        class="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 class="w-6 h-6 animate-spin text-indigo-400" />
        <span>Memuat data master kategori...</span>
      </div>

      <div v-else-if="filteredCategories.length === 0"
        class="p-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
          <FolderOpen class="w-6 h-6" />
        </div>
        <p class="font-semibold text-sm text-slate-300">Tidak ada kategori ditemukan</p>
        <p class="text-slate-500">Coba ubah kata kunci pencarian atau buat kategori baru.</p>
        <button @click="openAddModal"
          class="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2">
          <Plus class="w-4 h-4" />
          <span>Tambah Kategori Sekarang</span>
        </button>
      </div>

      <div v-else>
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800 uppercase font-semibold bg-slate-950/50">
                <th class="py-4 px-6"># ID</th>
                <th class="py-4 px-6">Nama Kategori</th>
                <th class="py-4 px-6">Tipe Klasifikasi</th>
                <th class="py-4 px-6 text-center">Jumlah Sub-COA</th>
                <th class="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-for="cat in filteredCategories" :key="cat.id" class="hover:bg-slate-800/40 transition group">
                <td class="py-4 px-6 text-slate-400 font-mono">#{{ cat.id }}</td>
                <td class="py-4 px-6 font-bold text-white text-sm">
                  <div class="flex items-center gap-2.5">
                    <span
                      :class="['w-2 h-2 rounded-full', cat.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400']"></span>
                    <span>{{ cat.name }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                    cat.type === 'income'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  ]">
                    <component :is="cat.type === 'income' ? ArrowDownRight : ArrowUpRight" class="w-3.5 h-3.5" />
                    <span>{{ cat.type }}</span>
                  </span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span
                    class="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-300 font-mono text-xs border border-slate-700/60">
                    {{ cat.coas_count || 0 }} Accounts
                  </span>
                </td>
                <td class="py-4 px-6 text-right space-x-2">
                  <button @click="openEditModal(cat)"
                    class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition active:scale-95 inline-flex items-center gap-1.5">
                    <Edit3 class="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button @click="promptDelete(cat)"
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
          <div v-for="cat in filteredCategories" :key="cat.id"
            class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 hover:border-slate-700 transition">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono text-slate-500">ID: #{{ cat.id }}</span>
              <span :class="[
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                cat.type === 'income'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              ]">
                <component :is="cat.type === 'income' ? ArrowDownRight : ArrowUpRight" class="w-3 h-3" />
                <span>{{ cat.type }}</span>
              </span>
            </div>

            <div>
              <p class="font-bold text-white text-base">{{ cat.name }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ cat.coas_count || 0 }} Sub-COA terdaftar</p>
            </div>

            <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
              <button @click="openEditModal(cat)"
                class="px-3.5 py-1.5 rounded-xl bg-slate-800 text-indigo-300 font-semibold text-xs flex items-center gap-1">
                <Edit3 class="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button @click="promptDelete(cat)"
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
                <FolderTree class="w-4 h-4" />
              </div>
              <h3 class="text-base font-extrabold text-white">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
              </h3>
            </div>
            <button @click="showModal = false"
              class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1.5">Nama Kategori <span
                  class="text-rose-400">*</span></label>
              <input v-model="form.name" type="text" required placeholder="Misal: Operational Expense"
                class="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-2">Tipe Klasifikasi <span
                  class="text-rose-400">*</span></label>
              <div class="grid grid-cols-2 gap-3">
                <label :class="[
                  'flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition',
                  form.type === 'income' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                ]">
                  <input type="radio" v-model="form.type" value="income" class="hidden" />
                  <ArrowDownRight class="w-4 h-4 text-emerald-400" />
                  <div>
                    <p class="text-xs font-bold">Income</p>
                    <p class="text-[10px] text-slate-400">Pemasukan</p>
                  </div>
                </label>
                <label :class="[
                  'flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition',
                  form.type === 'expense' ? 'bg-rose-500/10 border-rose-500/50 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                ]">
                  <input type="radio" v-model="form.type" value="expense" class="hidden" />
                  <ArrowUpRight class="w-4 h-4 text-rose-400" />
                  <div>
                    <p class="text-xs font-bold">Expense</p>
                    <p class="text-[10px] text-slate-400">Biaya / Beban</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" @click="showModal = false"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
                Batal
              </button>
              <button type="submit" :disabled="saving"
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center gap-2 transition active:scale-95">
                <Loader2 v-if="saving" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ saving ? 'Menyimpan...' : 'Simpan Kategori' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <AppConfirmModal v-model="showDeleteModal" title="Hapus Kategori COA"
      message="Apakah Anda yakin ingin menghapus kategori ini? Semua sub-COA di bawah kategori ini dapat terpengaruh."
      :item-name="categoryToDelete?.name" confirm-text="Ya, Hapus Kategori" :loading="deleting"
      @confirm="executeDelete" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  FolderTree,
  FolderOpen,
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

const categories = ref([])
const pending = ref(true)
const searchQuery = ref('')
const typeFilter = ref('')

const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const showDeleteModal = ref(false)
const categoryToDelete = ref(null)
const deleting = ref(false)

const form = ref({
  id: null,
  name: '',
  type: 'expense'
})

const incomeCategoriesCount = computed(() => {
  return categories.value.filter(c => c.type === 'income').length
})

const expenseCategoriesCount = computed(() => {
  return categories.value.filter(c => c.type === 'expense').length
})

const loadCategories = async () => {
  pending.value = true
  const res = await fetchApi('/categories')
  if (res.data) {
    categories.value = res.data
  } else if (res.error) {
    toast.error(res.error, 'Gagal memuat kategori')
  }
  pending.value = false
}

const filteredCategories = computed(() => {
  let list = categories.value
  if (typeFilter.value) {
    list = list.filter(c => c.type === typeFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(q))
  }
  return list
})

const openAddModal = () => {
  isEditing.value = false
  form.value = { id: null, name: '', type: 'expense' }
  showModal.value = true
}

const openEditModal = (cat) => {
  isEditing.value = true
  form.value = { id: cat.id, name: cat.name, type: cat.type }
  showModal.value = true
}

const saveCategory = async () => {
  if (!form.value.name.trim()) {
    toast.warning('Nama kategori tidak boleh kosong')
    return
  }

  saving.value = true
  if (isEditing.value) {
    const res = await fetchApi(`/categories/${form.value.id}`, {
      method: 'PUT',
      body: form.value
    })
    if (res.data) {
      toast.success(`Kategori "${form.value.name}" berhasil diperbarui`)
      showModal.value = false
      await loadCategories()
    } else {
      toast.error(res.error || 'Gagal memperbarui kategori')
    }
  } else {
    const res = await fetchApi('/categories', {
      method: 'POST',
      body: form.value
    })
    if (res.data) {
      toast.success(`Kategori "${form.value.name}" berhasil ditambahkan`)
      showModal.value = false
      await loadCategories()
    } else {
      toast.error(res.error || 'Gagal menambahkan kategori')
    }
  }
  saving.value = false
}

const promptDelete = (cat) => {
  categoryToDelete.value = cat
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!categoryToDelete.value) return
  deleting.value = true
  const res = await fetchApi(`/categories/${categoryToDelete.value.id}`, { method: 'DELETE' })
  if (!res.error) {
    toast.success(`Kategori "${categoryToDelete.value.name}" telah dihapus`)
    showDeleteModal.value = false
    await loadCategories()
  } else {
    toast.error(res.error || 'Gagal menghapus kategori')
  }
  deleting.value = false
}

onMounted(() => {
  loadCategories()
})
</script>
