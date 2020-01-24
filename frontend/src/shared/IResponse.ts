export interface IResponse<T> {
  body: T
  messages: IMessage[]
}

export interface IMessage {
  type: MessageType
  message: string
}

export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

export type ResponseOrAny = IResponse<any> | any

export function isResponse(toBeDetermined: ResponseOrAny): toBeDetermined is IResponse<any> {
  return (
    (toBeDetermined as IResponse<any>).body !== undefined &&
    (toBeDetermined as IResponse<any>).messages !== undefined
  )
}
