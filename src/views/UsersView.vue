<template>
  <LayoutComponent :links="sidebarLinks">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Users</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
        @click="newUser = { username: '', cpf: '', name: '' }"
      >
        New User
      </button>
    </div>

    <div v-if="users.length" class="space-y-4">
      <RowComponent
        v-for="user in users"
        :key="user.id"
        :title="user.username"
        :onClick="() => selectUser(user)"
        :tags="[{ key: 'ID', value: user.id }]"
      ></RowComponent>
    </div>
    <div v-else class="text-gray-500">No users found.</div>

    <transition name="slide-left">
      <SidePanelComponent
        v-if="newUser"
        title="Create New User"
        @close="newUser = null"
      >
        <template #panel-actions>
          <button
            type="submit"
            form="create-user-form"
            :disabled="!newUserIsValid"
            :class="[
              'text-white text-sm font-medium py-2 px-4 rounded',
              newUserIsValid
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed',
            ]"
          >
            Create
          </button>
        </template>

        <form id="create-user-form" @submit.prevent="createUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Name</label
              >
              <input
                v-model="newUser.name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Username</label
              >
              <input
                v-model="newUser.username"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >CPF</label
              >
              <input
                v-model="newUser.cpf"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                :class="{ 'border-red-500': newUser.cpf && !newUserCpfIsValid }"
                required
              />
              <p
                v-if="newUser.cpf && !newUserCpfIsValid"
                class="text-red-500 text-xs mt-1"
              >
                CPF must contain 11 numeric digits.
              </p>
            </div>
          </div>
        </form>
      </SidePanelComponent>
    </transition>

    <transition name="slide-left">
      <SidePanelComponent
        v-if="selectedUser"
        title="User Details"
        @close="selectedUser = null"
      >
        <div class="flex flex-col h-full space-y-4 overflow-y-auto">
          <div>
            <div class="text-gray-500 text-xs uppercase">ID</div>
            <div class="font-mono text-sm text-gray-800">
              {{ selectedUser.id }}
            </div>
          </div>

          <div>
            <label class="text-gray-500 text-xs uppercase">Name</label>
            <input
              v-model="selectedUser.name"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
            />
          </div>

          <div>
            <label class="text-gray-500 text-xs uppercase">Username</label>
            <input
              v-model="selectedUser.username"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >CPF</label
            >
            <input
              v-model="selectedUser.cpf"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              :class="{
                'border-red-500': selectedUser.cpf && !selectedUserCpfIsValid,
              }"
              required
            />
            <p
              v-if="selectedUser.cpf && !selectedUserCpfIsValid"
              class="text-red-500 text-xs mt-1"
            >
              CPF must contain 11 numeric digits.
            </p>
          </div>
        </div>

        <template #panel-actions>
          <div class="flex justify-between items-center w-full">
            <div class="flex gap-2">
              <button
                @click="saveUser"
                :disabled="!userWasEdited || !selectedUserIsValid"
                :class="[
                  'text-white text-sm font-medium py-2 px-4 rounded',
                  userWasEdited
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed',
                ]"
              >
                Save
              </button>
              <button
                @click="goToUserResources(selectedUser)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
              >
                Go To Resources
              </button>
            </div>
            <button
              @click="deleteUser(selectedUser)"
              class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </template>
      </SidePanelComponent>
    </transition>
  </LayoutComponent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import LayoutComponent from "../components/LayoutComponent.vue";
import RowComponent from "../components/RowComponent.vue";
import SidePanelComponent from "../components/SidePanelComponent.vue";
import { useToast } from "vue-toastification";
import type { MockUser, MockUserRequest } from "../types";
import {
  fetchMockUsers,
  createMockUser,
  updateMockUser,
  deleteMockUser,
} from "../utils";
import { useStore } from "../stores";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const store = useStore();

const orgId = route.params.orgId as string;

const users = ref<MockUser[]>([]);
const newUser = ref<MockUserRequest | null>(null);
const selectedUser = ref<MockUser | null>(null);
const originalUser = ref<MockUser | null>(null);

const newUserCpfIsValid = computed(() =>
  /^\d{11}$/.test(newUser.value?.cpf ?? "")
);
const newUserIsValid = computed(
  () => newUser.value !== null && newUserCpfIsValid.value
);

const selectedUserCpfIsValid = computed(() =>
  /^\d{11}$/.test(selectedUser.value?.cpf ?? "")
);
const selectedUserIsValid = computed(
  () => selectedUser.value !== null && selectedUserCpfIsValid.value
);

const userWasEdited = computed(() => {
  if (!selectedUser.value || !originalUser.value) return false;
  return (
    selectedUser.value.name !== originalUser.value.name ||
    selectedUser.value.username !== originalUser.value.username ||
    selectedUser.value.cpf !== originalUser.value.cpf
  );
});

const sidebarLinks = [{ label: "Users", path: `/orgs/${orgId}/users` }];

const selectUser = (user: MockUser) => {
  selectedUser.value = { ...user };
  originalUser.value = { ...user };
};

const createUser = async () => {
  if (!newUser.value || !newUserIsValid.value) return;
  await createMockUser(newUser.value, orgId);
  users.value = await fetchMockUsers(orgId);
  newUser.value = null;
  toast.success("User created successfully!");
};

const saveUser = async () => {
  if (!selectedUser.value || !selectedUserIsValid.value) return;
  await updateMockUser(selectedUser.value.id, selectedUser.value, orgId);
  users.value = await fetchMockUsers(orgId);
  selectedUser.value = null;
  toast.success("User updated successfully!");
};

const deleteUser = async (user: MockUser) => {
  await deleteMockUser(user.id, orgId);
  users.value = await fetchMockUsers(orgId);
  if (selectedUser.value?.id === user.id) selectedUser.value = null;
  toast.success("User deleted successfully!");
};

const goToUserResources = (user: MockUser) => {
  store.mockUser = user;
  router.push(`/orgs/${orgId}/users/${user.id}`);
};

onMounted(async () => {
  users.value = await fetchMockUsers(orgId);
});
</script>
