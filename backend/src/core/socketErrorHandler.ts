import { logger } from 'config/winstonConfig'

export function socketErrorHandler(errorCallback: (msg: string) => void): (err: any) => void {
    return (err: any) => {
        logger.error(err)
        console.log('errr')
        if (typeof err === 'string') {
            errorCallback(err)
        } else if (err.name && (err).message) {
            const msg = `${err.name}: ${(err).message}`
            errorCallback(msg)
        } else {
            errorCallback('Internal Server Error!')
        }
        // throw ''
    }
}