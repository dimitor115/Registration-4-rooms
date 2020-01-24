import { Context } from 'koa'
import { logger } from 'config/winstonConfig'

export default async function (ctx: Context, next: () => Promise<any>): Promise<void> {
  try {
    await next()
  } catch (err) {
    logger.error(err)

    if (err.name && (err).message) {
      const msg = `${err.name}: ${(err).message}`
      ctx.status = err.name === 'ValidationError' ? 400 : 500
      ctx.body = {
        messages: [msg]
      }
    } else {
      ctx.status = err.statusCode || err.status || 500
      ctx.body = {
        messages: [err.message]
      }
    }
  }
}