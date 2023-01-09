import Busboy from 'busboy'
import { Duplex } from 'node:stream'

export function FormData (req) {
  return new Promise((resolve, reject) => {
    const formBody = {}
    const bb = Busboy({ headers: req.headers })
      .on('error', err => reject(err))
      .on('close', () => resolve(formBody))
      .on('field', (name, value, info) => {
        try {
          formBody[name] = JSON.parse(value)
        } catch (err) {
          formBody[name] = value
        }
      })
      .on('file', (name, stream, info) => {
        const value = new Duplex()
        stream
          .on('error', err => reject(err))
          .on('close', () => value.push(null, 'utf-8'))
          .on('data', chunk => value.push(chunk, 'utf-8'))
        formBody[name] = {
          filename: info?.filename || '',
          stream: value
        }
      })
    req.pipe(bb)
  })
}
