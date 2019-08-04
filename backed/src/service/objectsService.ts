import { BaseContext } from 'koa'
import {plainToClass} from "class-transformer"

import ObjectInbound from '../../../types/ObjectInbound'

export default class ObjectsService {

    public static async create(ctx: BaseContext) {
        ctx.body = 'Tu będzie dodawanie pokoju'
        const room = plainToClass(ObjectInbound, ctx.request.body)
    }

}