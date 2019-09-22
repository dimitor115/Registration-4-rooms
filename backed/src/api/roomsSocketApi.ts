import { StudentsRoomService, RoomReservationsService } from '../service'
import { IStudent } from 'src/models/student.model'
import { Response } from 'src/common/Response'
import { IRoom } from 'src/models/room.model'

export default function configureRoomsSocketApi(io: SocketIO.Server) {

    io.on('connection', async client => {
        // io.emit('rooms', await StudentsRoomService.findAll())

        console.log('user connected')
        client.on('register_student', async (roomId: string, student: IStudent) => {
            const updatedRoom = await StudentsRoomService.addStudent(roomId, student)
            io.emit('room_update', updatedRoom)
        })

        client.on('remove_student', async (roomId: string, student: IStudent, removedBy: string) => {
            const updatedRoom = await StudentsRoomService.removeStudent(roomId, student, removedBy)
            io.emit('room_update', updatedRoom)
        })

        client.on('reserve_room', async (roomId: string, userUUID: string) => {
            const onReservationChange = async (updatedResponse: Promise<Response<IRoom>>) => {
                io.emit('reservation_update', await updatedResponse)
            }
            const updatedRoom = await RoomReservationsService.reserve(roomId, userUUID, onReservationChange)
            io.emit('reservation_update', updatedRoom)
        })

        client.on('disconnect', () => { console.log('user disconnected') })
    })
}