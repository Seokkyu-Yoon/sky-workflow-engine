import { spawn } from 'node:child_process'

export function ChildProcess (spec) {
  let childProcess = null
  return {
    run: () => new Promise((resolve, reject) => {
      let err = null
      try {
        childProcess = spawn('python', [])
        childProcess.stderr.on('data', data => {
          err = new Error(data.toString())
        })
        childProcess.stdout.on('data', data => {
          console.log(data.toString())
        })
        childProcess.on('exit', code => {
          code === 0 ? resolve() : reject(err)
        })
        childProcess.stdin.write(spec)
        childProcess.stdin.end()
      } catch (err) {
        reject(err)
      }
    }),
    stop: () => {
      if (childProcess && !childProcess.killed) childProcess.kill()
    }
  }
}
ChildProcess.Dummy = function (spec) {
  let childProcess = null
  return {
    run: () => new Promise((resolve, reject) => {
      const ms = spec.ms
      childProcess = setTimeout(() => {
        if (Math.random() < 0.2) {
          reject(new Error('random value lose than 0.2'))
          return
        }
        resolve()
      }, ms)
    }),
    stop: () => clearTimeout(childProcess)
  }
}
