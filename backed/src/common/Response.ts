export class Response {
    readonly body: any | null
    readonly messages: Message[]

    constructor(body: any, messages: Message[] = []) {
        this.body = body
        this.messages = messages
    }

    static withStringMsg(body:any, message:string) {
        return new this(body, [new Message(message)])
    }

    static fromStringMsg(message:string) {
        return new this(null, [new Message(message)])
    }

    static fromMessage(message:Message) {
        return new this(null, [message])
    }
}

export class Message{
    constructor(
        readonly message:string,
        readonly type: MessageType = MessageType.INFO
    ){}
}

export enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info'
}

