import Router from 'koa-router'
import { Context } from 'koa'
import { Message } from 'common/Response'
import { SocketSender } from './socketSender'
import { socketErrorHandler } from './socketErrorHandler'

import { IRoom } from './RoomModel'
import RoomsManagementService from 'modules/rooms/RoomsManagementService'
import RoomReservationsService from 'modules/reservations/RoomReservationsService'
import StudentRegistrationService from 'modules/registrations/StudentRegistrationService'
import { IStudent } from 'modules/registrations/StudentModel'
import { RequestManager, ReservationRequest } from 'modules/reservations/RequestsManager'
import { authMiddleware } from 'common/authentication'
import AdministratorsService from 'modules/administrators/AdministratorsService'
import RoomExportService from 'modules/rooms/RoomsExportService'
import { logger } from '../config/winstonConfig'

export default function api(
    io: SocketIO.Server,
    socketSender: SocketSender,
    administratorsService: AdministratorsService,
    roomReservationsService: RoomReservationsService,
    studentRegistrationService: StudentRegistrationService,
    roomManagementService: RoomsManagementService,
    requestManger: RequestManager,
    roomExportService: RoomExportService
): Router {
    initSocketApi(io, socketSender, roomReservationsService, studentRegistrationService, requestManger)
    return initRestApi(roomManagementService, administratorsService, roomExportService, studentRegistrationService)
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
            callback: (msg: string | null) => void
        ) => {
            studentRegistrationService
                .addStudent(roomId, student)
                .then((updatedRoom: IRoom) => {``
                    requestManger
                    .handleRequest(new ReservationRequest(roomId, student.addedBy))
                    .catch(err => {logger.error(err)})
                    .then((updatedRoom: IRoom) => {
                        socketSender.sendReservationUpdate(updatedRoom)
                    })

                    socketSender.sendRoomUpdate(updatedRoom)
                    callback(null)
                })
                .catch(socketErrorHandler(callback))
        })

        client.on('remove_student', async (
            roomId: string,
            student: IStudent,
            removedBy: string,
            callback: (msg: string | null) => void
        ) => {
            studentRegistrationService
                .removeStudent(roomId, student, removedBy)
                .then((updatedRoom: IRoom) => {
                    socketSender.sendRoomUpdate(updatedRoom)
                    callback(null)
                })
                .catch(socketErrorHandler(callback))
        })

        client.on('reserve_room', async (
            roomId: string,
            userUUID: string,
            callback: (msg: string | null) => void
        ) => {
            requestManger
                .handleRequest(new ReservationRequest(roomId, userUUID))
                .then((updatedRoom: IRoom) => {
                    socketSender.sendReservationUpdate(updatedRoom)
                    callback(null)
                })
                .catch(socketErrorHandler(callback))
        })

        client.on('disconnect', () => {
            const currentClientsCount = Object.keys(io.sockets.sockets).length
            socketSender.sendClientsUpdate(currentClientsCount)
        })
    })
}

function initRestApi(
    roomManagementService: RoomsManagementService,
    administratorsService: AdministratorsService,
    roomExportService: RoomExportService,
    studentRegistrationService: StudentRegistrationService
): Router {
    const router = new Router()

    router.get('/', (ctx: Context) => { ctx.body = 'Witaj przybyszu w świecie Api !' })

    router.post('/admins', administratorsService.verifyAndCreateAdmin)
    router.get('/admins', authMiddleware, administratorsService.findAll)
    router.get('/admins/me', authMiddleware, administratorsService.findAdminDataByToken)
    router.put('/admins/accept/:email', authMiddleware, administratorsService.accept)
    router.delete('/admins/:email', authMiddleware, administratorsService.remove)

    router.get('/rooms', roomManagementService.findAll)
    router.get('/rooms/export', roomExportService.exportAndHost)
    router.post('/rooms', authMiddleware, roomManagementService.create)
    router.delete('/rooms/:id', authMiddleware, roomManagementService.delete)
    router.put('/rooms/:id', authMiddleware, roomManagementService.update)

    router.post('/rooms/:id/student', authMiddleware, (ctx) => studentRegistrationService.addStudentByAdmin(ctx))
    router.delete('/rooms/:id/student/:studentId', authMiddleware, (ctx) => studentRegistrationService.removeByAdmin(ctx))
    router.put('/rooms/:id/student/:studentId', authMiddleware, (ctx) => studentRegistrationService.updateByAdmin(ctx))

    return router
}
