import React from 'react'
import { controlsImporter } from './import-controls'

export function DCSImporter ({ onChange }) {
  return <div>
    <input
      multiple
      type="file"
      onChange={function ({ target: { files } }) {
        controlsImporter().importControls(files).then(onChange)
      }}
    />
  </div>
}