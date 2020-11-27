import { Ref, UnwrapRef } from '@vue/composition-api'

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
