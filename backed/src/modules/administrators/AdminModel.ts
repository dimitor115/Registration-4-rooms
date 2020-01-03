import { Schema, Document, model } from 'mongoose'

export interface IAdmin extends Document {
    name: string,
    email: string,
    isAccepted: boolean
}

export const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    isAccepted: { type: Boolean, required: true }
})

export const Admin = model<IAdmin>('Admin', AdminSchema)