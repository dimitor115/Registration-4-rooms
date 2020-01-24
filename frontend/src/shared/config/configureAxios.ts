import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { IMessage, ResponseOrAny, isResponse } from '../IResponse'
import { Notification } from 'element-ui'

export default function createAxios(config: AxiosRequestConfig): AxiosInstance {
  const instance = axios.create(config)

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const body: ResponseOrAny = response.data
      if (isResponse(body)) {
        body.messages.forEach(parseMessageToNotification)
        return { ...response, data: response.data.body }
      }
      return response
    },
    (error: any) => {
      const body: ResponseOrAny = error.response.data
      if (isResponse(body)) {
        body.messages.forEach(parseMessageToNotification)
      } else {
        Notification({
          title: 'Błąd!',
          message: error.message,
          type: 'error'
        })
      }
      Promise.reject(error)
    }
  )

  return instance
}

export function parseMessageToNotification({ message, type }: IMessage) {
  Notification({
    title: type === 'error' ? 'Bład!' : 'Wiadomość',
    message,
    type
  })
}
