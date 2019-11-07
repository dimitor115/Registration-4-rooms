import Koa from 'koa'
import http from 'http'
import socketIO from 'socket.io'
import jwt from 'koa-jwt'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import 'reflect-metadata'


import { requestLogger, logger } from './config/winstonConfig'
import { connectToMongo } from './config/mongooseConfig'
import errorHandler from './common/errorHandler'
import { config } from './config/envConfig'
import initApi from './core/api'
import { SocketSender } from './core/socketSender'
import { RequestManager } from './modules/reservations/requestsManager'
import RoomReservationsService from './modules/reservations/RoomReservationsService'
import StudentRegistrationService from './modules/registrations/StudentRegistrationService'
import RoomsManagementService from './modules/rooms/RoomsManagementService'

(async function start(): Promise<void> {
    logger.info('Starting application')

    const app = new Koa()
    const server = http.createServer(app.callback())
    const io = socketIO(server)


    app.use(helmet())
    app.use(cors())
    app.use(requestLogger)
    app.use(bodyParser())
    app.use(errorHandler)

    const socketSender = new SocketSender(io)
    const reservationsService = new RoomReservationsService(socketSender)
    const studentRegistrationService = new StudentRegistrationService()
    const roomManagmentService = new RoomsManagementService()
    const requestManager = new RequestManager(socketSender, reservationsService)

    const api = initApi(io, socketSender, reservationsService, studentRegistrationService, roomManagmentService, requestManager)

    app
        .use(api.prefix('/api/v1').routes())
        .use(api.allowedMethods())

    await connectToMongo(config.databaseUrl)

    server.listen(config.port)

    logger.info(`Application ready!`)
    logger.info(`Server running on port : ${config.port}`)
})()


// -- temporary protected routes are disabled

// // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
// // do not protect swagger-json and swagger-html endpoints
// app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));
// // these routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
// app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());