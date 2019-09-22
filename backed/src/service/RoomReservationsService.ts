import moment from 'moment'

import { logger } from '../common/logger'
import { Room, IRoom } from '../models/room.model'
import { Response } from '../common/Response'

const RESERVATION_DURATION = 20 // seconds

export default class RoomReservationsService {

    private static timeouts: Array<ReservationTimeout> = []

    public static async reserve(
        roomId: string,
        userUUID: string,
        onReservationFinish: (updatedResponse: Promise<Response<IRoom>>) => void
    ) {
        logger.info(`Making room : ${roomId} reservation for user: ${userUUID}`)

        const reservedUntil = moment().add(RESERVATION_DURATION, 'seconds')

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { reservedBy: userUUID, reservedUntil },
            { new: true }
        )

        if (result) {
            this.createReservationTimeout(roomId, onReservationFinish)
        }

        return new Response(result)
    }

    private static async closeReservation(roomId: string) {
        logger.info(`Closing reservation for room: ${roomId}`)

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { reservedBy: null, reservedUntil: null },
            { new: true }
        )
        return new Response(result)
    }

    private static createReservationTimeout(
        roomId: string,
        onReservationFinish: (updatedResponse: Promise<Response<IRoom>>) => void
    ) {
        const reservationTimeout = setTimeout(
            () => { onReservationFinish(this.closeReservation(roomId)) },
            RESERVATION_DURATION * 1000
        )

        const previousRecord = this.timeouts.find(it => it.roomId === roomId)
        if (previousRecord) {
            clearTimeout(previousRecord.timeoutRef)
            previousRecord.timeoutRef = reservationTimeout
        } else {
            this.timeouts.push(
                new ReservationTimeout(roomId, reservationTimeout)
            )
        }
    }
}

class ReservationTimeout {
    readonly roomId: string
    timeoutRef: NodeJS.Timeout

    constructor(
        roomId: string,
        timeoutRef: NodeJS.Timeout
    ) {
        this.roomId = roomId
        this.timeoutRef = timeoutRef
    }
}