import io from 'socket.io-client'

import store from '@/store'
import { IResponse, isResponse, IMessage } from '@/shared/IResponse'
import { parseMessageToNotification } from '@/shared/config/configureAxios'
import { IStudent } from '@/models/IStudent'
import { IRoom } from '@/models/IRoom'

const socket = io('http://localhost:3000')

socket.on('room_update', (room: IRoom) => {
  if(room) {
    store.commit('updateRoomStudents', room)
  }
})

socket.on('reservation_update', (room: IRoom) => {
  if(room) {
    store.commit('updateRoomReservation', room)
  }
})

export default {
  remove_student: (roomId: string, student: IStudent, removedBy: string) =>
    socket.emit('remove_student', roomId, student, removedBy, socketErrorHandler),

  register_student: (roomId: string, student: IStudent) =>
    socket.emit('register_student', roomId, student, socketErrorHandler),

  reserve_room: (roomId: string, userUUID: string) =>
    socket.emit('reserve_room', roomId, userUUID, socketErrorHandler),
}

function socketErrorHandler<T>(msg: IMessage) {
  parseMessageToNotification(msg)
}
