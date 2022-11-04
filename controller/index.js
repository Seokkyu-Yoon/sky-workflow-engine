import { Factory } from './factory.js'
import { Controller as Project } from './project.js'
import { Controller as Workflow } from './workflow.js'
import { Controller as Cell } from './cell.js'

function Render (controllerFactory) {
  return () => ({
    render: (req, res, next) => {
      return controllerFactory.make((req, res) => {
        const filename = 'index.html'
        res.render(() => filename)
      })(req, res, next)
    }
  })
}

function Error (controllerFactory) {
  return () => ({
    error: (err, req, res, next) => {
      // res.status(err.status || 500)
      // res.send(err.message)
      return controllerFactory.make((req, res) => {
        res.status(err.status || 500)
        res.send(err.message)
      })(req, res, next)
    }
  })
}

const factory = Factory('express')
export const ProjectController = Project(factory)
export const WorkflowController = Workflow(factory)
export const CellController = Cell(factory)
export const RenderController = Render(factory)
export const ErrorController = Error(factory)

export function Controller (service) {
  return {
    project: ProjectController(service),
    workflow: WorkflowController(service),
    cell: CellController(service),
    render: RenderController(service),
    error: ErrorController(service)
  }
}
