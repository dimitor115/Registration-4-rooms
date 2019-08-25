import { Context } from 'koa'
import { logger } from '../common/logger'
import { Room, IRoom } from '../models/room.model'
import { IStudent } from '../models/student.model'
import { Response, Message, MessageType } from '../common/Response'
import { ErrorCodes } from '../common/errorCodes'

export default class StudentsRoomService {

    public static async findAll(): Promise<Response<IRoom[]>> {
        logger.info(`Finding all rooms`)
        return new Response(await Room.find())
    }

    public static async addStudent(roomId: string, student: IStudent): Promise<Response<IRoom>> {
        logger.info(`Adding new student (${student.index}) to room : ${roomId}`)
        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $push: { students: student } },
            { new: true }
        )
        return new Response(result)
    }

    public static async removeStudent(roomId: string, student: IStudent, removedBy: string): Promise<Response<IRoom>> {
        logger.info(`Removeing student (${student.index}) from room :${roomId} by ${removedBy}`)
        const room: IRoom = await Room.findOne({ _id: roomId })

        if (!room.students.includes(student)) {
            return Response.fromErrorCode(ErrorCodes.NO_SUCH_STUDENT_IN_THIS_ROOM, MessageType.ERROR)
        }
        if (student.addedBy !== removedBy) {
            return Response.fromErrorCode(ErrorCodes.CANNOT_REMOVE_THIS_STUDENT, MessageType.ERROR)
        }

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $pull: { students: { index: student.index, name: student.name } } },
            { new: true }
        )

        return new Response(result)
    }
}