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
        :onClick="selectUser(user)"
        :tags="[{ key: 'ID', value: user.id }]"
        :actions="[
          { label: 'Edit', onClick: () => selectUser(user) },
          { label: 'Go to Resources', onClick: () => goToUserResources() },
          { label: 'Delete', onClick: () => deleteUser() },
        ]"
      />
    </div>
    <div v-else class="text-gray-500">No users found.</div>

    <transition name="slide-left">
      <SidePanelComponent
        v-if="newUser"
        title="Create New User"
        @close="newUser = null"
      >
        <form @submit.prevent="createUser">
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
                required
              />
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
        v-if="selectedUser"
        title="User Details"
        @close="selectedUser = null"
      >
        <div v-if="editedUser" class="flex flex-col h-full">
          <div class="space-y-4 overflow-y-auto">
            <div>
              <div class="text-gray-500 text-xs uppercase">ID</div>
              <div class="font-mono text-sm text-gray-800">
                {{ editedUser.id }}
              </div>
            </div>
            <div>
              <label class="text-gray-500 text-xs uppercase">Name</label>
              <input
                v-model="editedUser.name"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
              />
            </div>
            <div>
              <label class="text-gray-500 text-xs uppercase">Username</label>
              <input
                v-model="editedUser.username"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
              />
            </div>
            <div>
              <label class="text-gray-500 text-xs uppercase">CPF</label>
              <input
                v-model="editedUser.cpf"
                type="text"
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
              />
            </div>
          </div>
        </div>

        <template #panel-actions>
          <div class="flex justify-between items-center w-full">
            <div class="flex gap-2">
              <button
                @click="saveUser"
                :disabled="!userWasEdited"
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
                @click="goToUserResources"
                class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
              >
                Go To Resources
              </button>
            </div>
            <button
              @click="deleteUser"
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
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import LayoutComponent from "../components/LayoutComponent.vue";
import RowComponent from "../components/RowComponent.vue";
import SidePanelComponent from "../components/SidePanelComponent.vue";
import type { MockUser, MockUserRequest } from "../types";
import {
  fetchMockUsers,
  createMockUser,
  deleteMockUser,
  updateMockUser,
} from "../utils";
import { useStore } from "../stores";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const store = useStore();
const toast = useToast();

const orgId = route.params.orgId as string;
const users = ref<MockUser[]>([]);
const newUser = ref<MockUserRequest | null>(null);
const selectedUser = ref<MockUser | null>(null);
const editedUser = ref<MockUser | null>(null);

const sidebarLinks = [{ label: "Users", path: `/orgs/${orgId}/users` }];

const userWasEdited = computed(() => {
  if (!selectedUser.value || !editedUser.value) return false;
  return (
    selectedUser.value.name !== editedUser.value.name ||
    selectedUser.value.cpf !== editedUser.value.cpf ||
    selectedUser.value.username !== editedUser.value.username
  );
});

watch(
  () => selectedUser.value,
  (user) => {
    editedUser.value = user ? { ...user } : null;
  },
  { immediate: true }
);

const selectUser = (user: MockUser) => () => {
  selectedUser.value = user;
};

const createUser = async () => {
  if (!newUser.value) return;

  await createMockUser(newUser.value, orgId);
  users.value = await fetchMockUsers(orgId);
  newUser.value = null;
  toast.success("User created successfully!");
};

const deleteUser = async () => {
  if (!selectedUser.value) return;

  await deleteMockUser(selectedUser.value.id, orgId);
  users.value = await fetchMockUsers(orgId);
  selectedUser.value = null;
  toast.success("User deleted successfully!");
};

const saveUser = async () => {
  if (!selectedUser.value || !editedUser.value) return;

  await updateMockUser(selectedUser.value.id, editedUser.value, orgId);
  users.value = await fetchMockUsers(orgId);
  selectedUser.value = null;
  toast.success("User updated successfully!");
};

function goToUserResources() {
  if (!selectedUser.value) return;
  store.mockUser = selectedUser.value;
  router.push(`/orgs/${orgId}/users/${selectedUser.value.id}`);
}

onMounted(async () => {
  users.value = await fetchMockUsers(orgId);
});
</script>
