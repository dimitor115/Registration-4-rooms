import { Context } from 'koa'
import { logger } from './logger'

export default async function (ctx: Context, next: () => Promise<any>): Promise<void> {
  try {
    await next()
  } catch (err) {
    logger.error(err)

    if (err.name && (err as any).message) {
      const msg = `${err.name}: ${(err as any).message}`
      ctx.status = err.name === 'ValidationError' ? 400 : 500
      ctx.body = {
        messages: [err.message]
      }
    } else {
      ctx.status = err.statusCode || err.status || 500
      ctx.body = {
        messages: [err.message]
      }
    }
  }
}