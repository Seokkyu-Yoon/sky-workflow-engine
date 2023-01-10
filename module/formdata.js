import Busboy from 'busboy'
import { Duplex } from 'node:stream'

export function FormData (req) {
  return new Promise((resolve, reject) => {
    try {
      const formBody = {}
      const busboy = Busboy({ headers: req.headers })
        .on('error', err => reject(err))
        .on('close', () => {
          resolve(formBody)
        })
        .on('field', (name, value, info) => {
          try {
            formBody[name] = JSON.parse(value)
          } catch (err) {
            formBody[name] = value
          }
        })
        .on('file', (name, stream, info) => {
          const value = new Duplex({ read: () => {} })
          stream
            .on('error', err => reject(err))
            .on('close', () => value.push(null, 'utf-8'))
            .on('data', chunk => {
              console.log(chunk.toString())
              value.push(chunk, 'utf-8')
            })

          formBody[name] = {
            filename: info?.filename || '',
            stream: value
          }
        })
      req.pipe(busboy)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}
