import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const databaseUrl =
  process.env.DATABASE_URL ?? process.env.DB_FILE_NAME ?? 'file:./shrtnr.db'

const client = createClient({ url: databaseUrl })
export const db = drizzle({ client })
