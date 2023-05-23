import {devicesById} from 'domain/hardware'
import {Control, ControlAssignment} from 'domain/import/control-assignment'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {readFile} from 'services/read-file'
import {parseFilename} from './parse-filename'
import {ImportedDevice} from "../../domain/import/imported-device";

export const importDeviceAssignments = async (files: File[]): Promise<DeviceAssignment[]> => {
    const deviceAssignments = await Promise.all(files.map(processFile))

    deviceAssignments.forEach(deviceAssignment =>
        deviceAssignment.fillInModifierOwners(deviceAssignments))

    return deviceAssignments
}

const processFile = async (file: File, i: number) => {
    const {name, id} = parseFilename(file.name)
    const text = await readFile(file)
    const importedDeviceId = file.name // filename is unique and can serve as an imported device id
    const importedDevice = new ImportedDevice(importedDeviceId, i, name)
    const device = id === undefined ? undefined : devicesById[id]
    const controlAssignments = parseFileContent(text)
    return new DeviceAssignment(importedDevice, device, controlAssignments)
}

const parseFileContent = (text: string) => {
    const doc = parseToDoc(text)
    const rows = doc.querySelectorAll('section > table > tbody > tr')

    const controlAssignments: ControlAssignment[] = []

    rows.forEach(row => {
        const cells = Array.from(row.getElementsByTagName('td'))
        if (cells.length === 0) return

        const [comboCell, commandCell] = cells

        if (comboCell.innerHTML === '') return

        const comboTxt = comboCell.innerHTML
        const commandTxt = commandCell.innerHTML

        const {control, modifiers} = parseCombo(comboTxt)

        controlAssignments.push(new ControlAssignment(control, commandTxt, modifiers))
    })

    return controlAssignments
}

/**
 * Parses `combo` and returns the "modifiers" object for the construction of device assignment.
 *
 * Combo is a sequence of controls separated by dash. Controls at the start of the sequence are
 * modifiers and the last control in the sequence is the main control.
 */
const parseCombo = (combo: string): {
    control: Control,
    modifiers: Record<Control, ImportedDevice | undefined>
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