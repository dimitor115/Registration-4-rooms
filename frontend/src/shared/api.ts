import IRoomForm from '@/models/RoomFrom'
import { IRoom } from '@/models/IRoom'
import createAxios from './config/configureAxios'
import {API_URL} from './config/consts'

const axios = createAxios({
    baseURL: API_URL + '/api/v1'
})

export const api = {
    rooms: {
        create: (payload: IRoomForm) => axios.post<IRoom>(`/rooms`, payload),
        delete: (id: string) => axios.delete<IRoom>(`/rooms/${id}`),
        findAll: () => axios.get<IRoom[]>('/rooms'),
    },
}
