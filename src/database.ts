import dotenv from 'dotenv'
import { ClientConfig, Pool } from 'pg'
import config from './config'
dotenv.config()

const client: ClientConfig = {
  host: config.host,
  port: parseInt(config.dbPort as string, 10),
  database: config.database,
  user: config.user,
  password: config.password
}

if (process.env.ENV === 'test') {
  config.database = process.env.POSTGRES_DATABASE_TEST
}

export default new Pool(client)
