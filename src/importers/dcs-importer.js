import { readFile } from '../util/file'
import { Device, mappingFactories } from '../hardware'

export async function importControls (files) {
  return Promise.all(Array.from(files).map(processFile))
}

function getDeviceFromName(filename) {
  if (filename.startsWith("T.16000M")) {
    return Device.Thrustmaster_T16000M
  } else {
    return Device.Unknown
  }
}

function getFilenameWithoutExtension(filename) {
  const lastIndexOfDot = filename.lastIndexOf('.')
  if (lastIndexOfDot === -1) return filename
  return filename.slice(0, lastIndexOfDot)
}

async function processFile (file) {
  const filename = getFilenameWithoutExtension(file.name)
  const device = getDeviceFromName(filename)
  const text = await readFile(file)
  const doc = parseToDoc(text)
  const rows = doc.querySelectorAll('section > table > tbody > tr')

  const controls = {}

  rows.forEach(row => {
    const cells = row.getElementsByTagName('td')
    if (cells.length === 0) return

    const [comboCell, commandCell, categoryCell] = cells

    if (comboCell.innerHTML === '') return

    const comboTxt = comboCell.innerHTML
    const command = commandCell.innerHTML
    const category = categoryCell.innerHTML

    const { control, modifiers } = parseCombo(comboTxt)
    controls[control] = { command, category, modifiers }
  })

  return { device, mapping: mappingFactories[device](controls) }
}

const parseCombo = combo => {
  const elements = combo.split(' - ')
  if (elements.length === 1) {
    const [control] = elements
    return { control, modifiers: [] }
  }
  const control = elements[elements.length - 1]
  const modifiers = elements.slice(0, -1)
  return { control, modifiers }
}

function parseToDoc (htmlTxt) {
  const parser = new DOMParser()
  return parser.parseFromString(htmlTxt, 'text/html')
}
