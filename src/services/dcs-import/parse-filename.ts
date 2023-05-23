import {DeviceId} from 'domain/hardware'
import {ImportedDeviceId} from "../../domain/import/imported-device";

/**
 * Parses the name of the html file exported from DCS and returns an object containing external name
 * of the device and internal id of the device in case the device is known to this application.
 */
export const parseFilename = (filename: string): { name: string, id?: DeviceId } => {
    filename = getFilenameWithoutExtension(filename)
    const name = extractDeviceName(filename)
    const id = determineDeviceId(name)
    return {name, id}
}

/**
 * Returns the part of the filename without ".html" extension.
 */
const getFilenameWithoutExtension = (filename: string): string => {
    const lastIndexOfDot = filename.lastIndexOf('.')
    if (lastIndexOfDot === -1) return filename
    return filename.slice(0, lastIndexOfDot)
}

/**
 * Extracts the name of the device from the filename.
 *
 * Some filenames contain a device model name followed by an id enclosed in curly braces. In such
 * cases it removes this latter part and returns only the device model name.
 */
const extractDeviceName = (filename: string): string => {
    const match = filename.match(deviceNameWithIdRegex)
    return match === null ? filename : match[0]
}

/**
 * Tries to determine the internal id of the device in case the device is known to the application.
 * If the device is unknown, it returns `undefined`.
 */
const determineDeviceId = (externalDeviceName: string): DeviceId | undefined => {
    if (externalDeviceName.startsWith('T.16000M')) {
        return DeviceId.Thrustmaster_T16000M
    } else if (externalDeviceName.startsWith('TWCS')) {
        return DeviceId.Thrustmaster_TWCS
    }
}

/**
 * For filenames which have a device model name followed by an id inside curly braces.
 */
const deviceNameWithIdRegex = /^(.*) \{([^{]+)}$/
