import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
  const STORAGE_KEY = 'tbk-theme'

  const savedTheme = (typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY)
    : null) as Theme | null

  const theme = ref<Theme>(savedTheme ?? 'dark')

  function applyTheme(t: Theme) {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(t: Theme) {
    theme.value = t
  }

  watch(theme, (t) => {
    applyTheme(t)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, t)
    }
  }, { immediate: true })

  const isDark = computed(() => theme.value === 'dark')

  return { theme, isDark, toggle, setTheme }
})
