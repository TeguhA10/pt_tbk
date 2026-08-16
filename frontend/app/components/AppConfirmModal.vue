<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        @click.self="cancel"
      >
        <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in">
          <!-- Icon Header -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-base font-extrabold text-white">
                {{ title || 'Konfirmasi Hapus' }}
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>

          <!-- Message Body -->
          <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
            <p>{{ message }}</p>
            <p v-if="itemName" class="font-bold text-white font-mono bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 break-words">
              {{ itemName }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              @click="cancel"
              :disabled="loading"
              class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
            >
              {{ cancelText || 'Batal' }}
            </button>
            <button 
              type="button" 
              @click="confirm"
              :disabled="loading"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              <Loader2 v-if="loading" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ confirmText || 'Ya, Hapus Data' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { AlertTriangle, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi Tindakan' },
  message: { type: String, default: 'Apakah Anda yakin ingin menghapus data ini?' },
  itemName: { type: String, default: '' },
  confirmText: { type: String, default: 'Ya, Hapus' },
  cancelText: { type: String, default: 'Batal' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const cancel = () => {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
