import { readFile } from 'util/file'
import { parseFilename } from './parse-filename'
import { devicesById } from 'hardware'
import { DeviceConfig } from 'model/device-config'
import { ControlConfig } from '../../model/control-config'

export const importDeviceConfigs = async (files: File[]) => {
  const deviceConfigs = await Promise.all(Array.from(files).map(processFile))
  fillInDeviceIdsForModifiers(deviceConfigs)
  return deviceConfigs
}

const fillInDeviceIdsForModifiers = (deviceConfigs: DeviceConfig[]) => {
  deviceConfigs.forEach(({ mapping }) => {
    Object.values(mapping).forEach(({ modifiers }) => {
      Object.keys(modifiers).forEach(modifier => {
        const modifierOwner = findTheModifierOwner(deviceConfigs, modifier)
        modifiers[modifier] = modifierOwner?.id
      })
    })
  })
}

/**
 * Tries to find the device config whose device could be the owner of the
 * modifier.
 *
 * It picks the first device config which doesn't have a mapping for the
 * modifier, and it has a recognized device which has the modifier among
 * controls.
 */
const findTheModifierOwner = (deviceConfigs: DeviceConfig[], modifier: string) =>
  deviceConfigs.find(deviceConfig => {
    return !(deviceConfig.mapping.hasOwnProperty(modifier)) &&
      deviceConfig.device?.hasControl(modifier)
  })

const processFile = async (file: File) => {
  const { name, id } = parseFilename(file.name)
  const text = await readFile(file)
  const mapping = parseFileContent(text)
  const device = name === undefined ? undefined : devicesById[name]
  return new DeviceConfig(id, device, mapping)
}

const parseFileContent = (text: string) => {
  const doc = parseToDoc(text)
  const rows = doc.querySelectorAll('section > table > tbody > tr')

  const mapping = {}

  rows.forEach(row => {
    const cells = row.getElementsByTagName('td')
    if (cells.length === 0) return

    const [comboCell, commandCell, categoryCell] = cells

    if (comboCell.innerHTML === '') return

    const comboTxt = comboCell.innerHTML
    const command = commandCell.innerHTML
    const category = categoryCell.innerHTML

    const { control, modifiers } = parseCombo(comboTxt)

    mapping[control] = new ControlConfig(command, category, modifiers)
  })

  return mapping
}

/**
 * Parses `combo` and returns the main control and a map of modifier controls
 * where each modifier control is associated to `undefined`. Later, each
 * modifier control should be associated to some device id.
 *
 * Combo is a sequence of controls separated by dash. Controls at the start of
 * the sequence are modifiers and the last control in the sequence is the main
 * control.
 */
const parseCombo = combo => {
  const elements = combo.split(' - ')
  if (elements.length === 1) {
    const [control] = elements
    return { control, modifiers: {} }
  }
  const control = elements[elements.length - 1]
  const modifiers = elements.slice(0, -1)

  return {
    control,
    modifiers: Object.fromEntries(
      modifiers.map(modifier => [modifier, undefined])
    )
  }
}

const parseToDoc = htmlTxt => {
  const parser = new DOMParser()
  return parser.parseFromString(htmlTxt, 'text/html')
}