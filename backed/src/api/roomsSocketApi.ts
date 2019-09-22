import { StudentsRoomService } from '../service'
import { IStudent } from 'src/models/student.model'

export default function configureRoomsSocketApi(io: SocketIO.Server) {

    io.on('connection', async client => {
        // io.emit('rooms', await StudentsRoomService.findAll())

        console.log('user connected')
        client.on('register_student', async (roomId: string, student: IStudent) => {
            io.emit('room_update', await StudentsRoomService.addStudent(roomId, student))
        })

        client.on('remove_student', async (roomId: string, student: IStudent, removedBy: string) => {
            io.emit('room_update', await StudentsRoomService.removeStudent(roomId, student, removedBy))
        })

        client.on('disconnect', () => {console.log('user disconnected')})
    })
}