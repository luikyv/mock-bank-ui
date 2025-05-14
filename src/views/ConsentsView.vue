<template>
  <LayoutComponent :links="sidebarLinks">
    <h1 class="text-2xl font-semibold mb-6">Consents</h1>

    <TableComponent v-if="consents.length">
      <template #header>
        <th class="px-4 py-3">ID</th>
        <th class="px-4 py-3">Status</th>
        <th class="px-4 py-3">Created At</th>
        <th class="px-4 py-3">Expiration</th>
        <th class="px-4 py-3">Client ID</th>
      </template>

      <template #body>
        <tr
          v-for="consent in consents"
          :key="consent.consentId"
          class="hover:bg-gray-50 cursor-pointer"
          @click="selectConsent(consent)"
        >
          <td class="px-4 py-2 font-mono truncate">
            {{ consent.consentId }}
          </td>
          <td class="px-4 py-2 truncate">{{ consent.status }}</td>
          <td class="px-4 py-2 truncate">{{ consent.creationDateTime }}</td>
          <td class="px-4 py-2 truncate">
            {{ consent.expirationDateTime || "—" }}
          </td>
          <td class="px-4 py-2 truncate">{{ consent.clientId }}</td>
        </tr>
      </template>
    </TableComponent>
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">No consents found.</p>
    </div>

    <transition name="slide-left">
      <SidePanelComponent
        v-if="selectedConsent"
        :title="'Consent Details'"
        @close="selectedConsent = null"
      >
        <div class="flex flex-col h-full space-y-4 overflow-y-auto">
          <div>
            <div class="text-gray-500 text-xs uppercase">ID</div>
            <div class="font-mono text-sm text-gray-800">
              {{ selectedConsent?.consentId }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Status</div>
            <div class="text-gray-800">{{ selectedConsent?.status }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Created At</div>
            <div class="text-gray-800">
              {{ selectedConsent?.creationDateTime }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Status Update At</div>
            <div class="text-gray-800">
              {{ selectedConsent?.statusUpdateDateTime }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Expires At</div>
            <div class="text-gray-800">
              {{ selectedConsent?.expirationDateTime || "—" }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Client ID</div>
            <div class="text-gray-800">{{ selectedConsent?.clientId }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">User ID</div>
            <div class="text-gray-800">{{ selectedConsent?.userId }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Permissions</div>
            <div
              class="bg-gray-50 border border-gray-200 rounded p-2 max-h-40 overflow-y-auto space-y-1 text-gray-800 text-sm"
            >
              <div
                v-for="(perm, index) in selectedConsent?.permissions"
                :key="index"
                class="font-mono"
              >
                {{ perm }}
              </div>
            </div>
          </div>
        </div>
      </SidePanelComponent>
    </transition>
  </LayoutComponent>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LayoutComponent from "../components/LayoutComponent.vue";
import SidePanelComponent from "../components/SidePanelComponent.vue";
import TableComponent from "../components/TableComponent.vue";
import type { Consent } from "../types";
import { fetchConsents } from "../utils";

const route = useRoute();
const consents = ref<Consent[]>([]);
const selectedConsent = ref<Consent | null>(null);

const orgId = route.params.orgId as string;
const userId = route.params.userId as string;

const sidebarLinks = [
  { label: "Consents", path: `/orgs/${orgId}/users/${userId}/consents` },
  { label: "Accounts", path: `/orgs/${orgId}/users/${userId}/accounts` },
];

const selectConsent = (consent: Consent) => {
  selectedConsent.value = consent;
};

onMounted(async () => {
  consents.value = await fetchConsents(userId, orgId);
});
</script>
