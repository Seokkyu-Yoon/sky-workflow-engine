export function Process (spec) {
  let status = 'ready'
  const process = sampleProcess(spec)

  function run (onData = (e) => {}) {
    if (status === 'running') {
      onData({
        status: 'errored',
        body: {
          cellId: spec.id,
          message: 'already running...'
        }
      })
      return
    }
    status = 'running'
    process.run((e) => {
      if (e.status === 'finished') {
        status = 'finished'
      }
      if (e.status === 'errored') {
        status = 'errored'
      }
      onData(e)
    })
  }

  function stop () {
    status = 'ready'
    process.stop()
  }
  return {
    getStatus: () => status,
    run,
    stop
  }
}

function sampleProcess (spec) {
  const id = spec.id
  let timeout = null
  let interval = null
  function run (onData = (e) => {}) {
    const minMs = 3000
    const maxMs = 10000

    const dMs = Math.floor(Math.random() * (maxMs - minMs)) + minMs
    timeout = setTimeout(() => {
      clearInterval(interval)
      onData({
        status: 'finished',
        body: {
          cellId: id,
          message: 'finished'
        }
      })
    }, dMs)

    let per = 0
    interval = setInterval(() => {
      if (Math.random() < 0.01) {
        onData({
          status: 'errored',
          body: {
            cellId: id,
            message: 'internal server error'
          }
        })
        clearInterval(interval)
        clearTimeout(timeout)
        return
      }
      per += 5
      onData({
        status: 'running',
        body: {
          cellId: id,
          message: `${per}%...`
        }
      })
    }, dMs / 20)
  }
  function stop () {
    clearTimeout(timeout)
    clearInterval(interval)
  }

  return {
    run,
    stop
  }
}
