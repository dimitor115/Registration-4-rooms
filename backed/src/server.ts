import Koa from 'koa'
import http from 'http'
import socketIO from 'socket.io'
import jwt from 'koa-jwt'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import 'reflect-metadata'


import { requestLogger, logger } from './common/logger'
import { connectToMongo } from './common/config.mongoose'
import errorHandler from './common/errorHandler'
import { config } from './common/config'
import { RoomsApi } from './api'
import configureRoomsSocketApi from './api/roomsSocketApi';

const app = new Koa()
const server = http.createServer(app.callback())
const io = socketIO(server)


app.use(helmet())
app.use(cors())
app.use(requestLogger)
app.use(bodyParser())
app.use(errorHandler)

app.use(
    RoomsApi.prefix('/api/v1').routes()
).use(RoomsApi.allowedMethods())

configureRoomsSocketApi(io)

connectToMongo(config.databaseUrl).then(() => {
    server.listen(config.port)
    logger.info(`Server running on port : ${config.port}`)
})


// -- temporary protected routes are disabled

// // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
// // do not protect swagger-json and swagger-html endpoints
// app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));
// // these routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
// app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());