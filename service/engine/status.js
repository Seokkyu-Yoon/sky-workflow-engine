function Status (name) {
  return Symbol(name)
}

export const READY = Status('ready')
export const RUNNING = Status('running')
export const FINISHED = Status('finished')
export const STOPPED = Status('stopped')
export const ERROR = Status('error')
