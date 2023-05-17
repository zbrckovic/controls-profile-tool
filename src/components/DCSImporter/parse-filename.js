import { DeviceId } from 'hardware'

/**
 * Parses the name of the html file exported from DCS and returns an object
 * containing the internal name of the device (in case the device is known to
 * this application) and an id which is a unique string identifying this device.
 */
export const parseFilename = filename => {
  filename = getFilenameWithoutExtension(filename)
  const name = extractName(filename)
  return {
    name: determineInternalName(name),
    // The whole filename is a good id since it will surely be unique.
    id: filename,
  }
}

/**
 * Returns the part of the filename without the `.html` extension.
 */
const getFilenameWithoutExtension = filename => {
  const lastIndexOfDot = filename.lastIndexOf('.')
  if (lastIndexOfDot === -1) return filename
  return filename.slice(0, lastIndexOfDot)
}

/**
 * Extracts the name of the device from the filename.
 *
 * Some filenames contain a device model name followed by an id enclosed in
 * curly braces. In such cases it removes this latter part and returns only the
 * device model name.
 */
const extractName = filename => {
  const match = filename.match(deviceNameWithIdRegex)
  return match === null ? filename : match[0]
}

/**
 * Tries to determine the internal name of the device represented by `filename`
 * in case the device is known to the application. If the device is unknown, it
 * returns `undefined`.
 */
const determineInternalName = filename => {
  if (filename.startsWith('T.16000M')) {
    return DeviceId.Thrustmaster_T16000M
  }
}

/**
 * For filenames which have a device model name followed by an id inside curly
 * braces.
 */
const deviceNameWithIdRegex = /^(.*) \{([^{]+)}$/
