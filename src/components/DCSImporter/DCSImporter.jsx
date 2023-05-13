import React from 'react'
import { importControls } from './import-controls'

export function DCSImporter ({ onChange }) {
  return <div>
    <input
      multiple
      type="file"
      onChange={function ({ target: { files } }) {
        importControls(files).then(onChange)
      }}
    />
  </div>
}