import React from 'react'
import { controlsImporter } from './import-controls'
import styles from './DCSImporter.module.css'

export const DCSImporter = ({ onChange }) =>
  <div className={styles.root}>
    <input
      multiple
      type="file"
      onChange={({ target: { files } }) => {
        controlsImporter().importControls(files).then(onChange)
      }}
    />
  </div>