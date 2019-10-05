import { StudentsRoomService, RoomReservationsService } from '../service'
import { IStudent } from 'src/models/student.model'
import { Response } from 'src/common/Response'
import { IRoom } from 'src/models/room.model'
import errorHandler from '../common/socketErrorHandler'

export default function configureRoomsSocketApi(io: SocketIO.Server) {

    const handle = err => errorHandler(io, err)

    io.on('connection', async client => {

        const roomReservationsService = new RoomReservationsService(
            async (updatedResponse: Promise<Response<IRoom>>) => {
                io.emit('reservation_update', await updatedResponse)
            }
        )

        const reserveRoom = async (roomId: string, userUUID: string) => {
            roomReservationsService
                .reserve(roomId, userUUID)
                .catch(handle)
                .then(updatedRoom => {
                    io.emit('reservation_update', updatedRoom)
                })
        }

        client.on('register_student', async (roomId: string, student: IStudent) => {
            StudentsRoomService
                .addStudent(roomId, student)
                .catch(handle)
                .then(response => {
                    reserveRoom(roomId, student.addedBy)
                    io.emit('room_update', response)
                })
        })

        client.on('remove_student', async (roomId: string, student: IStudent, removedBy: string) => {
            const updatedRoom = await StudentsRoomService.removeStudent(roomId, student, removedBy)
            io.emit('room_update', updatedRoom)
        })

        client.on('reserve_room', reserveRoom)

        client.on('disconnect', () => { console.log('user disconnected') })
    })
}