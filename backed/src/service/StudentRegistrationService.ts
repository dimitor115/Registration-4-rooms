import { Context } from 'koa'
import { logger } from '../common/logger'
import { Room, IRoom } from '../models/room.model'
import { IStudent, Student } from '../models/student.model'
import { Response, Message, MessageType } from '../common/Response'
import { ErrorCodes } from '../common/errorCodes'
import moment = require('moment')

export default class StudentRegistrationService {

    public static async addStudent(roomId: string, student: IStudent): Promise<Response<IRoom>> {
        logger.info(`Adding new student (${student.index}) to room : ${roomId}`)

        const studentModel = this.createAndValidateStudent(student)

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $push: { students: studentModel } },
            { new: true }
        )
        return new Response(result)
    }

    private static createAndValidateStudent(student: IStudent) {
        const model = new Student(student)
        const err = model.validateSync()
        if (err) throw err

        return model
    }

    public static async removeStudent(roomId: string, student: IStudent, removedBy: string): Promise<Response<IRoom>> {
        logger.info(`Removing student (${student.index}) from room :${roomId} by ${removedBy}`)
        const room: IRoom = await Room.findOne({ _id: roomId })

        if (!room.students.find(it => it.index === student.index && it.name == student.name)) {
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