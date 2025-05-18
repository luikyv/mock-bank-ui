<template>
  <LayoutComponent>
    <h1 class="text-2xl font-semibold mb-6">Organizations</h1>

    <div v-if="Object.keys(user?.organizations || {}).length" class="space-y-4">
      <RowComponent
        v-for="org in user?.organizations"
        :key="org.id"
        :title="org.name"
        :onClick="goToOrganization(org)"
        :tags="[{ key: 'ID', value: org.id }]"
      ></RowComponent>
    </div>

    <div v-else class="text-gray-500">No organizations found.</div>
  </LayoutComponent>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import LayoutComponent from "../components/LayoutComponent.vue";
import RowComponent from "../components/RowComponent.vue";
import type { Organization } from "../types";
import { useStore } from "../stores";

const router = useRouter();
const store = useStore();
const user = computed(() => store.user);

const goToOrganization = (org: Organization) => {
  return async () => {
    store.org = org;
    router.push(`/orgs/${org.id}`);
  };
};

onMounted(() => {
  store.org = null;
});
</script>
