import { BaseContext } from 'koa'
import {Room, IRoom} from '../models/room.model'

export default class ObjectsService {

    public static async create(ctx: BaseContext) {
        console.log('nanan')
        const room : IRoom = new Room(ctx.request.body)
        console.log('chuj')
        ctx.body = "nananana"
    }

}