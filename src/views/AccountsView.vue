<template>
  <LayoutComponent :links="sidebarLinks">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Accounts</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
        @click="
          newAccount = {
            number: '',
            checkDigit: '',
            branchCode: '',
            type: AccountType.CHECKING,
            subtype: AccountSubtype.INDIVIDUAL,
          }
        "
      >
        Create Account
      </button>
    </div>

    <TableComponent v-if="accounts.length">
      <template #header>
        <th class="px-4 py-3">ID</th>
        <th class="px-4 py-3">Number</th>
        <th class="px-4 py-3">Branch</th>
        <th class="px-4 py-3">Digit</th>
        <th class="px-4 py-3">Type</th>
        <th class="px-4 py-3">Subtype</th>
      </template>

      <template #body>
        <tr
          v-for="account in accounts"
          :key="account.accountId"
          class="hover:bg-gray-50 cursor-pointer"
          @click="selectAccount(account)"
        >
          <td class="px-4 py-2 font-mono truncate">
            {{ account.accountId }}
          </td>
          <td class="px-4 py-2 truncate">{{ account.number }}</td>
          <td class="px-4 py-2 truncate">{{ account.branchCode || "-" }}</td>
          <td class="px-4 py-2 truncate">{{ account.checkDigit || "-" }}</td>
          <td class="px-4 py-2 truncate">{{ account.type }}</td>
          <td class="px-4 py-2 truncate">{{ account.subtype }}</td>
        </tr>
      </template>
    </TableComponent>
    <div v-else class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">No accounts found.</p>
    </div>

    <transition name="slide-left">
      <SidePanelComponent
        v-if="newAccount"
        title="Criar Nova Conta"
        @close="newAccount = null"
      >
        <form @submit.prevent="createAccount">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Número</label
              >
              <input
                v-model="newAccount.number"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Type</label
              >
              <select
                v-model="newAccount.type"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              >
                <option
                  v-for="value in AccountType"
                  :key="value"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Subtype</label
              >
              <select
                v-model="newAccount.subtype"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              >
                <option
                  v-for="value in AccountSubtype"
                  :key="value"
                  :value="value"
                >
                  {{ value }}
                </option>
              </select>
            </div>

            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
            >
              Criar
            </button>
          </div>
        </form>
      </SidePanelComponent>
    </transition>

    <transition name="slide-left">
      <SidePanelComponent
        v-if="selectedAccount"
        :title="'Account Details'"
        @close="selectedAccount = null"
      >
        <div class="flex flex-col h-full space-y-4 overflow-y-auto">
          <div>
            <div class="text-gray-500 text-xs uppercase">ID</div>
            <div class="font-mono text-sm text-gray-800">
              {{ selectedAccount?.accountId }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Número</div>
            <div class="text-gray-800">{{ selectedAccount?.number }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Código da Agência</div>
            <div class="text-gray-800">
              {{ selectedAccount?.branchCode || "-" }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Check Digit</div>
            <div class="text-gray-800">
              {{ selectedAccount?.checkDigit }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Type</div>
            <div class="text-gray-800">
              {{ selectedAccount?.type }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Subtype</div>
            <div class="text-gray-800">
              {{ selectedAccount?.subtype }}
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
import {
  AccountSubtype,
  AccountType,
  type Account,
  type AccountRequest,
} from "../types";
import { createMockAccount, fetchMockAccounts } from "../utils";
import { useToast } from "vue-toastification";
import TableComponent from "../components/TableComponent.vue";

const route = useRoute();
const toast = useToast();

const accounts = ref<Account[]>([]);
const selectedAccount = ref<Account | null>(null);
const newAccount = ref<AccountRequest | null>(null);

const orgId = route.params.orgId as string;
const userId = route.params.userId as string;

const sidebarLinks = [
  { label: "Consents", path: `/orgs/${orgId}/users/${userId}/consents` },
  { label: "Accounts", path: `/orgs/${orgId}/users/${userId}/accounts` },
];

const selectAccount = (account: Account) => {
  selectedAccount.value = account;
};

const createAccount = async () => {
  if (!newAccount.value) return;

  await createMockAccount(newAccount.value, userId, orgId);
  accounts.value = await fetchMockAccounts(userId, orgId);
  newAccount.value = null;
  toast.success("Account created successfully!");
};

onMounted(async () => {
  accounts.value = await fetchMockAccounts(userId, orgId);
});
</script>
