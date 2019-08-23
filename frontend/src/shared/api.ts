import axios, { AxiosResponse } from 'axios'
import { Message } from 'element-ui'
import { IMessage, ResponseOrAny, isResponse } from '../shared/IResponse'
import IRoomForm from '../models/RoomFrom'

const instance = axios.create({
    baseURL: 'http://localhost:3000'
})

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
                showClose: true
            })
        }
        Promise.reject(error)
    }
)

function _parseMessageToNotification({ message, type }: IMessage) {
    Message({
        message,
        type,
        showClose: true
    })
}


export const api = {
    ROOMS: {
        CREATE: (payload: IRoomForm) => instance.post(`/room`, payload),
        DELETE: (id: string) => instance.delete(`/room/${id}`)
    }
}