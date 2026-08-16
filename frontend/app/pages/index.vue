<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Header Hero Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
      <!-- Glow ambient background -->
      <div class="absolute -right-12 -top-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Financial Dashboard • FY 2022
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PT. Trans Berjaya Khatulistiwa
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Ringkasan eksekutif arus kas, laba bersih, pengelompokan akun COA, dan performa keuangan perusahaan secara terpadu.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink 
            to="/reports/profit-loss" 
            class="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition active:scale-95 group"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Lihat Laporan Laba Rugi</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <NuxtLink 
            to="/transactions" 
            class="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition active:scale-95"
          >
            <ArrowLeftRight class="w-3.5 h-3.5 text-indigo-400" />
            <span>Daftar Transaksi</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="i" class="h-36 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
        <div class="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 sm:p-8 rounded-3xl bg-rose-950/30 border border-rose-800/50 text-rose-300 flex flex-col items-center text-center space-y-3">
      <AlertCircle class="w-10 h-10 text-rose-400" />
      <div>
        <p class="font-bold text-base text-white">Gagal memuat data dashboard</p>
        <p class="text-xs text-rose-300/80 mt-1 max-w-md">{{ error }}</p>
      </div>
      <button 
        @click="loadDashboard" 
        class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
      >
        <RefreshCw class="w-3.5 h-3.5" />
        <span>Coba Lagi</span>
      </button>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6 sm:space-y-8">
      <!-- Summary KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <!-- Total Income Card -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-300 shadow-xl group relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <TrendingUp class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <p class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {{ formatRupiah(stats?.summary?.total_income) }}
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                <ArrowDownRight class="w-3 h-3" />
                Pendapatan
              </span>
              <span class="text-slate-400">{{ stats?.counts?.categories || 0 }} Kategori</span>
            </div>
          </div>
        </div>

        <!-- Total Expense Card -->
        <div class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-rose-500/40 transition-all duration-300 shadow-xl group relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expense</span>
            <div class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
              <TrendingDown class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <p class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {{ formatRupiah(stats?.summary?.total_expense) }}
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center gap-1">
                <ArrowUpRight class="w-3 h-3" />
                Pengeluaran
              </span>
              <span class="text-slate-400">{{ stats?.counts?.transactions || 0 }} Transaksi</span>
            </div>
          </div>
        </div>

        <!-- Net Income Card -->
        <div class="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 shadow-xl group sm:col-span-2 lg:col-span-1 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all"></div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-300 uppercase tracking-wider">Net Income (Laba Bersih)</span>
            <div class="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition">
              <Sparkles class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <p :class="['text-2xl sm:text-3xl font-extrabold tracking-tight font-mono', (stats?.summary?.net_income || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400']">
              {{ formatRupiah(stats?.summary?.net_income) }}
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span 
                :class="[
                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                  (stats?.summary?.net_income || 0) >= 0 
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                ]"
              >
                {{ (stats?.summary?.net_income || 0) >= 0 ? 'Surplus Operasional' : 'Defisit Operasional' }}
              </span>
              <span class="text-slate-300 font-medium">
                Margin: {{ profitMargin }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trend Chart & Category Breakdown Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- Monthly Trend Bar Chart -->
        <div class="lg:col-span-2 p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BarChart3 class="w-4 h-4" />
              </div>
              <div>
                <h2 class="text-sm sm:text-base font-bold text-white">Tren Performa Keuangan Bulanan</h2>
                <p class="text-xs text-slate-400">Komparasi pemasukan vs pengeluaran per periode</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4 text-xs font-semibold">
              <span class="flex items-center gap-1.5 text-emerald-400">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Income
              </span>
              <span class="flex items-center gap-1.5 text-rose-400">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expense
              </span>
            </div>
          </div>

          <!-- Dynamic Bar Chart Visualization -->
          <div class="grid grid-cols-3 gap-3 sm:gap-6 min-h-[220px] items-end pt-4 px-2">
            <div 
              v-for="item in stats?.monthly_chart" 
              :key="item.month" 
              class="flex flex-col items-center gap-3 h-full justify-end group relative"
            >
              <!-- Bar Columns -->
              <div class="w-full max-w-[130px] flex items-end justify-center gap-2 sm:gap-3 h-48 bg-slate-950/70 rounded-2xl p-2.5 sm:p-3 border border-slate-800/80 shadow-inner group-hover:border-slate-700 transition">
                <!-- Income bar -->
                <div 
                  class="w-6 sm:w-10 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-md shadow-emerald-500/20 cursor-pointer"
                  :style="{ height: `${Math.max(8, Math.round((item.income / maxChartValue) * 100))}%` }"
                  :title="`Income ${item.month}: ${formatRupiah(item.income)}`"
                ></div>
                <!-- Expense bar -->
                <div 
                  class="w-6 sm:w-10 bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125 shadow-md shadow-rose-500/20 cursor-pointer"
                  :style="{ height: `${Math.max(8, Math.round((item.expense / maxChartValue) * 100))}%` }"
                  :title="`Expense ${item.month}: ${formatRupiah(item.expense)}`"
                ></div>
              </div>

              <!-- Month Details -->
              <div class="text-center space-y-0.5">
                <p class="text-xs font-bold text-slate-200">{{ item.month }}</p>
                <p :class="['text-[11px] font-mono font-semibold', item.net >= 0 ? 'text-emerald-400' : 'text-rose-400']">
                  {{ formatRupiah(item.net) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PieChart class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-sm sm:text-base font-bold text-white">Distribusi Kategori</h2>
              <p class="text-xs text-slate-400">Total nominal berdasarkan kategori master</p>
            </div>
          </div>

          <div class="space-y-4">
            <div 
              v-for="cat in stats?.category_breakdown" 
              :key="cat.name" 
              class="space-y-2 p-2.5 rounded-2xl hover:bg-slate-800/40 transition"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-slate-200 flex items-center gap-2 truncate">
                  <span :class="['w-2 h-2 rounded-full shrink-0', cat.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400']"></span>
                  <span class="truncate">{{ cat.name }}</span>
                </span>
                <span class="font-mono text-slate-200 font-semibold shrink-0 ml-2">
                  {{ formatRupiah(cat.total) }}
                </span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                <div 
                  :class="[
                    'h-full rounded-full transition-all duration-500', 
                    cat.type === 'income' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-rose-600 to-rose-400'
                  ]"
                  :style="{ width: `${Math.min(100, Math.max(4, Math.round((cat.total / (stats?.summary?.total_income || stats?.summary?.total_expense || 1)) * 100)))}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table & Mobile Responsive Cards -->
      <div class="p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ArrowLeftRight class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-sm sm:text-base font-bold text-white">Transaksi Terbaru</h2>
              <p class="text-xs text-slate-400">5 transaksi mutasi keuangan terakhir</p>
            </div>
          </div>
          <NuxtLink 
            to="/transactions" 
            class="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <span>Buka Semua Transaksi</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 border-b border-slate-800 uppercase font-semibold bg-slate-950/50">
                <th class="py-3.5 px-5 rounded-l-xl">Tanggal</th>
                <th class="py-3.5 px-5">COA Kode</th>
                <th class="py-3.5 px-5">Akun & Kategori</th>
                <th class="py-3.5 px-5">Keterangan</th>
                <th class="py-3.5 px-5 text-right">Debit (Expense)</th>
                <th class="py-3.5 px-5 text-right rounded-r-xl">Credit (Income)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-medium">
              <tr v-for="tx in stats?.recent_transactions" :key="tx.id" class="hover:bg-slate-800/40 transition">
                <td class="py-3.5 px-5 text-slate-300 font-mono whitespace-nowrap">{{ tx.date }}</td>
                <td class="py-3.5 px-5 font-mono text-indigo-400 font-bold whitespace-nowrap">
                  <span class="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    {{ tx.coa?.code }}
                  </span>
                </td>
                <td class="py-3.5 px-5">
                  <p class="text-white font-semibold">{{ tx.coa?.name }}</p>
                  <p class="text-[11px] text-slate-400">{{ tx.coa?.category?.name }}</p>
                </td>
                <td class="py-3.5 px-5 text-slate-300 max-w-xs truncate">{{ tx.description || '-' }}</td>
                <td class="py-3.5 px-5 text-right font-mono text-rose-400 font-bold whitespace-nowrap">
                  {{ tx.debit > 0 ? formatRupiah(tx.debit) : '-' }}
                </td>
                <td class="py-3.5 px-5 text-right font-mono text-emerald-400 font-bold whitespace-nowrap">
                  {{ tx.credit > 0 ? formatRupiah(tx.credit) : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards View -->
        <div class="md:hidden space-y-3">
          <div 
            v-for="tx in stats?.recent_transactions" 
            :key="tx.id" 
            class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 hover:border-slate-700 transition"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/25">
                {{ tx.coa?.code }}
              </span>
              <span class="text-xs font-mono text-slate-400">{{ tx.date }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-white">{{ tx.coa?.name }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ tx.description || tx.coa?.category?.name }}</p>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
              <span class="text-slate-400 font-medium">Nominal:</span>
              <span v-if="tx.credit > 0" class="font-mono font-bold text-emerald-400">+ {{ formatRupiah(tx.credit) }}</span>
              <span v-else class="font-mono font-bold text-rose-400">- {{ formatRupiah(tx.debit) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  BarChart3, 
  PieChart, 
  ArrowLeftRight, 
  FileSpreadsheet, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  RefreshCw
} from 'lucide-vue-next'

const { fetchApi } = useApi()
const stats = ref(null)
const pending = ref(true)
const error = ref(null)

const profitMargin = computed(() => {
  const inc = stats.value?.summary?.total_income || 0
  const net = stats.value?.summary?.net_income || 0
  if (!inc) return 0
  return Math.round((net / inc) * 100)
})

const maxChartValue = computed(() => {
  if (!stats.value?.monthly_chart?.length) return 10000000
  const vals = stats.value.monthly_chart.flatMap(m => [Number(m.income || 0), Number(m.expense || 0)])
  return Math.max(...vals, 1000000)
})

const loadDashboard = async () => {
  pending.value = true
  error.value = null
  const res = await fetchApi('/dashboard/stats')
  if (res.error) {
    error.value = res.error
  } else {
    stats.value = res.data
  }
  pending.value = false
}

onMounted(() => {
  loadDashboard()
})
</script>
