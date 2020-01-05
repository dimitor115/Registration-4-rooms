import { verifyTokenAndFetchUserData } from 'common/authentication'
import { Context } from 'koa'
import { Admin } from './AdminModel'
import { logger } from 'config/winstonConfig'
import { Response } from 'common/Response'

export default class AdministratorsService {

    public async verifyAndCreateAdmin(ctx: Context): Promise<void> {
        const token = ctx.request.headers['authorization']
        const { name, email, picture } = await verifyTokenAndFetchUserData(token)

        const result = await Admin.findOne({ email })

        if (result && result.isAccepted === true) {
            ctx.status = 200
            return
        }

        if (result && result.isAccepted === false) {
            ctx.status = 403
            return
        }

        if (!result) {
            logger.info(`Creating new Administrator with name: ${name}`)

            const admin = new Admin({
                name,
                email,
                picture,
                isAccepted: false
            })

            const result = await admin.save()
            ctx.body = new Response(result)
            ctx.status = 201
        }
    }

    public async findAll(ctx: Context): Promise<void> {
        logger.info(`Finding all admins`)
        const result = await Admin.find({})
        ctx.body = new Response(result)
        ctx.status = 200
    }

    public async accept(ctx: Context): Promise<void> {
        const { email } = ctx.params
        logger.info(`Accepting admin with email: ${email}`)

        const result = await Admin.findOneAndUpdate({ email }, { isAccepted: true }, { new: true })
        if (result) {
            ctx.body = new Response(result)
            ctx.status = 201
        } else {
            ctx.status = 404
        }
    }

    public async remove(ctx: Context): Promise<void> {
        const { email } = ctx.params
        logger.info(`Removing admin with email: ${email}`)

        const result = await Admin.findOneAndRemove({ email })
        if (result) {
            ctx.body = new Response(result)
            ctx.status = 201
        } else {
            ctx.status = 404
        }
    }
}