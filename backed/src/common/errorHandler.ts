import {Context} from 'koa'
import {logger} from './logger'

export default async function (ctx: Context, next: () => Promise<any>) {
    try {
        await next()
      } catch (err) {
        logger.error(err)
        ctx.status = err.statusCode || err.status || 50
        ctx.body = {
          message: err.message
        }
      }
}