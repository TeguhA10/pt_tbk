<template>
  <div :class="[
    'min-h-screen flex flex-col md:flex-row antialiased selection:bg-indigo-500 selection:text-white font-sans transition-colors duration-300',
    themeStore.isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
  ]">
    <Transition name="fade">
      <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
        class="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"></div>
    </Transition>

    <aside :class="[
      'fixed md:sticky top-0 z-50 h-screen backdrop-blur-2xl flex flex-col justify-between p-5 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none border-r',
      isMobileMenuOpen
        ? 'translate-x-0'
        : '-translate-x-full md:translate-x-0',

      isSidebarCollapsed
        ? 'md:w-[6.4rem]'
        : 'md:w-72',

      'w-72',

      themeStore.isDark
        ? 'bg-slate-900/95 border-slate-800/80'
        : 'bg-white/95 border-slate-200'
    ]">
      <div class="space-y-6">

        <!-- LOGO -->
        <div :class="[
          'flex items-center px-2 pt-1 pb-2',
          isSidebarCollapsed
            ? 'justify-center'
            : 'justify-between'
        ]">

          <NuxtLink to="/" @click="isMobileMenuOpen = false" class="flex items-center gap-3.5 group min-w-0">
            <!-- Logo -->
            <div
              class="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 font-extrabold text-white text-lg tracking-wider group-hover:scale-105 transition-transform">
              TBK
            </div>

            <!-- Company Name -->
            <div v-if="!isSidebarCollapsed" class="min-w-0 transition-all duration-200">
              <h1 :class="[
                'font-extrabold text-sm tracking-tight leading-tight truncate',
                themeStore.isDark
                  ? 'text-white group-hover:text-indigo-300'
                  : 'text-slate-900 group-hover:text-indigo-600',
                'transition-colors'
              ]">
                PT. Trans Berjaya Khatulistiwa
              </h1>

              <p class="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Financial Portal
              </p>
            </div>
          </NuxtLink>

          <!-- Mobile Close -->
          <button @click="isMobileMenuOpen = false" :class="[
            'p-2 rounded-xl md:hidden transition',
            themeStore.isDark
              ? 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
          ]" aria-label="Tutup Menu">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- DESKTOP COLLAPSE BUTTON -->
        <button @click="isSidebarCollapsed = !isSidebarCollapsed" :class="[
          'hidden md:flex absolute -right-3 top-20 w-7 h-7 rounded-full items-center justify-center border shadow-md transition-all duration-200 hover:scale-110',
          themeStore.isDark
            ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600'
        ]" :title="isSidebarCollapsed
          ? 'Buka Sidebar'
          : 'Tutup Sidebar'
        ">
          <ChevronRight v-if="isSidebarCollapsed" class="w-4 h-4" />

          <ChevronLeft v-else class="w-4 h-4" />
        </button>

        <!-- MENU TITLE -->
        <div v-if="!isSidebarCollapsed" :class="[
          'px-2 text-[10px] font-bold uppercase tracking-wider',
          themeStore.isDark
            ? 'text-slate-500'
            : 'text-slate-400'
        ]">
          Menu Navigasi
        </div>

        <!-- NAVIGATION -->
        <nav class="space-y-1.5">
          <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" @click="isMobileMenuOpen = false"
            :title="isSidebarCollapsed ? item.label : undefined" :class="[
              'flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-xs tracking-wide transition-all duration-200 group relative',

              $route.path === item.path
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 translate-x-1'
                : themeStore.isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 hover:translate-x-0.5'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:translate-x-0.5',

              isSidebarCollapsed
                ? 'justify-center px-2'
                : ''
            ]">
            <div :class="[
              'flex items-center',
              isSidebarCollapsed
                ? 'justify-center'
                : 'gap-3'
            ]">

              <!-- ICON -->
              <div :class="[
                'w-8 h-8 shrink-0 rounded-xl flex items-center justify-center transition-all duration-200',

                $route.path === item.path
                  ? 'bg-white/20 text-white shadow-inner'
                  : themeStore.isDark
                    ? 'bg-slate-800/60 text-slate-400 group-hover:text-indigo-300 group-hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600 group-hover:bg-white'
              ]">
                <component :is="item.icon" class="w-4 h-4" />
              </div>

              <!-- LABEL -->
              <span v-if="!isSidebarCollapsed" class="text-xs font-semibold whitespace-nowrap">
                {{ item.label }}
              </span>

            </div>

            <!-- BADGE -->
            <span v-if="item.badge && !isSidebarCollapsed"
              class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm">
              {{ item.badge }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header :class="[
        'sticky top-0 z-30 backdrop-blur-xl border-b px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-colors duration-300',
        themeStore.isDark ? 'bg-slate-950/85 border-slate-800/80' : 'bg-white/90 border-slate-200'
      ]">
        <div class="flex items-center gap-3">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white md:hidden transition active:scale-95 hover:bg-slate-800"
            aria-label="Buka Menu Navigasi">
            <Menu class="w-5 h-5" />
          </button>

          <div>
            <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span class="hover:text-slate-300">TBK Financial</span>
              <ChevronRight class="w-3 h-3 text-slate-600" />
              <span class="text-indigo-400 font-semibold truncate max-w-[140px] sm:max-w-none">{{ currentPageTitle
              }}</span>
            </div>
            <h2 class="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight mt-0.5">
              {{ currentPageTitle }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2.5 sm:gap-3">

          <button @click="themeStore.toggle()"
            :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'" :class="[
              'relative p-2 rounded-xl border transition-all duration-300 active:scale-95 overflow-hidden',
              themeStore.isDark
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800 hover:border-amber-500/50'
                : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-white hover:border-indigo-400'
            ]">
            <Transition name="theme-icon" mode="out-in">
              <Sun v-if="!themeStore.isDark" class="w-4 h-4" key="sun" />
              <Moon v-else class="w-4 h-4" key="moon" />
            </Transition>
          </button>

          <NuxtLink to="/transactions"
            class="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 transition active:scale-95">
            <Plus class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Transaksi Baru</span>
            <span class="sm:hidden">Baru</span>
          </NuxtLink>
        </div>
      </header>

      <main :class="[
        'flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8',
        themeStore.isDark ? '' : 'text-slate-900'
      ]">
        <slot />
      </main>

      <footer :class="[
        'border-t px-6 py-4 text-center text-xs font-medium',
        themeStore.isDark ? 'border-slate-900/90 text-slate-500' : 'border-slate-200 text-slate-400'
      ]">
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
  ChevronLeft,
  Plus,
  Sparkles,
  Sun,
  Moon
} from 'lucide-vue-next'

const themeStore = useThemeStore()

const route = useRoute()

const isMobileMenuOpen = ref(false)
const isSidebarCollapsed = ref(false)

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

/* Theme icon spin transition */
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.25s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}
</style>
