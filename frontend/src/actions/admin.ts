import { ref } from '@vue/composition-api'
import { Admin } from '@/models/Admin'
import { withProcessing } from '@/actions/root'
import { api } from '@/shared/api'

export const admins = ref<Admin[]>([])

export const fetchAllAction = (() => {
  const isProcessing = ref(false)
  const fetchAll = async () =>
    withProcessing(isProcessing, async () => {
      const response = await api.admins.fetchAll()
      admins.value = response.data
    })

  return { isProcessing, fetchAll }
})()

export function removeAdminAction() {
  const isProcessing = ref(false)
  const remove = async (email: string) =>
    withProcessing(isProcessing, async () => {
      await api.admins.remove(email)
      fetchAllAction.fetchAll()
    })
  return { isProcessing, remove }
}

export function acceptAdminAction() {
  const isProcessing = ref(false)
  const accept = async (email: string) =>
    withProcessing(isProcessing, async () => {
      await api.admins.accept(email)
      fetchAllAction.fetchAll()
    })
  return { isProcessing, accept }
}
