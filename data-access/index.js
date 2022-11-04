import { LowDb } from './lowdb/index.js'

const Low = LowDb()
export async function DataAccess () {
  return {
    connect: async () => await Low()
  }
}
