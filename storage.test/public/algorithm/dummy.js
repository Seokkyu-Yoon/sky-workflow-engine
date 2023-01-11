import readline from 'readline'
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const lines = []
reader.on('line', line => {
  lines.push(line)
  if (line === '}' || line === '') {
    reader.close()
  }
})
reader.on('close', () => {
  const spec = JSON.parse(lines.join('\n'))
  main(spec)
})

function main (spec) {
  const ms = spec.ms
  setTimeout(() => {
    if (Math.random() < 0.2) {
      throw new Error('random value lose than 0.2')
    }
  }, ms)
}
