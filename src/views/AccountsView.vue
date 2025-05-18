<template>
  <LayoutComponent :links="sidebarLinks">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Accounts</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
        @click="
          newAccount = {
            number: '',
            type: AccountType.CHECKING,
            subtype: AccountSubtype.INDIVIDUAL,
            availableAmount: '0.00',
            blockedAmount: '0.00',
            automaticallyInvestedAmount: '0.00',
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
        title="Create New Account"
        @close="newAccount = null"
      >
        <form @submit.prevent="createAccount">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Number</label
              >
              <input
                v-model="newAccount.number"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                :class="{
                  'border-red-500': newAccount.number && !isAccountNumberValid,
                }"
                required
              />
              <p
                v-if="newAccount.number && !isAccountNumberValid"
                class="text-red-500 text-xs mt-1"
              >
                Number must contain between 8 and 10 numeric digits.
              </p>
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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Available Amount (R$)</label
              >
              <input
                v-model="newAccount.availableAmount"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                :class="{
                  'border-red-500':
                    newAccount.availableAmount && !isAvailableAmountValid,
                }"
                required
              />
              <p
                v-if="newAccount.availableAmount && !isAvailableAmountValid"
                class="text-red-500 text-xs mt-1"
              >
                Invalid amount format.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Automatically Invested Amount (R$)</label
              >
              <input
                v-model="newAccount.automaticallyInvestedAmount"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                :class="{
                  'border-red-500':
                    newAccount.automaticallyInvestedAmount &&
                    !isAutomaticallyInvestedAmountValid,
                }"
                required
              />
              <p
                v-if="
                  newAccount.automaticallyInvestedAmount &&
                  !isAutomaticallyInvestedAmountValid
                "
                class="text-red-500 text-xs mt-1"
              >
                Invalid amount format.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Blocked Amount (R$)</label
              >
              <input
                v-model="newAccount.blockedAmount"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                :class="{
                  'border-red-500':
                    newAccount.blockedAmount && !isBlockedAmountValid,
                }"
                required
              />
              <p
                v-if="newAccount.blockedAmount && !isBlockedAmountValid"
                class="text-red-500 text-xs mt-1"
              >
                Invalid amount format.
              </p>
            </div>

            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
            >
              Create
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
            <div class="text-gray-500 text-xs uppercase">Number</div>
            <div class="text-gray-800">{{ selectedAccount?.number }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Branch Code</div>
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

          <div>
            <div class="text-gray-500 text-xs uppercase">Available Amount</div>
            <div class="text-gray-800">
              R$ {{ selectedAccount?.availableAmount }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">
              Automatically Invested Amount
            </div>
            <div class="text-gray-800">
              R$ {{ selectedAccount?.automaticallyInvestedAmount }}
            </div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Blocked Amount</div>
            <div class="text-gray-800">
              R$ {{ selectedAccount?.blockedAmount }}
            </div>
          </div>
        </div>

        <template #panel-actions>
          <button
            @click="deleteAccount"
            class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded"
          >
            Delete
          </button>
        </template>
      </SidePanelComponent>
    </transition>
  </LayoutComponent>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import LayoutComponent from "../components/LayoutComponent.vue";
import SidePanelComponent from "../components/SidePanelComponent.vue";
import {
  AccountSubtype,
  AccountType,
  type Account,
  type AccountRequest,
} from "../types";
import {
  createMockAccount,
  fetchMockAccounts,
  deleteMockAccount,
} from "../utils";
import { useToast } from "vue-toastification";
import TableComponent from "../components/TableComponent.vue";

const route = useRoute();
const toast = useToast();

const accounts = ref<Account[]>([]);
const selectedAccount = ref<Account | null>(null);

const newAccount = ref<AccountRequest | null>(null);
const isAccountNumberValid = computed(() =>
  /^\d{8,20}$/.test(newAccount.value?.number ?? "")
);
const isAvailableAmountValid = computed(() =>
  /^-?\d{1,15}\.\d{2,4}$/.test(newAccount.value?.availableAmount ?? "")
);
const isAutomaticallyInvestedAmountValid = computed(() =>
  /^-?\d{1,15}\.\d{2,4}$/.test(
    newAccount.value?.automaticallyInvestedAmount ?? ""
  )
);
const isBlockedAmountValid = computed(() =>
  /^-?\d{1,15}\.\d{2,4}$/.test(newAccount.value?.blockedAmount ?? "")
);

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

const deleteAccount = async () => {
  if (!selectedAccount.value) return;

  await deleteMockAccount(selectedAccount.value.accountId, userId, orgId);
  accounts.value = await fetchMockAccounts(userId, orgId);
  selectedAccount.value = null;
  toast.success("Account deleted successfully!");
};

onMounted(async () => {
  accounts.value = await fetchMockAccounts(userId, orgId);
});
</script>
