import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export interface IConfig {
    port: number
    debugLogging: boolean
    dbsslconn: boolean
    jwtSecret: string
    databaseUrl: string
    googleClientId: string
}

const config: IConfig = {
    port: +process.env.PORT || 3000,
    debugLogging: process.env.NODE_ENV == 'development',
    dbsslconn: process.env.NODE_ENV != 'development',
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID
}

export { config }