import Router from 'koa-router'
import { Context } from 'koa'
import RoomsManagementService from '../modules/rooms/RoomsManagementService'
import { SocketSender } from './socketSender'
import RoomReservationsService from '../modules/reservations/RoomReservationsService'
import StudentRegistrationService from '../modules/registrations/StudentRegistrationService'
import { Message } from 'src/common/Response'
import { socketErrorHandler } from './socketErrorHandler'
import { IRoom } from './RoomModel'
import { IStudent } from '../modules/registrations/StudentModel'
import { RequestManager, ReservationRequest } from '../modules/reservations/requestsManager'

export default function api(
    io: SocketIO.Server,
    socketSender: SocketSender,
    roomReservationsService: RoomReservationsService,
    studentRegistrationService: StudentRegistrationService,
    roomManagementService: RoomsManagementService,
    requestManger: RequestManager
): Router {
    initSocketApi(io, socketSender, roomReservationsService, studentRegistrationService, requestManger)
    return initRestApi(roomManagementService)
}

function initSocketApi(
    io: SocketIO.Server,
    socketSender: SocketSender,
    roomReservationsService: RoomReservationsService,
    studentRegistrationService: StudentRegistrationService,
    requestManger: RequestManager
): void {
    io.on('connection', async client => {

        const currentClientsCount = Object.keys(io.sockets.sockets).length
        socketSender.sendClientsUpdate(currentClientsCount)

        client.on('register_student', async (
            roomId: string,
            student: IStudent,
            callback: (msg: Message | null) => void
        ) => {
            studentRegistrationService
                .addStudent(roomId, student)
                .catch(socketErrorHandler(callback))
                .then((updatedRoom: IRoom) => {
                    socketSender.sendRoomUpdate(updatedRoom)
                    callback(null)
                })
        })

        client.on('remove_student', async (
            roomId: string,
            student: IStudent,
            removedBy: string,
            callback: (msg: Message | null) => void
        ) => {
            studentRegistrationService
                .removeStudent(roomId, student, removedBy)
                .catch(socketErrorHandler(callback))
                .then((updatedRoom: IRoom) => {
                    socketSender.sendRoomUpdate(updatedRoom)
                    callback(null)
                })
        })

        client.on('reserve_room', async (
            roomId: string,
            userUUID: string,
            callback: (msg: Message | null) => void
        ) => {
            requestManger
                .handleRequest(new ReservationRequest(roomId, userUUID))
                .catch(socketErrorHandler(callback))
                .then((updatedRoom: IRoom) => {
                    socketSender.sendReservationUpdate(updatedRoom)
                    callback(null)
                })
        })

        client.on('disconnect', () => {
            const currentClientsCount = Object.keys(io.sockets.sockets).length
            socketSender.sendClientsUpdate(currentClientsCount)
        })
    })
}

function initRestApi(
    roomManagementService: RoomsManagementService
): Router {
    const router = new Router()

    router.get('/', (ctx: Context) => { ctx.body = 'Witaj przybyszu w świecie Api !' })

    router.get('/rooms', roomManagementService.findAll)
    router.post('/rooms', roomManagementService.create)
    router.delete('/rooms/:id', roomManagementService.delete)

    return router
}

