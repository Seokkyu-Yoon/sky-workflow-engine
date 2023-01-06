import { Factory } from './factory.js'

import { Controller as Project } from './project.js'
import { Controller as Workflow } from './workflow.js'
import { Controller as Algorithm } from './algorithm.js'
import { Controller as Engine } from './engine.js'

import { Controller as Error } from './error.js'
import { Controller as Render } from './render.js'

export function Controller (service, type = 'express') {
  const factory = Factory(type)
  const project = Project(factory, service)
  const workflow = Workflow(factory, service)
  const algorithm = Algorithm(factory, service)
  const engine = Engine(factory, service.engine)
  const render = Render(factory, service)
  const error = Error(factory, service)

  return {
    project,
    workflow,
    algorithm,
    engine,
    render,
    error
  }
}
