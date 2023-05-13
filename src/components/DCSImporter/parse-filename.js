import { DeviceName } from '../../devices'

export function parseFilename (filename) {
  filename = getFilenameWithoutExtension(filename)
  const name = extractName(filename)
  return { name: getStandardName(name), id: filename, }
}

function getFilenameWithoutExtension (filename) {
  const lastIndexOfDot = filename.lastIndexOf('.')
  if (lastIndexOfDot === -1) return filename
  return filename.slice(0, lastIndexOfDot)
}

function extractName(filename) {
  const match = filename.match(deviceNameWithIdRegex)
  return match === null ? filename : match[0]
}

function getStandardName (filename) {
  console.log(filename)

  if (filename.startsWith('T.16000M')) {
    return DeviceName.Thrustmaster_T16000M
  }
}

// For filenames which have device model name followed by an id inside curly braces
const deviceNameWithIdRegex = /^(.*) \{([^{]+)}$/
