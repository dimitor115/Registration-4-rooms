import Router from 'koa-router'
import {RoomsService} from '../service'

const roomsRouter = new Router()

// Hello World route
roomsRouter.get('/rooms', RoomsService.findAll)
roomsRouter.post('/rooms', RoomsService.create)
roomsRouter.delete('/rooms/:id', RoomsService.delete)

export default roomsRouter