import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios'
import { ResponseOrAny, isResponse } from '../IResponse'
import { Notification } from 'element-ui'
import router from '@/router'

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

      if (error.response.status === 401) {
        router.push('/login')
      }

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

export function parseMessageToNotification(message: string) {
  Notification({
    title: 'Bład!',
    message,
    type: 'error'
  })
}
