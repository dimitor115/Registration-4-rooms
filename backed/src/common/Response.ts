export class Response {
    readonly data: any | null
    readonly messages: Message[]

    constructor(data: any, messages: Message[] = []) {
        this.data = data
        this.messages = messages
    }

    static withStringMsg(data:any, message:string) {
        return new this(data, [new Message(message)])
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

