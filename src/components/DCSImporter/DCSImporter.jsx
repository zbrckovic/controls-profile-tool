import React from 'react'
import { importDeviceConfigs } from './import-device-configs'
import styles from './DCSImporter.module.css'

export const DCSImporter = ({ onChange }) =>
  <div className={styles.root}>
    <input
      multiple
      type="file"
      onChange={({ target: { files } }) => {
        importDeviceConfigs(files).then(onChange)
      }}
    />
  </div>