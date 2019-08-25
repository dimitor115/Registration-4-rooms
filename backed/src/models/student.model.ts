import { Schema, Document, model } from 'mongoose'

export interface IStudent extends Document {
    name: string,
    index: string,
    addedBy: string
}

export const StudentSchema = new Schema({
    name: { type: String, required: true },
    index: { type: Number, required: true },
    addedBy: { type: String, required: true }
})

export const Student = model<IStudent>('Student', StudentSchema)
