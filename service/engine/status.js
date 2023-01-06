export const READY = 0
export const RUNNING = 1
export const FINISHED = 2
export const STOPPED = 3
export const ERROR = 4

export function getName (code) {
  switch (code) {
    case READY: return 'ready'
    case RUNNING: return 'running'
    case FINISHED: return 'finished'
    case STOPPED: return 'stopped'
    case ERROR: return 'error'
    default: return 'unknown'
  }
}
