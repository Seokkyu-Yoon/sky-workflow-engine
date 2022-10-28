import { JSONFile, Low } from 'lowdb'

import { config } from './config.js'
import { Project } from './project.js'
import { Workflow } from './workflow.js'
import { Cell } from './cell.js'

let lowDb = null
export async function LowDb () {
  if (lowDb !== null) return lowDb
  const adapter = new JSONFile(config.path)
  const db = new Low(adapter)
  await db.read()
  db.data = db.data || {}

  lowDb = {
    projects: Project(db),
    workflows: Workflow(db),
    cells: Cell(db)
  }
  return lowDb
}
