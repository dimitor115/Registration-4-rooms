import { IStudent } from './IStudent'

export interface IRoom {
    _id: string,
    name: string,
    size: number,
    students: IStudent[],
    reservedBy: string | null,
    reservedUntil: Date | null
}

export interface IRoomForm {
    name: string,
    size: number
}
