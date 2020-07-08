import { IRoom } from '@/models/IRoom'

export interface CreateRoomRequest {
  name: string | null
  size: number
}

export class CreateRoomRequest {
  name: string | null
  size: number

  constructor(name: string | null = null, size = 0) {
    this.name = name
    this.size = size
  }

  static fromRoom(room: IRoom) {
    return new CreateRoomRequest(room.name, room.size)
  }
}
