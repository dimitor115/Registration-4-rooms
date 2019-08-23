export interface IRoom {
    _id:string,
    name: string,
    size: number,
    freeSpace: number
}

export interface IRoomForm {
    name: string,
    size: number
}