import { Algorithm } from '../model/index.js'

/**
 * @param {{connect: () => Promise<Cursor>}} dataAccess
 */
export function Service (dataAccess) {
  return {
    add: async (algorithmInfo) => {
      const algorithm = Algorithm(algorithmInfo)
      const cursor = await dataAccess.connect()
      await cursor.algorithm.add(algorithm)
      return algorithm
    },
    getList: async (projectId = null) => {
      const cursor = await dataAccess.connect()
      const algorithmInfos = await cursor.algorithm.getList(projectId)
      const algorithms = algorithmInfos.map(Algorithm)
      return algorithms
    },
    get: async (id = null) => {
      const cursor = await dataAccess.connect()
      const algorithmInfo = await cursor.algorithm.get(id)
      const algorithm = Algorithm(algorithmInfo)
      return algorithm
    },
    update: async ({ id = null, ...data }) => {
      const cursor = await dataAccess.connect()
      const algorithmInfo = await cursor.algorithm.get(id)
      const algorithm = Algorithm(algorithmInfo)
      for (const key of Object.keys(algorithm)) {
        if (typeof data[key] !== 'undefined') algorithm[key] = data[key]
      }
      const algorithmInfoUpdated = await cursor.algorithm.update(algorithm)
      const algorithmUpdated = Algorithm(algorithmInfoUpdated)
      return algorithmUpdated
    },
    delete: async (id = null) => {
      const cursor = await dataAccess.connect()
      const deleted = await cursor.algorithm.delete(id)
      return deleted
    }
  }
}
