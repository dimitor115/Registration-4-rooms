import { ref } from '@vue/composition-api'
import { api } from '@/shared/api'
import { CreateRoomRequest } from '@/models/CreateRoomRequest'
import { rooms, withProcessing } from '@/actions/rootActions'

export const fetchAllAction = (() => {
  const isProcessing = ref(false)
  const fetchAll = async () =>
    withProcessing(isProcessing, async () => {
      const response = await api.rooms.findAll()
      rooms.value = response.data
    })

  return { isProcessing, fetchAll }
})()

export function createAction() {
  const isProcessing = ref(false)
  const create = async (room: CreateRoomRequest) => {
    try {
      isProcessing.value = true
      await api.rooms.create(room as any)
      fetchAllAction.fetchAll()
    } finally {
      isProcessing.value = false
    }
  }
  return { isProcessing, create }
}

export function deleteAction() {
  const isProcessing = ref(false)
  const deleteRoom = async (id: string) => {
    try {
      isProcessing.value = true
      await api.rooms.delete(id)
      fetchAllAction.fetchAll()
    } finally {
      isProcessing.value = false
    }
  }
  return { isProcessing, deleteRoom }
}

export function updateAction() {
  const isProcessing = ref(false)
  const updateRoom = async (id: string, payload: CreateRoomRequest) =>
    withProcessing(isProcessing, async () => {
      await api.rooms.update(id, payload as any)
      fetchAllAction.fetchAll()
    })
  return { isProcessing, updateRoom }
}
