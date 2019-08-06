import { Context } from 'koa'
import {IRouterContext} from 'koa-router'
import { logger } from '../common/logger'
import { Room, IRoom } from '../models/room.model'

export default class ObjectsService {

    public static async create(ctx: Context) {
        const room: IRoom = new Room(ctx.request.body)
        logger.info(`Creating new room with name: ${room.name}`)
        const result = await room.save()
        ctx.body = result
        ctx.status = 201
    }

    public static async delete(ctx: Context) {
        const id  = ctx.params.id
        logger.info(`Removing room with id: ${id}`)
        const result = await Room.findByIdAndDelete({_id:id})

        if(result) {
            ctx.body = result
            ctx.status = 200
        } else {
            ctx.body = `There is no room with given id: ${id}`
            ctx.status = 404
        }
    }

}