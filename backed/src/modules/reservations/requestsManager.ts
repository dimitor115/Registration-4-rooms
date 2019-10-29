import { SocketSender } from '../../core/socketSender'
import RoomReservationsService from './RoomReservationsService'

export class RequestManager {
    constructor(
        private readonly socketSender: SocketSender,
        private readonly roomReservationService: RoomReservationsService
    ) { }

    addNewRequestToQueue() { }
}