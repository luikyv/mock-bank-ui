<template>
  <transition name="fade-scale">
    <div
      v-if="globalError"
      class="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/40"
    >
      <div class="bg-white rounded-xl shadow-2xl px-6 py-5 max-w-md w-full">
        <div class="flex justify-between items-start mb-2">
          <h2 class="text-xl font-semibold text-gray-800">Error</h2>
          <button
            @click="globalError = null"
            class="text-2xl font-bold text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div class="text-gray-700 text-sm whitespace-pre-line">
          {{ globalError.message }}
        </div>
        <div v-if="globalError.id" class="mt-4 text-xs text-gray-500">
          Interaction ID: {{ globalError.id }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { globalError } from '../errors'
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
