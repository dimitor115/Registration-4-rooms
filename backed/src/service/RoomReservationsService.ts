import moment from 'moment'

import { logger } from '../common/logger'
import { Room } from '../models/room.model'
import { Response } from '../common/Response'

const RESERVATION_DURATION = 60 // seconds

export default class RoomReservationsService {

    public static async reserve(roomId: string, userUUID: string) {
        logger.info(`Making room : ${roomId} reservation for user: ${userUUID}`)

        const reservedUntil = moment().add(RESERVATION_DURATION, 'seconds')

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { reservedBy: userUUID, reservedUntil },
            { new: true }
        )

        return new Response(result)
    }
}