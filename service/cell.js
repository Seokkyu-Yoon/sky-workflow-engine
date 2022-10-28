import { ModelCell } from '../model/index.js'

export const service = {
  add: async (cellInfo) => {
    const cell = ModelCell(cellInfo)
    return cell
  }
}
