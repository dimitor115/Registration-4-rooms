import { OAuth2Client } from 'google-auth-library'
import { config } from 'config/envConfig'
import { Context } from 'koa'
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket'
import { ErrorCodes } from './errorCodes'
import { Admin } from 'modules/administrators/AdminModel'

const client = new OAuth2Client(config.googleClientId)

export async function verifyTokenAndFetchUserData(token: string): Promise<TokenPayload> {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.googleClientId
        })
        return ticket.getPayload()
    } catch {
        throw { statusCode: 401, message: ErrorCodes.TOKEN_VERIFICATION_ERROR }
    }
}

export async function authMiddleware(ctx: Context, next: () => Promise<any>): Promise<void> {
    const token = ctx.request.headers['authorization']
    const user = await verifyTokenAndFetchUserData(token)
    ctx.user = user
    const result = await Admin.findOne({ email: user.email })

    if (result && result.isAccepted === true) {
        return next()
    }

    throw { statusCode: 401, message: ErrorCodes.NO_ACCESS }
}
