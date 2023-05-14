import { readFile } from 'util/file'
import { parseFilename } from './parse-filename'
import { devices } from 'hardware'

export function controlsImporter () {
  return {
    async importControls (files) {
      const dcsDevices = await Promise.all(Array.from(files).map(processFile))

      dcsDevices.forEach(function ({ name, id, mapping }) {
        Object.entries(mapping).forEach(function ([control, { modifiers }]) {
          Object.keys(modifiers).forEach(function (modifier) {
            dcsDevices.find(function (dcsDevice) {
              if (dcsDevice.name === undefined) return false
              if (devices[dcsDevice.name].hasControl(control)) {
                modifiers[modifier] = dcsDevice.id
              }
            })
          })

          Object.entries(modifiers).forEach(function ([control, deviceId]) {

          })
        })
      })

      return dcsDevices
    }
  }

  async function processFile (file) {
    const { name, id } = parseFilename(file.name)

    const text = await readFile(file)
    const doc = parseToDoc(text)
    const rows = doc.querySelectorAll('section > table > tbody > tr')

    const mapping = {}

    rows.forEach(function (row) {
      const cells = row.getElementsByTagName('td')
      if (cells.length === 0) return

      const [comboCell, commandCell, categoryCell] = cells

      if (comboCell.innerHTML === '') return

      const comboTxt = comboCell.innerHTML
      const command = commandCell.innerHTML
      const category = categoryCell.innerHTML

      const { control, modifiers } = parseCombo(comboTxt)

      mapping[control] = { command, category, modifiers }
    })

    return { name, id, mapping }
  }

  function parseCombo (combo) {
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
        modifiers.map(function (modifier) { return [modifier, undefined] })
      )
    }
  }

  function parseToDoc (htmlTxt) {
    const parser = new DOMParser()
    return parser.parseFromString(htmlTxt, 'text/html')
  }
}


