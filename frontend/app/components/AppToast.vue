<template>
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
    <TransitionGroup name="toast">
      <div 
        v-for="t in toasts" 
        :key="t.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300',
          t.type === 'success' ? 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-emerald-950/40' : '',
          t.type === 'error' ? 'bg-slate-900/95 border-rose-500/40 text-slate-100 shadow-rose-950/40' : '',
          t.type === 'warning' ? 'bg-slate-900/95 border-amber-500/40 text-slate-100 shadow-amber-950/40' : '',
          t.type === 'info' ? 'bg-slate-900/95 border-indigo-500/40 text-slate-100 shadow-indigo-950/40' : ''
        ]"
      >
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          <div 
            v-if="t.type === 'success'" 
            class="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
          >
            <CheckCircle2 class="w-4 h-4" />
          </div>
          <div 
            v-else-if="t.type === 'error'" 
            class="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400"
          >
            <AlertCircle class="w-4 h-4" />
          </div>
          <div 
            v-else-if="t.type === 'warning'" 
            class="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400"
          >
            <AlertTriangle class="w-4 h-4" />
          </div>
          <div 
            v-else 
            class="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400"
          >
            <Info class="w-4 h-4" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-1">
          <h4 v-if="t.title" class="text-xs font-bold text-white leading-tight">
            {{ t.title }}
          </h4>
          <p class="text-xs text-slate-300 mt-0.5 leading-snug break-words">
            {{ t.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button 
          @click="remove(t.id)" 
          class="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Tutup"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}
</style>
