import uuid from 'uuid/v4'
import { SocketSender } from 'core/socketSender'
import RoomReservationsService from './RoomReservationsService'
import { clearInterval } from 'timers'
import { IRoom } from 'core/RoomModel'
import { logger } from 'config/winstonConfig'

const CHECK_INTERVAL = 100
export class RequestManager {
    private requestQueue: Object
    constructor(
        private readonly socketSender: SocketSender,
        private readonly roomReservationService: RoomReservationsService
    ) {
        this.requestQueue = {}
     }

    async handleRequest(request: ReservationRequest): Promise<IRoom> {
        this.addNewRequestToQueue(request)
        await this.waitForRequestTime(request)
        try {
            const result = await this.roomReservationService.reserve(request.roomId, request.userUUID)
            this.removeRequestFromQueue(request)
            return result
        } catch(err) {
            this.removeRequestFromQueue(request)
            throw err
        }
    }

    private removeRequestFromQueue(request: ReservationRequest): void {
        this.requestQueue[request.roomId] = this.requestQueue[request.roomId].slice(1)
    }

    private async waitForRequestTime(request: ReservationRequest): Promise<void> {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const [firstInQueue] = this.requestQueue[request.roomId] as Array<ReservationRequest>
                if (request.requestUUID === firstInQueue.requestUUID) {
                    clearInterval(interval)
                    resolve()
                }
            }, CHECK_INTERVAL)
        })

    }

    private addNewRequestToQueue(request: ReservationRequest): void {
        logger.info(`Adding new request to room ${request.roomId} queue.`)
        const roomQueue = this.prepareRoomQueue(request.roomId)
        roomQueue.push(request)
    }

    private prepareRoomQueue(roomId: string): Array<ReservationRequest> {
        if (!this.requestQueue[roomId]) {
            this.requestQueue[roomId] = []
        }
        return this.requestQueue[roomId]
    }
}

export class ReservationRequest {
    readonly requestUUID: string
    constructor(
        readonly roomId: string,
        readonly userUUID: string
    ) {
        this.requestUUID = uuid()
    }
}