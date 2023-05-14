import React from 'react'
import { controlsImporter } from './import-controls'
import styles from './DCSImporter.module.css'

export function DCSImporter ({ onChange }) {
  return <div className={styles.root}>
    <input
      multiple
      type="file"
      onChange={function ({ target: { files } }) {
        controlsImporter().importControls(files).then(onChange)
      }}
    />
  </div>
}