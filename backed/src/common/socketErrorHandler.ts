import { logger } from './logger'
import { Message } from './Response'

export default async function <T>(io: SocketIO.Server, err) {
    logger.error(err)
    if (err.name && (err as any).message) {
        const msg = `${err.name}: ${(err as any).message}`
        io.emit('error_occurred', new Message(msg))
    } else {
        io.emit('error_occurred', new Message('Internal Server Error!'))
    }
}
