import { LowDb } from './lowdb/index.js'

const Low = LowDb()
export async function Database () {
  return {
    connect: async () => await Low()
  }
}