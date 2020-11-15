import { Ref, ref, UnwrapRef } from '@vue/composition-api'
import { IRoom } from '@/models/IRoom'

export const rooms = ref<IRoom[]>([])

export async function withProcessing(
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
