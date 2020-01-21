import IRoomForm from '@/models/RoomFrom'
import { IRoom } from '@/models/IRoom'
import createAxios from './config/configureAxios'
import {API_URL} from './config/consts'
import store from '@/store'
import { Admin } from '@/models/Admin'
import { IStudent } from '../models/IStudent';

const axios = createAxios({
    baseURL: API_URL + '/api/v1'
})

export const setAuthorization = (token: string) => {
    axios.defaults.headers.common['Authorization'] = token
}

export const api = {
    rooms: {
        create: (payload: IRoomForm) => axios.post<IRoom>(`/rooms`, payload),
        delete: (id: string) => axios.delete<IRoom>(`/rooms/${id}`),
        update: (id: string, payload: IRoomForm) => axios.put<IRoom>(`/rooms/${id}`, payload),
        findAll: () => axios.get<IRoom[]>('/rooms'),
        students: {
            register_by_admin: (student: IStudent, roomId: string) => axios.post<IRoom>(`/rooms/${roomId}/student`, student),
            update_by_admin: (student: IStudent, roomId: string, studentId: string) => axios.put<IRoom>(`/rooms/${roomId}/student/${studentId}`, student),
            delete_by_admin: (roomId: string, studentId: string) => axios.delete<IRoom>(`/rooms/${roomId}/student/${studentId}`)
        }
    },
    admins: {
        verifyAndCreate: () => axios.post('/admins'),
        accept: (email: string) => axios.put(`/admins/accept/${email}`),
        remove: (email: string) => axios.delete(`/admins/${email}`),
        fetchAll: () => axios.get<Admin[]>('/admins'),
        findMe: () => axios.get<Admin>('/admins/me')
    }
}
