export function getTypeInfo (type) {
  if (type === PYTHON) return infoPython
  return infoDummy
}

const infoDummy = Info()

const PYTHON = 'python'
const infoPython = Info(process.env.PYTHON, 'py')

function Info (runCmd = 'node', extension = 'js') {
  return {
    runCmd,
    extension
  }
}
