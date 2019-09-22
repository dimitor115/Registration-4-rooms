import io from 'socket.io-client'

import store from '@/store'
import { IResponse, isResponse } from '@/shared/IResponse'
import { parseMessageToNotification } from '@/shared/config/configureAxios'
import { IStudent } from '@/models/IStudent'
import { IRoom } from '@/models/IRoom'

const socket = io('http://localhost:3000')

socket.on('room_update', socketResponseParser<IRoom>(
    (room: IRoom) => {
        if (room) {
            store.commit('updateRoomStudents', room)
        }
    },
))

export default {
    remove_student: (roomId: string, student: IStudent, removedBy: string) =>
        socket.emit('remove_student', roomId, student, removedBy),

    register_student: (roomId: string, student: IStudent) =>
        socket.emit('register_student', roomId, student),
}

function socketResponseParser<T>(func: (x: T) => any): any {
    return (response: IResponse<T>) => {
        if (isResponse(response)) {
            response.messages.forEach(parseMessageToNotification)
            func(response.body)
        }
    }
}
