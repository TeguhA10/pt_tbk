import { ref } from 'vue'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<ToastItem[]>([])

export const useToast = () => {
  const show = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string, duration: number = 3500) => {
    const id = Math.random().toString(36).substring(2, 9)
    const item: ToastItem = { id, message, type, title, duration }
    toasts.value.push(item)

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const success = (message: string, title: string = 'Berhasil') => {
    show(message, 'success', title)
  }

  const error = (message: string, title: string = 'Gagal') => {
    show(message, 'error', title)
  }

  const info = (message: string, title: string = 'Informasi') => {
    show(message, 'info', title)
  }

  const warning = (message: string, title: string = 'Peringatan') => {
    show(message, 'warning', title)
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    remove
  }
}
