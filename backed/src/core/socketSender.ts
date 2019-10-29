import { IRoom } from './RoomModel'

export class SocketSender {
    constructor(private readonly io: SocketIO.Server) {}

    sendClientsUpdate(length: number): void {
        this.io.emit('clients_update', length)
    }

    sendRoomUpdate(room: IRoom): void {
        this.io.emit('room_update', room)
    }

    sendReservationUpdate(room: IRoom): void {
        this.io.emit('reservation_update', room)
    }
}