import React from 'react'
import { importDeviceConfigs } from './import-device-configs'
import styles from './DCSImporter.module.css'
import classNames from 'classnames'

export const DCSImporter = ({ className, onChange }) =>
  <div className={classNames(className, styles.root)}>
    <p>
      Please upload html files with controls configuration exported from DCS.
    </p>
    <input
      multiple
      type="file"
      onChange={({ target: { files } }) => {
        importDeviceConfigs(files).then(onChange)
      }}
    />
  </div>