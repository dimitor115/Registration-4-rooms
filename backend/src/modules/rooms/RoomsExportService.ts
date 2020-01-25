import exceljs from 'exceljs'
import { Context } from 'koa'
import { Room, IRoom } from 'core/RoomModel'

export default class RoomExportService {

    public async exportAndHost(ctx: Context): Promise<void> {

        const rooms = await Room.find({})

        const workbook = new exceljs.Workbook()
        const worksheet = workbook.addWorksheet('Stoliki')

        worksheet.columns = [{ width: 5 }, { width: 20 }, { width: 20 }]
        rooms.forEach((room: IRoom) => {
            const row = worksheet.addRow(['', 'Stolik:', room.name])
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA9A9A9' },
                bgColor: { argb: 'FFA9A9A9' }
            }

            for (let i = 0; i < room.size; i++) {
                const student = room.students[i]
                if (student) {
                    worksheet.addRow([i + 1, student.name, student.index])
                } else {
                    worksheet.addRow([i + 1])
                }
            }

            worksheet.addRow([])
        })

        ctx.response.attachment('stoliki.xlsx')
        ctx.status = 200
        await workbook.xlsx.write(ctx.res)
        ctx.res.end()
    }

}