export { Controller as ControllerProject } from './project.js'
export { Controller as ControllerWorkflow } from './workflow.js'

export function ControllerRender () {
  return {
    render: (req, res, next) => res.render('index.html')
  }
}

export function ControllerError () {
  return {
    error: (err, req, res, next) => {
      res.status(err.status || 500)
      res.send(err.message)
    }
  }
}
