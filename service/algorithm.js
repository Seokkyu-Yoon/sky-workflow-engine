import { Algorithm } from '../model/index.js'

export function Service (database) {
  return {
    add: async (algorithmInfo) => {
      const algorithm = Algorithm(algorithmInfo)
      const dbConnection = await database.connect()
      await dbConnection.algorithm.add(algorithm)
      return algorithm
    },
    getList: async (projectId = null) => {
      const dbConnection = await database.connect()
      const algorithmInfos = await dbConnection.algorithm.getList(projectId)
      const algorithms = algorithmInfos.map(Algorithm)
      return algorithms
    },
    get: async (id = null) => {
      const dbConnection = await database.connect()
      const algorithmInfo = await dbConnection.algorithm.get(id)
      const algorithm = Algorithm(algorithmInfo)
      return algorithm
    },
    update: async ({ id = null, ...data }) => {
      const dbConnection = await database.connect()
      const algorithmInfo = await dbConnection.algorithm.get(id)
      const algorithm = Algorithm(algorithmInfo)
      for (const key of Object.keys(algorithm)) {
        if (typeof data[key] !== 'undefined') algorithm[key] = data[key]
      }
      const algorithmInfoUpdated = await dbConnection.algorithm.update(algorithm)
      const algorithmUpdated = Algorithm(algorithmInfoUpdated)
      return algorithmUpdated
    },
    delete: async (id = null) => {
      const dbConnection = await database.connect()
      const deleted = await dbConnection.algorithm.delete(id)
      return deleted
    }
  }
}
