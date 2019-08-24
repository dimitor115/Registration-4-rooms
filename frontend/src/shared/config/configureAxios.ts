import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { IMessage, ResponseOrAny, isResponse } from '../IResponse'
import { Message } from 'element-ui'

export default function createAxios(config: AxiosRequestConfig): AxiosInstance {
    const instance = axios.create(config)

    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            const body: ResponseOrAny = response.data
            if (isResponse(body)) {
                body.messages.forEach(_parseMessageToNotification)
                return {...response, data: response.data.body}
            }
            return response
        },
        (error: any) => {
            const body: ResponseOrAny = error.response.data
            if (isResponse(body)) {
                body.messages.forEach(_parseMessageToNotification)

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


function _parseMessageToNotification({ message, type }: IMessage) {
    Message({
        message,
        type,
        showClose: true,
    })
}
