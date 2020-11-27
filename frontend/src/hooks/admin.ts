import { ref } from '@vue/composition-api'
import { Admin } from '@/models/Admin'
import { withProcessing } from '@/hooks/root'
import { api } from '@/shared/api'

export const admins = ref<Admin[]>([])

export const useFetchAll = (() => {
  const isProcessing = ref(false)
  const fetchAll = async () =>
    withProcessing(isProcessing, async () => {
      const response = await api.admins.fetchAll()
      admins.value = response.data
    })

  return { isProcessing, fetchAll }
})()

export function useRemoveAdmin() {
  const isProcessing = ref(false)
  const remove = async (email: string) =>
    withProcessing(isProcessing, async () => {
      await api.admins.remove(email)
      useFetchAll.fetchAll()
    })
  return { isProcessing, remove }
}

export function useAcceptAdmin() {
  const isProcessing = ref(false)
  const accept = async (email: string) =>
    withProcessing(isProcessing, async () => {
      await api.admins.accept(email)
      useFetchAll.fetchAll()
    })
  return { isProcessing, accept }
}
