import Router from 'koa-router'
import {ObjectsService} from '../service'

const objectsRouter = new Router()

// Hello World route
objectsRouter.post('/object', ObjectsService.create)

export default objectsRouter