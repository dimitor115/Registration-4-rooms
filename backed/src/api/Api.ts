import Router from 'koa-router'
import { RoomsManagementService } from '../service'

const roomsRouter = new Router()

roomsRouter.get('/rooms', RoomsManagementService.findAll)
roomsRouter.post('/rooms', RoomsManagementService.create)
roomsRouter.delete('/rooms/:id', RoomsManagementService.delete)

export default roomsRouter