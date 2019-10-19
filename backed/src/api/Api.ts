import Router from 'koa-router'
import { Context } from 'koa'
import { RoomsManagementService } from '../service'

const roomsRouter = new Router()

roomsRouter.get('/', (ctx: Context) => { ctx.body = 'Witaj przybyszu w świecie Api !' })
roomsRouter.get('/rooms', RoomsManagementService.findAll)
roomsRouter.post('/rooms', RoomsManagementService.create)
roomsRouter.delete('/rooms/:id', RoomsManagementService.delete)

export default roomsRouter