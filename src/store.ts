import { defineStore } from 'pinia'
import type { User, Organization, MockUser } from './types'

export const useStore = defineStore('store', {
  state: () => ({
    user: null as User | null,
    org: null as Organization | null,
    mockUser: null as MockUser | null,
  }),
  persist: true,
})
