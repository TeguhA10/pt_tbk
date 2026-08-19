<template>
  <div class="space-y-6 sm:space-y-8">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl">
      <div class="space-y-1.5">
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Financial Statement • Laporan Laba Rugi
        </div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Laporan Profit / Loss (Laba Rugi)
        </h1>
        <p class="text-xs text-slate-400">
          Rekapitulasi pendapatan dan pengeluaran operasional per periode bulan Q1 2022
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 self-start sm:self-auto">
        <button @click="windowPrint"
          class="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition active:scale-95">
          <Printer class="w-4 h-4 text-slate-400" />
          <span class="hidden sm:inline">Cetak PDF</span>
        </button>

        <a :href="`${apiBase}/reports/profit-loss/export`" target="_blank" download
          class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition active:scale-95 group">
          <Download class="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          <span>Export Excel</span>
        </a>
      </div>
    </div>

    <div v-if="reportData" class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div class="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase">Total Pendapatan (Q1)</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <p class="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
          {{ formatRupiah(overallIncome) }}
        </p>
      </div>

      <div class="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-400 uppercase">Total Biaya Operasional</span>
          <div class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <TrendingDown class="w-4 h-4" />
          </div>
        </div>
        <p class="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono">
          {{ formatRupiah(overallExpense) }}
        </p>
      </div>

      <div
        class="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-indigo-300 uppercase">Laba Bersih Akumulasi</span>
          <div class="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles class="w-4 h-4" />
          </div>
        </div>
        <p
          :class="['text-xl sm:text-2xl font-extrabold font-mono', overallNet >= 0 ? 'text-emerald-400' : 'text-rose-400']">
          {{ formatRupiah(overallNet) }}
        </p>
      </div>
    </div>

    <div class="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      <div
        class="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 class="text-sm sm:text-base font-extrabold text-white tracking-tight">PT. TRANS BERJAYA KHATULISTIWA</h2>
          <p class="text-xs font-mono text-slate-400 mt-0.5">
            PERIODE LAPORAN: {{ reportData?.months?.[0] || 'Jan 2022' }} s/d {{
              reportData?.months?.[reportData?.months?.length - 1] || 'Mar 2022' }}
          </p>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-emerald-400">Live Auto-Calculated</span>
        </div>
      </div>

      <div v-if="pending"
        class="p-20 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 class="w-6 h-6 animate-spin text-indigo-400" />
        <span>Menghitung dan menyusun laporan profit & loss...</span>
      </div>

      <div v-else class="overflow-x-auto relative">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr
              class="bg-slate-950/90 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
              <th
                class="py-4 px-6 sticky left-0 z-20 bg-slate-950/95 backdrop-blur-sm min-w-[220px] border-r border-slate-800/60">
                Kategori Akun
              </th>
              <th v-for="month in reportData?.months" :key="month" class="py-4 px-6 text-right font-mono text-xs">
                {{ month }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50 text-xs font-medium">
            <tr class="bg-slate-950/80">
              <td :colspan="(reportData?.months?.length || 0) + 1"
                class="py-3 px-6 text-emerald-400 font-extrabold uppercase text-[11px] tracking-wider border-y border-slate-800 sticky left-0 z-10 bg-slate-950">
                ▸ Income (Pemasukan)
              </td>
            </tr>

            <tr v-for="incCat in reportData?.income_categories" :key="incCat.id"
              class="hover:bg-slate-800/40 transition group">
              <td
                class="py-3.5 px-6 sm:px-8 text-slate-200 font-semibold sticky left-0 z-10 bg-slate-900/95 border-r border-slate-800/60">
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                  <span class="truncate">{{ incCat.name }}</span>
                </div>
              </td>
              <td v-for="month in reportData?.months" :key="month"
                class="py-3.5 px-6 text-right font-mono text-slate-200">
                {{ formatRupiah(incCat.amounts[month]) }}
              </td>
            </tr>

            <tr class="bg-emerald-950/30 border-y-2 border-emerald-500/30 text-emerald-300 font-extrabold text-xs">
              <td
                class="py-4 px-6 uppercase tracking-wider sticky left-0 z-10 bg-slate-950/95 border-r border-slate-800/60">
                Total Income
              </td>
              <td v-for="month in reportData?.months" :key="month"
                class="py-4 px-6 text-right font-mono text-emerald-400 text-sm font-extrabold">
                {{ formatRupiah(reportData?.total_income[month]) }}
              </td>
            </tr>

            <tr class="bg-slate-950/80">
              <td :colspan="(reportData?.months?.length || 0) + 1"
                class="py-3 px-6 text-rose-400 font-extrabold uppercase text-[11px] tracking-wider border-y border-slate-800 sticky left-0 z-10 bg-slate-950">
                ▸ Expense (Pengeluaran Operasional)
              </td>
            </tr>

            <tr v-for="expCat in reportData?.expense_categories" :key="expCat.id"
              class="hover:bg-slate-800/40 transition group">
              <td
                class="py-3.5 px-6 sm:px-8 text-slate-200 font-semibold sticky left-0 z-10 bg-slate-900/95 border-r border-slate-800/60">
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                  <span class="truncate">{{ expCat.name }}</span>
                </div>
              </td>
              <td v-for="month in reportData?.months" :key="month"
                class="py-3.5 px-6 text-right font-mono text-slate-200">
                {{ formatRupiah(expCat.amounts[month]) }}
              </td>
            </tr>

            <tr class="bg-rose-950/30 border-y-2 border-rose-500/30 text-rose-300 font-extrabold text-xs">
              <td
                class="py-4 px-6 uppercase tracking-wider sticky left-0 z-10 bg-slate-950/95 border-r border-slate-800/60">
                Total Expense
              </td>
              <td v-for="month in reportData?.months" :key="month"
                class="py-4 px-6 text-right font-mono text-rose-400 text-sm font-extrabold">
                {{ formatRupiah(reportData?.total_expense[month]) }}
              </td>
            </tr>

            <tr
              class="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border-t-2 border-b-4 border-indigo-500/40 text-white font-extrabold text-sm">
              <td
                class="py-5 px-6 uppercase tracking-wider text-indigo-300 sticky left-0 z-10 bg-slate-950/95 border-r border-slate-800/60">
                <div class="flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-emerald-400" />
                  <span>Net Income (Laba Bersih)</span>
                </div>
              </td>
              <td v-for="month in reportData?.months" :key="month" :class="[
                'py-5 px-6 text-right font-mono text-sm sm:text-base font-extrabold',
                (reportData?.net_income[month] || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
              ]">
                {{ formatRupiah(reportData?.net_income[month]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Loader2
} from 'lucide-vue-next'

const { apiBase, fetchApi } = useApi()
const toast = useToast()

const reportData = ref(null)
const pending = ref(true)

const overallIncome = computed(() => {
  if (!reportData.value?.total_income) return 0
  return Object.values(reportData.value.total_income).reduce((sum, val) => sum + Number(val || 0), 0)
})

const overallExpense = computed(() => {
  if (!reportData.value?.total_expense) return 0
  return Object.values(reportData.value.total_expense).reduce((sum, val) => sum + Number(val || 0), 0)
})

const overallNet = computed(() => {
  return overallIncome.value - overallExpense.value
})

const windowPrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

const loadReport = async () => {
  pending.value = true
  const res = await fetchApi('/reports/profit-loss')
  if (res.data) {
    reportData.value = res.data
  } else if (res.error) {
    toast.error(res.error, 'Gagal memuat laporan')
  }
  pending.value = false
}

onMounted(() => {
  loadReport()
})
</script>

<style>
@media print {

  aside,
  header,
  footer,
  button,
  a {
    display: none !important;
  }

  body,
  main {
    background: white !important;
    color: black !important;
    padding: 0 !important;
  }
}
</style>
