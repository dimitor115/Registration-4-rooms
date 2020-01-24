import io from 'socket.io-client'

import store from '@/store'
import { API_URL } from './config/consts'
import { IMessage } from '@/shared/IResponse'
import { parseMessageToNotification } from '@/shared/config/configureAxios'
import { IStudent } from '@/models/IStudent'
import { IRoom } from '@/models/IRoom'

const socket = io(API_URL)

export const connections = {
  roomUpdates: {
    open: () =>
      socket.on('room_update', (room: IRoom) => {
        if (room) {
          store.commit('updateRoomStudents', room)
        }
      }),
    close: () => socket.removeListener('room_update')
  },
  reservationUpdates: {
    open: () =>
      socket.on('reservation_update', (room: IRoom) => {
        if (room) {
          store.commit('updateRoomReservation', room)
        }
      }),
    close: () => socket.removeListener('reservation_update')
  },
  clientsUpdates: {
    open: () =>
      socket.on('clients_update', (count: number) => {
        store.commit('setClientsCount', count)
      }),
    close: () => socket.removeListener('clients_update')
  }
}

export default {
  remove_student: (roomId: string, student: IStudent, removedBy: string): Promise<void> =>
    new Promise((resolve, reject) => {
      socket.emit('remove_student', roomId, student, removedBy, (err: IMessage | null) => {
        if (err) {
          parseMessageToNotification(err)
          reject(err)
        } else {
          resolve()
        }
      })
    }),

  register_student: (roomId: string, student: IStudent): Promise<void> =>
    new Promise((resolve, reject) => {
      socket.emit('register_student', roomId, student, (err: IMessage | null) => {
        if (err) {
          parseMessageToNotification(err)
          reject(err)
        } else {
          resolve()
        }
      })
    }),

  reserve_room: (roomId: string, userUUID: string): Promise<void> =>
    new Promise((resolve, reject) => {
      socket.emit('reserve_room', roomId, userUUID, (err: IMessage | null) => {
        if (err) {
          parseMessageToNotification(err)
          reject(err)
        } else {
          resolve()
        }
      })
    })
}
