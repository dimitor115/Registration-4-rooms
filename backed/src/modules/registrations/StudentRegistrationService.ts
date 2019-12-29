import { logger } from 'config/winstonConfig'
import { Room, IRoom } from 'core/RoomModel'
import { IStudent, Student } from './StudentModel'
import { Message, MessageType } from 'common/Response'
import { ErrorCodes } from 'common/errorCodes'

export default class StudentRegistrationService {

    public async addStudent(roomId: string, student: IStudent): Promise<IRoom> {
        logger.info(`Adding new student (${student.index}) to room : ${roomId}`)

        const studentModel = this.createAndValidateStudent(student)

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

    public async removeStudent(roomId: string, student: IStudent, removedBy: string): Promise<IRoom> {
        logger.info(`Removing student (${student.index}) from room :${roomId} by ${removedBy}`)
        const room: IRoom = await Room.findOne({ _id: roomId })

        if (!room.students.find(it => it.index === student.index && it.name == student.name)) {
            throw Message.fromErrorCode(ErrorCodes.NO_SUCH_STUDENT_IN_THIS_ROOM, MessageType.ERROR)
        }
        if (student.addedBy !== removedBy) {
            throw Message.fromErrorCode(ErrorCodes.CANNOT_REMOVE_THIS_STUDENT, MessageType.ERROR)
        }

        const result = await Room.findOneAndUpdate(
            { _id: roomId },
            { $pull: { students: { index: student.index, name: student.name } } },
            { new: true }
        )

        return result
    }
}