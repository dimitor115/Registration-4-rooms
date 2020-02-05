import moment from 'moment'

import { logger } from 'config/winstonConfig'
import { Room, IRoom } from 'core/RoomModel'
import { ErrorCodes } from 'common/errorCodes'
import { SocketSender } from 'core/socketSender'

const RESERVATION_DURATION = 25 // seconds

export default class RoomReservationsService {
    constructor(
        private readonly socketSender: SocketSender
    ) {}

    private timeouts: Map<string, NodeJS.Timeout> = new Map()

    public async reserve(
        roomId: string,
        userUUID: string
    ): Promise<IRoom> {
        logger.info(`Making room : ${roomId} reservation for user: ${userUUID}`)

        const room = await Room.findById(roomId)

        if (room.reservedBy && room.reservedBy !== userUUID)
            throw ErrorCodes.CANNOT_RESERVE_THIS_ROOM

        // don't want to block creating reservation by this call
        this.closeOtherUserReservations(roomId, userUUID)

        const reservedUntil = moment().add(RESERVATION_DURATION, 'seconds')

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { reservedBy: userUUID, reservedUntil },
            { new: true }
        )

        if (result) {
            this.createReservationTimeout(roomId)
        }

        return result
    }

    private async closeOtherUserReservations(roomId: string, userUUID: string): Promise<void> {
        const reservedRooms = await Room.find({ reservedBy: userUUID, _id: { $ne: roomId } })

        reservedRooms.forEach(async room => {
            this.findAndClearRoomTimeout(room._id.toString())
            const updatedRoom = await this.closeReservation(room._id)
            this.socketSender.sendReservationUpdate(updatedRoom)
        })
    }

    private async closeReservation(roomId: string): Promise<IRoom> {
        logger.info(`Closing reservation for room: ${roomId}`)

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { reservedBy: null, reservedUntil: null },
            { new: true }
        )
        return result
    }

    private findAndClearRoomTimeout(roomId: string): void {
        const previousTimeout = this.timeouts.get(roomId)
        if (previousTimeout) {
            clearTimeout(previousTimeout)
            this.timeouts.delete(roomId)
        }
    }

    private createReservationTimeout(roomId: string): void {
        const reservationTimeout = setTimeout(
           async () => {
                this.findAndClearRoomTimeout(roomId)
                const updatedRoom = await this.closeReservation(roomId)
                this.socketSender.sendReservationUpdate(updatedRoom)
             },
            RESERVATION_DURATION * 1000
        )

        this.findAndClearRoomTimeout(roomId)
        this.timeouts.set(roomId, reservationTimeout)
    }
}