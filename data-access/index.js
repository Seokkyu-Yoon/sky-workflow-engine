import { LowDb } from './lowdb/index.js'

export async function DataAccess () {
  const db = await LowDb()
  return db
}
