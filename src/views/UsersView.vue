<template>
  <LayoutComponent :links="sidebarLinks">
    <!-- Heading and New User button -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Users</h1>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded"
        @click="newUser = { username: '', cpf: '', name: '' }"
      >
        New User
      </button>
    </div>

    <!-- Notification message -->
    <div v-if="message" class="mb-4 p-2 text-white bg-green-600 rounded">
      {{ message }}
    </div>

    <!-- User list -->
    <div v-if="users.length" class="space-y-4">
      <RowComponent
        v-for="user in users"
        :key="user.id"
        :title="user.username"
        :onClick="selectUser(user)"
        :tags="[{ key: 'ID', value: user.id }]"
      />
    </div>
    <div v-else class="text-gray-500">No users found.</div>

    <!-- New user side panel form -->
    <SidePanelComponent
      :title="'Create New User'"
      :selectedResource="newUser"
      @close="newUser = null"
    >
      <form v-if="newUser" @submit.prevent="createUser">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="newUser.name"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              v-model="newUser.username"
              type="text"
              class="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CPF</label>
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

    <!-- Selected user side panel -->
    <SidePanelComponent
      title="User Details"
      :selectedResource="selectedUser"
      @close="selectedUser = null"
    >
      <div v-if="selectedUser" class="flex flex-col h-full">
        <!-- Scrollable content -->
        <div class="space-y-4 overflow-y-auto">
          <div>
            <div class="text-gray-500 text-xs uppercase">ID</div>
            <div class="font-mono text-sm text-gray-800">{{ selectedUser.id }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Name</div>
            <div class="text-gray-800">{{ selectedUser.name }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">Username</div>
            <div class="text-gray-800">{{ selectedUser.username }}</div>
          </div>

          <div>
            <div class="text-gray-500 text-xs uppercase">CPF</div>
            <div class="text-gray-800">{{ selectedUser.cpf }}</div>
          </div>
        </div>

        <!-- Bottom-aligned actions -->
        <div class="mt-auto pt-6 flex gap-2">
          <button
            @click="goToUserResources"
            class="bg-[#497E94] hover:bg-[#3F3F3F] text-white text-sm font-medium py-2 px-4 rounded"
          >
            Go To Resources
          </button>
          <button
            @click="deleteUser"
            class="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded"
          >
            Delete User
          </button>
        </div>
      </div>
    </SidePanelComponent>
  </LayoutComponent>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import LayoutComponent from '../components/LayoutComponent.vue'
import RowComponent from '../components/RowComponent.vue'
import SidePanelComponent from '../components/SidePanelComponent.vue'
import type { MockUser, CreateMockUserRequest } from '../types'
import { fetchMockUsers, createMockUser, deleteMockUser } from '../utils'
import { useStore } from '../store'

const route = useRoute()
const router = useRouter()
const store = useStore()
const users = ref<MockUser[]>([])
const orgId = route.params.orgId as string

const selectedUser = ref<MockUser | null>(null)
const newUser = ref<CreateMockUserRequest | null>(null)
const message = ref<string | null>(null)

const sidebarLinks = [{ label: 'Users', path: `/orgs/${orgId}/users` }]

const selectUser = (user: MockUser) => {
  return () => {
    selectedUser.value = user
  }
}

const createUser = async () => {
  if (newUser.value == null) {
    return
  }

  await createMockUser(newUser.value, orgId)
  users.value = await fetchMockUsers(orgId)
  newUser.value = null
  message.value = 'User created successfully!'

  setTimeout(() => {
    message.value = null
  }, 3000)
}

const deleteUser = async () => {
  if (!selectedUser.value) return

  await deleteMockUser(selectedUser.value.id, orgId)
  users.value = await fetchMockUsers(orgId)
  selectedUser.value = null
  message.value = 'User deleted successfully!'

  setTimeout(() => {
    message.value = null
  }, 3000)
}

function goToUserResources() {
  store.mockUser = selectedUser.value
  router.push(`/orgs/${orgId}/users/${selectedUser.value?.id}`)
}

onMounted(async () => {
  users.value = await fetchMockUsers(orgId)
})
</script>
