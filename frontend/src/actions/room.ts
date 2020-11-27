import { ref } from '@vue/composition-api'
import { api } from '@/shared/api'
import { CreateRoomRequest } from '@/models/CreateRoomRequest'
import { withProcessing } from '@/actions/root'
import { IStudent } from '@/models/IStudent'
import { IRoom } from '@/models/IRoom'
import socketApi from '@/shared/socketApi'

export const rooms = ref<IRoom[]>([])

export function updateRoomStudents(updatedRoom: IRoom) {
  const room = rooms.value.find(it => it._id === updatedRoom._id)
  if (room) {
    room.students = updatedRoom.students
  }
}

export function updateRoomReservation(updatedRoom: IRoom) {
  const room = rooms.value.find(it => it._id === updatedRoom._id)
  if (room) {
    room.reservedBy = updatedRoom.reservedBy
    room.reservedUntil = updatedRoom.reservedUntil
  }
}

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

export function reserveAction() {
  const isProcessing = ref(false)
  const reserve = async (roomId: string, userUUID: string) =>
    withProcessing(isProcessing, () => socketApi.reserve_room(roomId, userUUID))
  return { isProcessing, reserve }
}

export function registerStudentAction() {
  const isProcessing = ref(false)
  const register = async (roomId: string, student: IStudent) =>
    withProcessing(isProcessing, () => socketApi.register_student(roomId, student))
  return { isProcessing, register }
}

export function removeStudentAction() {
  const isProcessing = ref(false)
  const remove = async (roomId: string, student: IStudent, removedBy: string) =>
    withProcessing(isProcessing, () => socketApi.remove_student(roomId, student, removedBy))
  return { isProcessing, remove }
}
