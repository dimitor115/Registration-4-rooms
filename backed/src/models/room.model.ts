import { Schema, Document, model } from 'mongoose'
import { StudentSchema, IStudent } from './student.model'

export interface IRoom extends Document {
    name: string,
    size: number,
    students: IStudent[]
}

const RoomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    students: {type: [StudentSchema], default: []},
})

export const Room = model<IRoom>('Room', RoomSchema)