import React from 'react'
import styles from './MappingOverview.module.css'
import { DeviceConfig } from './DeviceConfig'

export const MappingOverview = ({
  deviceConfigs = [],
  onChange,
  setModifierOwner
}) =>
  <div className={styles.root}>
    {
      deviceConfigs.map((deviceConfig, i) =>
        <DeviceConfig
          className={styles.deviceConfig}
          key={deviceConfig.id}
          deviceConfig={deviceConfig}
          onChange={newDeviceConfig => {
            onChange([
              ...deviceConfigs.slice(0, i),
              newDeviceConfig,
              ...deviceConfigs.slice(i + 1)
            ])
          }}
          setModifierOwner={setModifierOwner}
        />
      )
    }
  </div>


