import { Context } from 'koa'
import { IRouterContext } from 'koa-router'
import { logger } from '../common/logger'
import { Room, IRoom } from '../models/room.model'
import { Response, Message, MessageType } from '../common/Response'

export default class RoomService {

    public static async findAll(ctx: Context) {
        logger.info(`Finding all rooms`)
        const result = await Room.find()
        if(result) {
            ctx.body = new Response(result)
        } else {
            ctx.state = 404
            ctx.body = Response.fromMessage(
                new Message(`There is problem with fetching all available rooms`)
            )
        }
    }

    public static async create(ctx: Context) {
        const bareRoom = { freeSpace: 0, ...ctx.request.body }
        const room: IRoom = new Room(bareRoom)
        logger.info(`Creating new room with name: ${room.name}`)
        const result = await room.save()
        ctx.body = new Response(result)
        ctx.status = 201
    }

    public static async delete(ctx: Context) {
        const id = ctx.params.id
        logger.info(`Removing room with id: ${id}`)
        const result = await Room.findByIdAndDelete({ _id: id })

        if (result) {
            ctx.status = 200
            ctx.body = new Response(result)
        } else {
            ctx.status = 404
            ctx.body = Response.fromMessage(
                new Message(`There is no room with given id: ${id}`, MessageType.ERROR)
            )
        }
    }

}