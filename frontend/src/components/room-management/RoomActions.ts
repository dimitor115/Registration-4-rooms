import { computed, defineComponent, PropType, Ref, ref, UnwrapRef } from '@vue/composition-api'
import { api } from '@/shared/api'
import { CreateRoomRequest } from '@/models/CreateRoomRequest'

export default {
  create() {
    const isProcessing = ref(false)
    const createRoom = async (room: CreateRoomRequest) => {
      try {
        isProcessing.value = true
        const response = await api.rooms.create(room as any) //TODO: what about it?
      } finally {
        isProcessing.value = false
      }
    }
    return {
      isProcessing,
      createRoom
    }
  },
  delete() {
    const isProcessing = ref(false)
    const deleteRoom = async (id: string) => {
      try {
        isProcessing.value = true
        const response = await api.rooms.delete(id)
      } finally {
        isProcessing.value = false
      }
    }
    return {
      isProcessing,
      deleteRoom
    }
  },
  update() {
    const isProcessing: Ref<UnwrapRef<boolean>> = ref(false)
    const updateRoom = async (id: string, payload: CreateRoomRequest) =>
      withProcessing(isProcessing, () => api.rooms.update(id, payload as any))
    return {
      isProcessing,
      updateRoom
    }
  }
}

async function withProcessing(
  isProcessing: Ref<UnwrapRef<boolean>>,
  action: () => Promise<unknown>
) {
  try {
    isProcessing.value = true
    await action()
  } finally {
    isProcessing.value = false
  }
}
