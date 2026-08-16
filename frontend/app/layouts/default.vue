<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white font-sans">
    <!-- Mobile Sidebar Backdrop Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        @click="isMobileMenuOpen = false" 
        class="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
      ></div>
    </Transition>

    <!-- Sidebar Navigation -->
    <aside 
      :class="[
        'fixed md:sticky top-0 z-50 h-screen w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="space-y-6">
        <!-- Brand Header & Close Button for Mobile -->
        <div class="flex items-center justify-between px-2 pt-1 pb-2">
          <NuxtLink to="/" @click="isMobileMenuOpen = false" class="flex items-center gap-3.5 group">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 font-extrabold text-white text-lg tracking-wider group-hover:scale-105 transition-transform">
              TBK
            </div>
            <div>
              <h1 class="font-extrabold text-sm tracking-tight text-white leading-tight group-hover:text-indigo-300 transition-colors">
                PT. Trans Berjaya
              </h1>
              <p class="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Financial Portal
              </p>
            </div>
          </NuxtLink>

          <!-- Mobile Close Button -->
          <button 
            @click="isMobileMenuOpen = false" 
            class="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white md:hidden hover:bg-slate-700 transition"
            aria-label="Tutup Menu"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Section Label -->
        <div class="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Menu Navigasi
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1.5">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.path" 
            :to="item.path" 
            @click="isMobileMenuOpen = false"
            :class="[
              'flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-200 group relative',
              $route.path === item.path 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 translate-x-1' 
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 hover:translate-x-0.5'
            ]"
          >
            <div class="flex items-center gap-3">
              <div :class="[
                'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                $route.path === item.path ? 'bg-white/20 text-white shadow-inner' : 'bg-slate-800/60 text-slate-400 group-hover:text-indigo-300 group-hover:bg-slate-800'
              ]">
                <component :is="item.icon" class="w-4 h-4" />
              </div>
              <span class="text-xs font-semibold">{{ item.label }}</span>
            </div>
            
            <span v-if="item.badge" class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm">
              {{ item.badge }}
            </span>
          </NuxtLink>
        </nav>
      </div>

      <!-- User / System Info Card -->
      <div class="pt-4 border-t border-slate-800/80 space-y-3">
        <div class="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/60 via-slate-900/80 to-slate-950 border border-slate-800/80 flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-xs shrink-0">
            <Sparkles class="w-4 h-4" />
          </div>
          <div class="overflow-hidden min-w-0">
            <p class="text-xs font-bold text-slate-200 truncate">PT. Trans Berjaya Khatulistiwa</p>
            <p class="text-[10px] font-mono text-emerald-400 truncate flex items-center gap-1.5 mt-0.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              PostgreSQL • Laravel • Nuxt
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Sticky Topbar Header -->
      <header class="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Mobile Hamburger Toggle Button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white md:hidden transition active:scale-95 hover:bg-slate-800"
            aria-label="Buka Menu Navigasi"
          >
            <Menu class="w-5 h-5" />
          </button>
          
          <div>
            <!-- Breadcrumbs -->
            <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span class="hover:text-slate-300">TBK Financial</span>
              <ChevronRight class="w-3 h-3 text-slate-600" />
              <span class="text-indigo-400 font-semibold truncate max-w-[140px] sm:max-w-none">{{ currentPageTitle }}</span>
            </div>
            <h2 class="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight mt-0.5">
              {{ currentPageTitle }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2.5 sm:gap-3">
          <!-- API Status Badge -->
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Online :8000</span>
          </div>

          <!-- Quick Action Button -->
          <NuxtLink 
            to="/transactions" 
            class="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition active:scale-95"
          >
            <Plus class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Transaksi Baru</span>
            <span class="sm:hidden">Baru</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Main Page Container with Adaptive Padding -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
        <slot />
      </main>

      <!-- Subtle Footer -->
      <footer class="border-t border-slate-900/90 px-6 py-4 text-center text-xs text-slate-500 font-medium">
        © 2026 PT. Trans Berjaya Khatulistiwa • Enterprise Financial Management System
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  FolderTree, 
  BookOpen, 
  ArrowLeftRight, 
  FileSpreadsheet,
  Menu,
  X,
  ChevronRight,
  Plus,
  Sparkles
} from 'lucide-vue-next'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Master Kategori', path: '/categories', icon: FolderTree },
  { label: 'Master COA', path: '/coas', icon: BookOpen },
  { label: 'Transaksi Keuangan', path: '/transactions', icon: ArrowLeftRight },
  { label: 'Laporan Profit / Loss', path: '/reports/profit-loss', icon: FileSpreadsheet, badge: 'Excel' }
]

const currentPageTitle = computed(() => {
  const current = navItems.find(item => item.path === route.path)
  return current ? current.label : 'PT. Trans Berjaya Khatulistiwa'
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
