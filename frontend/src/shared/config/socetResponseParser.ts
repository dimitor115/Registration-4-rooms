import { IResponse, isResponse } from '../IResponse';
import { parseMessageToNotification } from './configureAxios';

export function socketResponseParser<T>(func: (x:T)=>any):any {
    return (response: IResponse<T>) => {
        if (isResponse(response)) {
            response.messages.forEach(parseMessageToNotification)
            func(response.body)
        }
    }
}



