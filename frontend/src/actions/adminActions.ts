import { ref } from '@vue/composition-api'
import { api } from '@/shared/api'
import { withProcessing } from '@/actions/rootActions'
import { IStudent } from '@/models/IStudent'

export function registerStudentByAdminAction() {
  const isProcessing = ref(false)
  const register = async (student: IStudent, roomId: string) =>
    withProcessing(isProcessing, () => api.rooms.students.register_by_admin(student, roomId))
  return { isProcessing, register }
}

export function updateStudentByAdminAction() {
  const isProcessing = ref(false)
  const update = async (student: IStudent, roomId: string, studentId: string) =>
    withProcessing(isProcessing, () =>
      api.rooms.students.update_by_admin(student, roomId, studentId)
    )
  return { isProcessing, update }
}

export function removeStudentByAdmin() {
  const isProcessing = ref(false)
  const remove = async (roomId: string, studentId: string) =>
    withProcessing(isProcessing, () => api.rooms.students.delete_by_admin(roomId, studentId))
  return { isProcessing, remove }
}
