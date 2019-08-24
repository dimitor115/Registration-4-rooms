import IRoomForm from '@/models/RoomFrom'
import { IRoom } from '@/models/IRoom'
import createAxios from './config/configureAxios'

const axios = createAxios({
    baseURL: 'http://localhost:3000/api/v1',
})

export const api = {
    rooms: {
        create: (payload: IRoomForm) => axios.post<IRoom>(`/rooms`, payload),
        delete: (id: string) => axios.delete<IRoom>(`/rooms/${id}`),
        findAll: () => axios.get<IRoom[]>('/rooms'),
    },
}
