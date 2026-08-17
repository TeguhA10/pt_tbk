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
        <!-- Monthly Trend Professional Chart -->
        <div class="lg:col-span-2 p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden backdrop-blur-sm">
          <!-- Ambient Glow Background -->
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Chart Card Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <BarChart3 class="w-5 h-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">Tren Performa Keuangan Bulanan</h2>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Q1 2022
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">Analisis arus kas masuk vs keluar dan laba operasional</p>
              </div>
            </div>
            
            <!-- View Mode Switcher & Legend -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                <button 
                  @click="chartViewMode = 'chart'"
                  :class="['px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5', chartViewMode === 'chart' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200']"
                >
                  <BarChart3 class="w-3.5 h-3.5" />
                  <span>Grafik</span>
                </button>
                <button 
                  @click="chartViewMode = 'table'"
                  :class="['px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5', chartViewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200']"
                >
                  <Table class="w-3.5 h-3.5" />
                  <span>Tabel</span>
                </button>
              </div>

              <div class="hidden sm:flex items-center gap-3 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                <span class="flex items-center gap-1.5 text-emerald-400">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span> Income
                </span>
                <span class="flex items-center gap-1.5 text-rose-400">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span> Expense
                </span>
              </div>
            </div>
          </div>

          <!-- Mode 1: High-Tech Dual Bar Chart -->
          <div v-if="chartViewMode === 'chart'" class="space-y-6">
            <!-- Chart Stage with Y-Axis Gridlines -->
            <div class="relative min-h-[260px] pt-6 pb-2 px-1 flex">
              <!-- Y-Axis Scale Labels -->
              <div class="flex flex-col justify-between text-[10px] font-mono text-slate-500 pr-3 select-none text-right w-14 shrink-0 pb-12">
                <span>{{ formatCompactRupiah(chartYMax) }}</span>
                <span>{{ formatCompactRupiah(chartYMax * 0.75) }}</span>
                <span>{{ formatCompactRupiah(chartYMax * 0.5) }}</span>
                <span>{{ formatCompactRupiah(chartYMax * 0.25) }}</span>
                <span>Rp 0</span>
              </div>

              <!-- Gridlines & Columns Container -->
              <div class="relative flex-1 flex flex-col justify-between">
                <!-- Dashed Horizontal Grid Lines -->
                <div class="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none pb-12">
                  <div class="w-full border-b border-slate-800/60 border-dashed"></div>
                  <div class="w-full border-b border-slate-800/40 border-dashed"></div>
                  <div class="w-full border-b border-slate-800/40 border-dashed"></div>
                  <div class="w-full border-b border-slate-800/40 border-dashed"></div>
                  <div class="w-full border-b border-slate-700/80"></div>
                </div>

                <!-- Monthly Bar Groups -->
                <div class="relative z-10 flex items-end justify-around h-full gap-2 sm:gap-6 pb-2">
                  <div 
                    v-for="(item, idx) in stats?.monthly_chart" 
                    :key="item.month" 
                    class="flex flex-1 flex-col items-center justify-end h-full group relative max-w-[170px]"
                  >
                    <!-- Pillars Box -->
                    <div class="w-full h-48 flex items-end justify-center gap-2 sm:gap-3.5 px-2">
                      <!-- Income Bar -->
                      <div class="relative flex flex-col items-center h-full justify-end group/bar">
                        <!-- Value floating badge on hover -->
                        <div class="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-30 px-2 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold whitespace-nowrap shadow-xl">
                          +{{ formatRupiah(item.income) }}
                        </div>
                        <div 
                          class="w-6 sm:w-11 bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 rounded-t-xl transition-all duration-500 group-hover/bar:brightness-125 shadow-lg shadow-emerald-500/20 cursor-pointer relative overflow-hidden"
                          :style="{ height: `${Math.max(6, Math.min(100, Math.round((Number(item.income || 0) / chartYMax) * 100)))}%` }"
                        >
                          <div class="absolute inset-x-0 top-0 h-1.5 bg-emerald-200/40 rounded-t-xl"></div>
                        </div>
                      </div>

                      <!-- Expense Bar -->
                      <div class="relative flex flex-col items-center h-full justify-end group/bar">
                        <!-- Value floating badge on hover -->
                        <div class="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-30 px-2 py-0.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold whitespace-nowrap shadow-xl">
                          -{{ formatRupiah(item.expense) }}
                        </div>
                        <div 
                          class="w-6 sm:w-11 bg-gradient-to-t from-rose-600 via-rose-500 to-pink-400 rounded-t-xl transition-all duration-500 group-hover/bar:brightness-125 shadow-lg shadow-rose-500/20 cursor-pointer relative overflow-hidden"
                          :style="{ height: `${Math.max(6, Math.min(100, Math.round((Number(item.expense || 0) / chartYMax) * 100)))}%` }"
                        >
                          <div class="absolute inset-x-0 top-0 h-1.5 bg-rose-200/40 rounded-t-xl"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Month Label & Net Status -->
                    <div class="mt-3 text-center space-y-1 w-full">
                      <p class="text-xs font-extrabold text-slate-200 tracking-wide">
                        {{ formatMonthName(item.month) }}
                      </p>
                      <div 
                        :class="[
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition',
                          item.net >= 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 group-hover:bg-rose-500/20'
                        ]"
                        :title="`Net Cashflow: ${formatRupiah(item.net)}`"
                      >
                        <TrendingUp v-if="item.net >= 0" class="w-3 h-3 text-emerald-400" />
                        <TrendingDown v-else class="w-3 h-3 text-rose-400" />
                        <span>{{ formatCompactRupiah(item.net) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Summary Chips -->
            <div class="grid grid-cols-3 gap-2 sm:gap-4 pt-3 border-t border-slate-800/80 text-center">
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

          <!-- Mode 2: Detailed Performance Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-xs">
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
                  <td class="py-3.5 px-4 text-right font-mono text-emerald-400 font-semibold">{{ formatRupiah(item.income) }}</td>
                  <td class="py-3.5 px-4 text-right font-mono text-rose-400 font-semibold">{{ formatRupiah(item.expense) }}</td>
                  <td class="py-3.5 px-4 text-right font-mono font-bold" :class="item.net >= 0 ? 'text-emerald-400' : 'text-rose-400'">
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

        <!-- Category Breakdown Enhanced Card -->
        <div class="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden backdrop-blur-sm">
          <!-- Ambient Glow -->
          <div class="absolute -right-16 -bottom-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div class="flex items-center justify-between border-b border-slate-800/80 pb-5">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-700/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
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

            <!-- List Categories -->
            <div class="space-y-4 mt-5">
              <div 
                v-for="cat in stats?.category_breakdown" 
                :key="cat.name + cat.type" 
                class="space-y-1.5 p-2.5 rounded-2xl bg-slate-950/40 hover:bg-slate-800/50 border border-slate-800/60 transition group"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-200 flex items-center gap-2 truncate">
                    <span :class="['w-2.5 h-2.5 rounded-full shrink-0 shadow-sm', cat.type === 'income' ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-rose-400 shadow-rose-400/50']"></span>
                    <span class="truncate font-semibold text-slate-100">{{ cat.name }}</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider" :class="cat.type === 'income' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'">
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
                  <div 
                    :class="[
                      'h-full rounded-full transition-all duration-700 ease-out', 
                      cat.type === 'income' ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-400'
                    ]"
                    :style="{ width: `${getCategoryPercent(cat)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Micro Info -->
          <div class="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Proporsi terhadap total kelompok</span>
            <NuxtLink to="/transactions" class="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>Detail Akun</span>
              <ArrowRight class="w-3 h-3" />
            </NuxtLink>
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
  RefreshCw,
  Table
} from 'lucide-vue-next'

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

const chartYMax = computed(() => {
  if (!stats.value?.monthly_chart?.length) return 20000000
  const vals = stats.value.monthly_chart.flatMap(m => [Number(m.income || 0), Number(m.expense || 0)])
  const highest = Math.max(...vals, 1000000)
  // Round up to nice clean ceiling (e.g. 20,000,000)
  const magnitude = Math.pow(10, Math.floor(Math.log10(highest)))
  return Math.ceil(highest / (magnitude / 2)) * (magnitude / 2) || 20000000
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
