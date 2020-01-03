import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { IMessage, ResponseOrAny, isResponse } from '../IResponse'
import { Message } from 'element-ui'
import store from '@/store';

export default function createAxios(config: AxiosRequestConfig): AxiosInstance {

    
    const instance = axios.create(config)

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            const body: ResponseOrAny = response.data
            if (isResponse(body)) {
                body.messages.forEach(parseMessageToNotification)
                return {...response, data: response.data.body}
            }
            return response
        },
        (error: any) => {
            const body: ResponseOrAny = error.response.data
            if (isResponse(body)) {
                body.messages.forEach(parseMessageToNotification)

            } else {
                Message({
                    message: error.message,
                    type: 'error',
                    showClose: true,
                })
            }
            Promise.reject(error)
        },
    )

    return instance
}


export function parseMessageToNotification({ message, type }: IMessage) {
    Message({
        message,
        type,
        showClose: true,
    })
}
