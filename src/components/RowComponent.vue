<template>
  <div class="p-4 bg-white rounded shadow hover:bg-gray-50 cursor-pointer" @click="onClick()">
    <p class="font-semibold">{{ title }}</p>
    <p v-for="tag in tags" :key="tag.key" class="text-sm text-gray-500">
      {{ tag.key }}: {{ tag.value }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  onClick: (() => Promise<void>) | (() => void)
  tags?: { key: string; value: string }[]
}>()
</script>
