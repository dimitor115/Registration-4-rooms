import { StudentRegistrationService, RoomReservationsService } from '../service'
import { IStudent } from '../models/student.model'
import { Response, Message } from '../common/Response'
import { IRoom } from '../models/room.model'
import { logger } from '../config/winstonConfig'

export default function configureSocketApi(io: SocketIO.Server): void {

    io.on('connection', async client => {
        io.emit('clients_update', Object.keys(io.sockets.sockets).length)

        const roomReservationsService = new RoomReservationsService(
            async (updatedResponse: Promise<IRoom>) => {
                io.emit('reservation_update', await updatedResponse)
            }
        )

        const reserveRoom = async (roomId: string, userUUID: string, errorCallback: (msg: Message) => void) => {
            roomReservationsService
                .reserve(roomId, userUUID)
                .catch(socketErrorHandler(errorCallback))
                .then(updatedRoom => {
                    io.emit('reservation_update', updatedRoom)
                })
        }

        client.on('register_student', async (roomId: string, student: IStudent, errorCallback: (msg: Message) => void) => {
            StudentRegistrationService
                .addStudent(roomId, student)
                .catch(socketErrorHandler(errorCallback))
                .then(response => {
                    reserveRoom(roomId, student.addedBy, errorCallback)
                    io.emit('room_update', response)
                })
        })

        client.on('remove_student', async (roomId: string, student: IStudent, removedBy: string, errorCallback: (msg: Message) => void) => {
            StudentRegistrationService
                .removeStudent(roomId, student, removedBy)
                .catch(socketErrorHandler(errorCallback))
                .then(response => {
                    io.emit('room_update', response)
                })
        })

        client.on('reserve_room', reserveRoom)

        client.on('disconnect', () => { io.emit('clients_update', Object.keys(io.sockets.sockets).length) })
    })
}

function socketErrorHandler(errorCallback: (msg: Message) => void): (err: any) => void {
    return (err: any) => {
        logger.error(err)
        if (isMessage(err)) {
            errorCallback(err)
        } else if (err.name && (err as any).message) {
            const msg = `${err.name}: ${(err as any).message}`
            errorCallback(new Message(msg))
        } else {
            errorCallback(new Message('Internal Server Error!'))
        }
    }
}

type MessageOrAny = Message | any

function isMessage(toDeterminate: MessageOrAny): toDeterminate is Message {
    return (toDeterminate as Message).message !== undefined && (toDeterminate as Message).type !== undefined
}