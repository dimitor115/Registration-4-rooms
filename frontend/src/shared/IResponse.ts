export interface IResponse {
    body: any,
    messages: IMessage[]
}

export interface IMessage {
    type: MessageType,
    message: string
}

export enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info'
}

export type ResponseOrAny = IResponse | any;

export function isResponse(toBeDetermined: ResponseOrAny): toBeDetermined is IResponse {
    return (toBeDetermined as IResponse).body !== undefined 
    && (toBeDetermined as IResponse).messages !== undefined
}