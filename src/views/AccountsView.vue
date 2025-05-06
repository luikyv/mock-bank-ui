<template>
  <LayoutComponent :links="sidebarLinks">
    <h1 class="text-2xl font-semibold mb-6">Accounts</h1>

    <div class="flex gap-6">
      <!-- Table -->
      <div class="flex-1">
        <div v-if="accounts.length">
          <table class="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead
              class="bg-gray-100 text-left text-sm font-semibold text-gray-700"
            >
              <tr>
                <th class="px-4 py-3">ID</th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-700 divide-y divide-gray-200">
              <tr
                v-for="account in accounts"
                :key="account.accountId"
                class="hover:bg-gray-50 cursor-pointer"
                @click="selectAccount(account)"
              >
                <td class="px-4 py-2 font-mono">{{ account.accountId }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-gray-500">No accounts found.</div>
      </div>

      <SidePanelComponent
        :title="'Account Details'"
        :selectedResource="selectedAccount"
        @close="selectedAccount = null"
      >
        <div>
          <div class="text-gray-500 text-xs uppercase">ID</div>
          <div class="font-mono text-sm text-gray-800">
            {{ selectedAccount?.accountId }}
          </div>
        </div>
      </SidePanelComponent>
    </div>
  </LayoutComponent>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LayoutComponent from "../components/LayoutComponent.vue";
import SidePanelComponent from "../components/SidePanelComponent.vue";
import type { Account } from "../types";
import { fetchAccounts } from "../utils";

const route = useRoute();
const accounts = ref<Account[]>([]);
const selectedAccount = ref<Account | null>(null);

const orgId = route.params.orgId as string;
const userId = route.params.userId as string;

const sidebarLinks = [
  { label: "Consents", path: `/orgs/${orgId}/users/${userId}/consents` },
  { label: "Accounts", path: `/orgs/${orgId}/users/${userId}/accounts` },
];

const selectAccount = (account: Account) => {
  selectedAccount.value = account;
};

onMounted(async () => {
  accounts.value = await fetchAccounts(userId, orgId);
});
</script>
