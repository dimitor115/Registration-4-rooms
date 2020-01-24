import { Message } from 'common/Response'
import { logger } from 'config/winstonConfig'

export function socketErrorHandler(errorCallback: (msg: Message) => void): (err: any) => void {
    return (err: any) => {
        logger.error(err)
        if (isMessage(err)) {
            errorCallback(err)
        } else if (err.name && (err).message) {
            const msg = `${err.name}: ${(err).message}`
            errorCallback(new Message(msg))
        } else {
            errorCallback(new Message('Internal Server Error!'))
        }
    }
}

type MessageOrAny = Message | any

function isMessage(toDeterminate: MessageOrAny): toDeterminate is Message {
    return (toDeterminate as Message).message !== undefined && (toDeterminate as Message).type !== undefined
}