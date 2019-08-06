import Router from 'koa-router'
import {ObjectsService} from '../service'

const objectsRouter = new Router()

// Hello World route
objectsRouter.post('/room', ObjectsService.create)
objectsRouter.delete('/room/:id', ObjectsService.delete)

export default objectsRouter