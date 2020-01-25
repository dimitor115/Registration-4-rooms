import Koa from 'koa'
import { config } from './envConfig'
import winston, { format } from 'winston'

winston.configure({
    level: config.debugLogging ? 'debug' : 'info',
    transports: [
        // - Write all logs error (and below) to `error.log`.
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // - Write to all logs with specified level to console.
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
    ]
})

export const logger = winston

export function requestLogger(ctx: Koa.Context, next: () => Promise<any>): Promise<any> {

    const start = new Date().getMilliseconds()
    return next().then(() => {
        const ms = new Date().getMilliseconds() - start
        const logLevel = _mapStatusToLogLevel(ctx.status)
        const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`
        winston.log(logLevel, msg)
    })
}

const _mapStatusToLogLevel = (status: number) => {
    if (status >= 500) {
        return 'error'
    } else if (status >= 400) {
        return 'warn'
    } else if (status >= 100) {
        return 'info'
    }
}
