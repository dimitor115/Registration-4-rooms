import { Schema, Document } from 'mongoose'

export interface IStudent extends Document {
    name: string,
    index: string
}

export const StudentSchema = new Schema({
    name: { type: String, required: true },
    index: { type: Number, required: true, unique: true },
})
