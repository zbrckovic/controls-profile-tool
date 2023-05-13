import { readFile } from '../../util/file'
import { parseFilename } from './parse-filename'

export async function importControls (files) {
  return Promise.all(Array.from(files).map(processFile))
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
