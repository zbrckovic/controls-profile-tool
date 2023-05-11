import { readFile } from '../util/file'

export async function importControls (files) {
  return Promise.all(Array.from(files).map(processFile)).then(results => {
    const result = {}
    results.forEach(({ device, controls }) => {
      result[device] = controls
    })
    return result
  })
}

function getDeviceFromFilename(filename) {
  const lastIndexOfDot = filename.lastIndexOf('.')
  if (lastIndexOfDot === -1) return filename
  return filename.slice(0, lastIndexOfDot)
}

async function processFile (file) {
  const device = getDeviceFromFilename(file.name)
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

  return { device, controls }
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
