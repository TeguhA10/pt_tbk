<template>
  <div class="space-y-6 sm:space-y-8">
    <div
      class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
      <div class="absolute -right-12 -top-12 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none">
      </div>
      <div class="absolute -left-12 -bottom-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none">
      </div>

      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Financial Dashboard • FY 2022
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PT. Trans Berjaya Khatulistiwa
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Ringkasan eksekutif arus kas, laba bersih, pengelompokan akun COA, dan performa keuangan perusahaan secara
            terpadu.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink to="/reports/profit-loss"
            class="px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition active:scale-95 group">
            <FileSpreadsheet class="w-4 h-4" />
            <span>Lihat Laporan Laba Rugi</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
          <NuxtLink to="/transactions"
            class="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition active:scale-95">
            <ArrowLeftRight class="w-3.5 h-3.5 text-indigo-400" />
            <span>Daftar Transaksi</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="pending" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="i" class="h-36 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse">
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
        <div class="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse"></div>
      </div>
    </div>

    <div v-else-if="error"
      class="p-6 sm:p-8 rounded-3xl bg-rose-950/30 border border-rose-800/50 text-rose-300 flex flex-col items-center text-center space-y-3">
      <AlertCircle class="w-10 h-10 text-rose-400" />
      <div>
        <p class="font-bold text-base text-white">Gagal memuat data dashboard</p>
        <p class="text-xs text-rose-300/80 mt-1 max-w-md">{{ error }}</p>
      </div>
      <button @click="loadDashboard"
        class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2">
        <RefreshCw class="w-3.5 h-3.5" />
        <span>Coba Lagi</span>
      </button>
    </div>

    <div v-else class="space-y-6 sm:space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div
          class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-300 shadow-xl group relative overflow-hidden">
          <div
            class="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all">
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Income</span>
            <div
              class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <TrendingUp class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <p class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {{ formatRupiah(stats?.summary?.total_income) }}
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                <ArrowDownRight class="w-3 h-3" />
                Pendapatan
              </span>
              <span class="text-slate-400">{{ stats?.counts?.categories || 0 }} Kategori</span>
            </div>
          </div>
        </div>

        <div
          class="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-rose-500/40 transition-all duration-300 shadow-xl group relative overflow-hidden">
          <div
            class="absolute -right-8 -top-8 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all">
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expense</span>
            <div
              class="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
              <TrendingDown class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <p class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
              {{ formatRupiah(stats?.summary?.total_expense) }}
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/25 flex items-center gap-1">
                <ArrowUpRight class="w-3 h-3" />
                Pengeluaran
              </span>
              <span class="text-slate-400">{{ stats?.counts?.transactions || 0 }} Transaksi</span>
            </div>
          </div>
        </div>

        <div
          class="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 shadow-xl group sm:col-span-2 lg:col-span-1 relative overflow-hidden">
          <div
            class="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all">
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-300 uppercase tracking-wider">Net Income (Laba Bersih)</span>
            <div
              class="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:scale-110 transition">
              <Sparkles class="w-5 h-5" />
            </div>
          </div>
          <div class="mt-4">
            <p
              :class="['text-2xl sm:text-3xl font-extrabold tracking-tight font-mono', (stats?.summary?.net_income || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400']">
              {{ formatRupiah(stats?.summary?.net_income) }}
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-3 text-xs">
              <span :class="[
                'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                (stats?.summary?.net_income || 0) >= 0
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              ]">
                {{ (stats?.summary?.net_income || 0) >= 0 ? 'Surplus Operasional' : 'Defisit Operasional' }}
              </span>
              <span class="text-slate-300 font-medium">
                Margin: {{ profitMargin }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div
          class="lg:col-span-2 p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col space-y-6 relative overflow-hidden backdrop-blur-sm">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none">
          </div>

          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div class="flex items-center gap-3.5">
              <div
                class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <BarChart3 class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">Tren Performa Keuangan Bulanan
                  </h2>
                  <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Q1 2022
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">Analisis arus kas masuk vs keluar dan laba operasional</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                <button @click="chartViewMode = 'chart'"
                  :class="['px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5', chartViewMode === 'chart' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200']">
                  <BarChart3 class="w-3.5 h-3.5" />
                  <span>Grafik</span>
                </button>
                <button @click="chartViewMode = 'table'"
                  :class="['px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5', chartViewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200']">
                  <Table class="w-3.5 h-3.5" />
                  <span>Tabel</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="chartViewMode === 'chart'" class="space-y-6">
            <div class="relative w-full h-[260px] sm:h-[320px] md:h-[360px]">
              <Bar :data="chartData" :options="chartOptions" />
            </div>

            <div class="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 pt-3 border-t border-slate-800/80 text-center">
              <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Pendapatan</p>
                <p class="text-xs sm:text-sm font-mono font-extrabold text-emerald-400 mt-0.5">
                  {{ formatRupiah(monthlyStatsAverage.income) }}
                </p>
              </div>
              <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Pengeluaran</p>
                <p class="text-xs sm:text-sm font-mono font-extrabold text-rose-400 mt-0.5">
                  {{ formatRupiah(monthlyStatsAverage.expense) }}
                </p>
              </div>
              <div class="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Laba Bersih</p>
                <p class="text-xs sm:text-sm font-mono font-extrabold text-indigo-300 mt-0.5">
                  {{ formatRupiah(monthlyStatsAverage.net) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full h-full text-left text-xs">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800 uppercase font-semibold bg-slate-950/60">
                  <th class="py-3 px-4 rounded-l-xl">Periode</th>
                  <th class="py-3 px-4 text-right">Income (Pendapatan)</th>
                  <th class="py-3 px-4 text-right">Expense (Beban)</th>
                  <th class="py-3 px-4 text-right">Net Income (Laba)</th>
                  <th class="py-3 px-4 text-right rounded-r-xl">Profit Margin</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 font-medium">
                <tr v-for="item in stats?.monthly_chart" :key="item.month" class="hover:bg-slate-800/30 transition">
                  <td class="py-3.5 px-4 font-bold text-white font-mono">{{ formatMonthName(item.month) }}</td>
                  <td class="py-3.5 px-4 text-right font-mono text-emerald-400 font-semibold">{{
                    formatRupiah(item.income) }}</td>
                  <td class="py-3.5 px-4 text-right font-mono text-rose-400 font-semibold">{{ formatRupiah(item.expense)
                    }}</td>
                  <td class="py-3.5 px-4 text-right font-mono font-bold"
                    :class="item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ item.net >= 0 ? '+' : '' }}{{ formatRupiah(item.net) }}
                  </td>
                  <td class="py-3.5 px-4 text-right font-mono text-indigo-300 font-bold">
                    {{ item.income > 0 ? Math.round((item.net / item.income) * 100) : 0 }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden backdrop-blur-sm">
          <div
            class="absolute -right-16 -bottom-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none">
          </div>

          <div>
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-5">
              <div class="flex items-center gap-3">
                <div
                  class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-700/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <PieChart class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">Distribusi Kategori</h2>
                  <p class="text-xs text-slate-400">Total nominal berdasarkan kategori master</p>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-slate-400">
                {{ stats?.category_breakdown?.length || 0 }} Kategori
              </span>
            </div>

            <div class="space-y-4 mt-5">
              <div v-for="cat in stats?.category_breakdown" :key="cat.name + cat.type"
                class="space-y-1.5 p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/60 transition group">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-200 flex items-center gap-2 truncate">
                    <span
                      :class="['w-2.5 h-2.5 rounded-full shrink-0 shadow-sm', cat.type === 'income' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-rose-400 shadow-rose-400/50']"></span>
                    <span class="truncate font-semibold text-slate-100">{{ cat.name }}</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider"
                      :class="cat.type === 'income' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'">
                      {{ cat.type }}
                    </span>
                  </span>
                  <div class="flex items-center gap-2 shrink-0 ml-2">
                    <span class="text-[11px] font-bold font-mono text-indigo-300">
                      {{ getCategoryPercent(cat) }}%
                    </span>
                    <span class="font-mono text-slate-100 font-bold text-xs">
                      {{ formatRupiah(cat.total) }}
                    </span>
                  </div>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800/80">
                  <div :class="[
                    'h-full rounded-full transition-all duration-700 ease-out',
                    cat.type === 'income' ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400'
                  ]" :style="{ width: `${getCategoryPercent(cat)}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Proporsi terhadap total kelompok</span>
            <NuxtLink to="/transactions"
              class="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>Detail Akun</span>
              <ArrowRight class="w-3 h-3" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ArrowLeftRight class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-sm sm:text-base font-bold text-white">Transaksi Terbaru</h2>
              <p class="text-xs text-slate-400">5 transaksi mutasi keuangan terakhir</p>
            </div>
          </div>
          <NuxtLink to="/transactions"
            class="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 group self-start sm:self-auto">
            <span>Buka Semua Transaksi</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>

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

        <div class="md:hidden space-y-3">
          <div v-for="tx in stats?.recent_transactions" :key="tx.id"
            class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 hover:border-slate-700 transition">
            <div class="flex items-center justify-between">
              <span
                class="px-2 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 font-mono font-bold text-xs border border-indigo-500/25">
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
              <span v-if="tx.credit > 0" class="font-mono font-bold text-emerald-400">+ {{ formatRupiah(tx.credit)
                }}</span>
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
  RefreshCw,
  Table
} from 'lucide-vue-next'

// --- Chart.js ---
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { fetchApi } = useApi()
const stats = ref(null)
const pending = ref(true)
const error = ref(null)
const chartViewMode = ref('chart')

const profitMargin = computed(() => {
  const inc = stats.value?.summary?.total_income || 0
  const net = stats.value?.summary?.net_income || 0
  if (!inc) return 0
  return Math.round((net / inc) * 100)
})

const formatMonthName = (monthStr) => {
  if (!monthStr) return ''
  const [year, month] = monthStr.split('-')
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  const idx = parseInt(month, 10) - 1
  return `${monthNames[idx] || month} ${year}`
}

const formatCompactRupiah = (val) => {
  if (val === null || val === undefined || isNaN(Number(val))) return 'Rp 0'
  const num = Math.abs(Number(val))
  const sign = Number(val) < 0 ? '-' : ''
  if (num >= 1_000_000_000) {
    return `${sign}Rp ${(num / 1_000_000_000).toFixed(1).replace('.0', '')} M`
  }
  if (num >= 1_000_000) {
    return `${sign}Rp ${(num / 1_000_000).toFixed(1).replace('.0', '')} Jt`
  }
  if (num >= 1_000) {
    return `${sign}Rp ${(num / 1_000).toFixed(0)} Rb`
  }
  return `${sign}Rp ${num}`
}

const monthlyStatsAverage = computed(() => {
  const list = stats.value?.monthly_chart || []
  if (!list.length) return { income: 0, expense: 0, net: 0 }
  const totalInc = list.reduce((acc, curr) => acc + Number(curr.income || 0), 0)
  const totalExp = list.reduce((acc, curr) => acc + Number(curr.expense || 0), 0)
  const totalNet = list.reduce((acc, curr) => acc + Number(curr.net || 0), 0)
  return {
    income: Math.round(totalInc / list.length),
    expense: Math.round(totalExp / list.length),
    net: Math.round(totalNet / list.length)
  }
})

const getCategoryPercent = (cat) => {
  if (!cat || !cat.total) return 0
  const base = cat.type === 'income'
    ? Number(stats.value?.summary?.total_income || 1)
    : Number(stats.value?.summary?.total_expense || 1)
  if (base <= 0) return 0
  return Math.min(100, Math.max(2, Math.round((Number(cat.total) / base) * 100)))
}

// --- Chart.js: data & options (menggantikan bar chart manual) ---
const chartData = computed(() => {
  const list = stats.value?.monthly_chart || []
  return {
    labels: list.map(item => formatMonthName(item.month)),
    datasets: [
      {
        label: 'Income',
        data: list.map(item => Number(item.income || 0)),
        backgroundColor: '#10b981', // emerald-500
        hoverBackgroundColor: '#34d399',
        borderRadius: 8,
        maxBarThickness: 36
      },
      {
        label: 'Expense',
        data: list.map(item => Number(item.expense || 0)),
        backgroundColor: '#f43f5e', // rose-500
        hoverBackgroundColor: '#fb7185',
        borderRadius: 8,
        maxBarThickness: 36
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#cbd5e1', // slate-300
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 11, weight: 'bold' }
      }
    },
    tooltip: {
      backgroundColor: '#0f172a', // slate-900
      borderColor: '#334155',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#cbd5e1',
      padding: 10,
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${formatRupiah(ctx.raw)}`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#94a3b8', // slate-400
        font: { size: 10, weight: 'bold' }
      }
    },
    y: {
      grid: { color: 'rgba(148,163,184,0.12)' },
      ticks: {
        color: '#94a3b8',
        font: { size: 10 },
        callback: (val) => formatCompactRupiah(val)
      }
    }
  }
}))

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