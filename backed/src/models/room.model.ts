import mongoose, { Schema, Document } from 'mongoose'

export interface IRoom extends Document {
    name: string,
    size: number,
    freeSpace: number
}

const RoomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    freeSpace: { type: Number, required: true },
})

export const Room = mongoose.model<IRoom>('Room', RoomSchema)