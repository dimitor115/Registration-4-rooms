import { ErrorCodes } from './errorCodes'

export class Response<T> {
    readonly body: T | null
    readonly messages: Message[]

    constructor(body: T, messages: Message[] = []) {
        this.body = body
        this.messages = messages
    }

    static withStringMsg<T>(body: T, message: string): Response<T> {
        return new this(body, [new Message(message)])
    }

    static fromStringMsg(message: string): Response<null> {
        return new this(null, [new Message(message)])
    }

    static fromMessage(message: Message): Response<null> {
        return new this(null, [message])
    }

    static fromErrorCode(errorCode: ErrorCodes, type: MessageType = MessageType.ERROR): Response<null> {
        return new this(null, [new Message(errorCode, type)])
    }
}

export class Message {
    constructor(
        readonly message: string,
        readonly type: MessageType = MessageType.ERROR
    ) {}

    static fromErrorCode(errorCode: ErrorCodes, type: MessageType = MessageType.ERROR): Message {
        return new this(errorCode, type)
    }
}

export enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info'
}

