import { LowDb } from './lowdb/index.js'

const lowDb = await LowDb()
export async function DataAccess () {
  return lowDb
}
