import { Factory } from './factory.js'

import { Controller as Project } from './project.js'
import { Controller as Workflow } from './workflow.js'
import { Controller as Algorithm } from './algorithm.js'
import { Controller as Engine } from './engine.js'
import { Controller as File } from './file.js'

import { Controller as Error } from './error.js'
import { Controller as Render } from './render.js'

export function Controller (service, type = 'express') {
  const factory = Factory(type)
  const project = Project(factory, service.project)
  const workflow = Workflow(factory, service.workflow)
  const algorithm = Algorithm(factory, service.algorithm)
  const engine = Engine(factory, service.engine)
  const file = File(factory, service.file)
  const render = Render(factory)
  const error = Error(factory)

  return {
    project,
    workflow,
    algorithm,
    engine,
    file,
    render,
    error
  }
}
