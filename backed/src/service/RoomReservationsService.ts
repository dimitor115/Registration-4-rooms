import moment from 'moment'

import { logger } from '../common/logger'
import { Room, IRoom } from '../models/room.model'
import { Response, Message } from '../common/Response'
import { ErrorCodes } from '../common/errorCodes'

const RESERVATION_DURATION = 20 // seconds

export default class RoomReservationsService {

    private timeouts: Map<string, NodeJS.Timeout> = new Map()
    private emitReservationUpdate: (updatedResponse: Promise<Response<IRoom>>) => void

    constructor(emitReservationUpdate: (updatedResponse: Promise<Response<IRoom>>) => void) {
        this.emitReservationUpdate = emitReservationUpdate
    }

    public async reserve(
        roomId: string,
        userUUID: string
    ): Promise<IRoom> {
        logger.info(`Making room : ${roomId} reservation for user: ${userUUID}`)

        const room = await Room.findById(roomId)

        if (room.reservedBy && room.reservedBy !== userUUID)
            throw Message.fromErrorCode(ErrorCodes.CANNOT_RESERVE_THIS_ROOM)

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

    private async closeOtherUserReservations(roomId: string, userUUID: string) {
        const reservedRooms = await Room.find({ reservedBy: userUUID, _id: { $ne: roomId } })

        reservedRooms.forEach(async room => {
            this.findAndClearRoomTimeout(room._id.toString())
            this.emitReservationUpdate(this.closeReservation(room._id))
        })
    }

    private async closeReservation(roomId: string) {
        logger.info(`Closing reservation for room: ${roomId}`)

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { reservedBy: null, reservedUntil: null },
            { new: true }
        )
        return new Response(result)
    }

    private findAndClearRoomTimeout(roomId: string) {
        const previousTimeout = this.timeouts.get(roomId)
        if (previousTimeout) {
            clearTimeout(previousTimeout)
            this.timeouts.delete(roomId)
        }
    }

    private createReservationTimeout(roomId: string) {
        const reservationTimeout = setTimeout(
            () => {
                this.findAndClearRoomTimeout(roomId)
                this.emitReservationUpdate(this.closeReservation(roomId))
             },
            RESERVATION_DURATION * 1000
        )

        this.findAndClearRoomTimeout(roomId)
        this.timeouts.set(roomId, reservationTimeout)
    }
}