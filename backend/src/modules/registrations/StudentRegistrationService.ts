import { logger } from 'config/winstonConfig'
import { Room, IRoom } from 'core/RoomModel'
import { IStudent, Student } from './StudentModel'
import { Message, MessageType, Response } from 'common/Response'
import { ErrorCodes } from 'common/errorCodes'
import { Context } from 'koa'
import { SocketSender } from 'core/socketSender'

export default class StudentRegistrationService {
    constructor(
        private readonly socketSender: SocketSender
    ) { }

    public async updateByAdmin(ctx: Context): Promise<void> {
        const student = (ctx.request as any).body
        const roomId = ctx.params.id
        const studentId = ctx.params.studentId
        logger.info(`Updating student by admin`)

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $set: { 'students.$[element]': student } },
            { arrayFilters: [{ 'element._id': { $eq: studentId } }], new: true } as any
        )
        
        if (result) {
            this.socketSender.sendRoomUpdate(result)
            ctx.body = new Response(result)
            ctx.status = 200
        } else {
            ctx.status = 404
        }
    }

    public async removeByAdmin(ctx: Context): Promise<void> {
        const studentId = ctx.params.studentId
        const roomId = ctx.params.id
        logger.info(`Removing student by admin`)

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $pull: { students: { _id: studentId } } },
            { new: true }
        )

        if (result) {
            this.socketSender.sendRoomUpdate(result)
            ctx.body = new Response(result)
            ctx.status = 200
        } else {
            ctx.status = 404
        }
    }

    public async addStudentByAdmin(ctx: Context): Promise<void> {
        const student = (ctx.request as any).body
        const roomId = ctx.params.id
        logger.info(`Adding student by admin`)

        const result = await this.addStudent(roomId, { ...student, addedBy: 'admin' })
        this.socketSender.sendRoomUpdate(result)
        ctx.body = new Response(result)
        ctx.status = 201
    }

    public async addStudent(roomId: string, student: IStudent): Promise<IRoom> {
        logger.info(`Adding new student (${student.surname}) to room : ${roomId}`)

        const studentModel = this.createAndValidateStudent(student)

        const room = await Room.findOne({_id: roomId})
        if(room?.students.length >= room?.size) {
            throw ErrorCodes.NO_FREE_SPACE_IN_ROOM
        }
        if(!!room?.students.find((s:IStudent) => s.name === student.name && s.surname === student.surname)) {
            throw ErrorCodes.DUPLICATED_STUDENT_IN_THIS_ROOM
        }

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $push: { students: studentModel } },
            { new: true }
        )
        return result
    }

    private createAndValidateStudent(student: IStudent): IStudent {
        const model = new Student(student)
        const err = model.validateSync()
        if (err) throw err

        return model
    }

    public async removeStudent(
        roomId: string,
        student: IStudent,
        removedBy: string
    ): Promise<IRoom> {
        logger.info(`Removing student (${student.surname}) from room :${roomId} by ${removedBy}`)
        const room: IRoom = await Room.findOne({ _id: roomId })

        if (!room.students.find(it => it.surname === student.surname && it.name == student.name)) {
            throw ErrorCodes.NO_SUCH_STUDENT_IN_THIS_ROOM
        }
        if (student.addedBy !== removedBy) {
            throw ErrorCodes.CANNOT_REMOVE_THIS_STUDENT
        }

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $pull: { students: { surname: student.surname, name: student.name } } },
            { new: true }
        )

        return result
    }
}