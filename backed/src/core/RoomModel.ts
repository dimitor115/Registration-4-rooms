import { Schema, Document, model } from 'mongoose'
import { IStudent, StudentSchema } from '../modules/registrations/StudentModel'

export interface IRoom extends Document {
    name: string,
    size: number,
    students: IStudent[],
    reservedBy: string | null,
    reservedUntil: Date | null
}

const RoomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    size: { type: Number, required: true },
    students: {type: [StudentSchema], default: []},
    reservedBy: {type: String, default: null},
    reservedUntil: {type: Date, default: null}
})

export const Room = model<IRoom>('Room', RoomSchema)