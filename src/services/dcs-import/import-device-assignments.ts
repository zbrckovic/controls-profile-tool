import {devicesById} from 'domain/hardware'
import {ControlAssignment} from 'domain/import/control-assignment'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'
import {readFile} from 'services/read-file'
import {parseFilename} from './parse-filename'

export const importDeviceAssignments = async (files: File[]): Promise<DeviceAssignment[]> => {
    const deviceAssignments = await Promise.all(files.map(processFile))

    deviceAssignments.forEach(deviceAssignment =>
        deviceAssignment.fillInModifierOwners(deviceAssignments))

    return deviceAssignments
}

const processFile = async (file: File) => {
    const {name, id} = parseFilename(file.name)
    const text = await readFile(file)
    const mapping = parseFileContent(text)
    const device = id === undefined ? undefined : devicesById[id]
    return new DeviceAssignment(file.name, name, device, mapping)
}

const parseFileContent = (text: string) => {
    const doc = parseToDoc(text)
    const rows = doc.querySelectorAll('section > table > tbody > tr')

    const mapping: Record<Control, ControlAssignment> = {}

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByTagName('td'))
        if (cells.length === 0) return

        const [comboCell, commandCell] = cells

        if (comboCell.innerHTML === '') return

        const comboTxt = comboCell.innerHTML
        const commandTxt = commandCell.innerHTML

        const {control, modifiers} = parseCombo(comboTxt)

        mapping[control] = new ControlAssignment(commandTxt, modifiers)
    })

    return mapping
}

/**
 * Parses `combo` and returns the "modifiers" object for the construction of device assignment.
 *
 * Combo is a sequence of controls separated by dash. Controls at the start of the sequence are
 * modifiers and the last control in the sequence is the main control.
 */
const parseCombo = (combo: string): {
    control: Control,
    modifiers: Record<Control, ImportedDeviceId | undefined>
} => {
    const parts = combo.split(' - ')
    if (parts.length === 1) {
        const [control] = parts
        return {control, modifiers: {}}
    }
    const control = parts[parts.length - 1]
    const modifiers = Object.fromEntries(parts.slice(0, -1).map(modifier => [modifier, undefined]))

    return {control, modifiers}
}

const parseToDoc = (htmlTxt: string) => {
    const parser = new DOMParser()
    return parser.parseFromString(htmlTxt, 'text/html')
}