import busboy from 'busboy'

function FormData (req, res) {
  const bb = busboy({ headers: req.headers })
  const body = {}
  return (callback) => new Promise((resolve, reject) => {
    bb.on('error')
    bb.on('file', (key, value, info) => {
      body[key] = { type: 'file', value, info }
    })
    bb.on('field', (key, value, info) => {
      body[key] = { type: 'field', value, info }
    })
    bb.on('close', () => {

    })
    bb.on('finish')
  })
}

export function Controller (make, service) {
  return {
    add: make(async (req, res) => {
      const bb = busboy({ headers: req.headers })
      bb.on('file', (name, file, info) => {
        console.log(' * file')
        console.log(name, file, info)
        file.on('data', d => {

          // console.log(d.toString())
        }).on('close', () => {
          // console.log('file done')
        })
      })
      bb.on('field', (name, value, info) => {
        console.log(' * field')
        try {
          console.log(name, JSON.parse(value), info)
        } catch (e) {
          console.log(name, value, info)
        }
      })
      bb.on('finish', () => {
        console.log('finish')
      })
      bb.on('close', () => {
        res.send(true)
      })
      req.pipe(bb)
      // const { id, name, description } = req.body
      // const result = await service.project.add({ id, name, description })
      // res.send(result)
    })
    // getList: make(async (req, res) => {
    //   const result = await service.project.getList()
    //   res.send(result)
    // }),
    // get: make(async (req, res) => {
    //   const { id } = req.params
    //   const result = await service.project.get(id)
    //   res.send(result)
    // }),
    // update: make(async (req, res) => {
    //   const { id } = req.params
    //   const { name, description } = req.body
    //   const result = await service.project.update({ id, name, description })
    //   res.send(result)
    // }),
    // delete: make(async (req, res) => {
    //   const { id } = req.params
    //   const result = await service.project.delete(id)
    //   res.send(result)
    // })
  }
}
