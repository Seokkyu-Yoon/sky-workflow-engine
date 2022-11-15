import { Process } from './process.js'

export function Piece (spec) {
  const process = Process(spec)
  const sources = new Set()
  const targets = new Set()

  const addSource = source => sources.add(source)
  const addTarget = target => targets.add(target)
  const isRunnable = () => {
    if (process.getStatus() !== 'ready') return false
    for (const source of sources.values()) {
      if (source.process.getStatus() !== 'finished') return false
    }
    return true
  }
  function isRunning () {
    return process.getStatus() === 'running'
  }

  return {
    process,
    addSource,
    addTarget,
    isRunnable,
    isRunning,
    run: process.run
  }
}
