import React, { useMemo, useState } from 'react'
import { DCSImporter } from './components/DCSImporter'
import { MappingOverview } from './components/MappingOverview'
import { DeviceConfigsCtx } from './contexts'
import { createModifierOwnerSetter } from './util/modifier-owner-setter'
import styles from './App.module.css'

export const App = () => {
  const [deviceConfigs, setDeviceConfigs] = useState([])

  const isValid = useMemo(
    () => areAllModifierOwnersSet(deviceConfigs),
    [deviceConfigs]
  )

  return <DeviceConfigsCtx.Provider value={deviceConfigs}>
    <main className={styles.root}>
      <div className={styles.importSection}>
        <DCSImporter className={styles.importer} onChange={setDeviceConfigs}/>
        {
          deviceConfigs.length > 0 && <>
            <MappingOverview
              deviceConfigs={deviceConfigs}
              onChange={setDeviceConfigs}
              setModifierOwner={(modifier, owner) => {
                const newDeviceConfigs =
                  createModifierOwnerSetter({ modifier, owner })
                    .setModifierOwnerToDeviceConfigs(deviceConfigs)
                setDeviceConfigs(newDeviceConfigs)
              }}
            />
            <button disabled={!isValid} onClick={() => {
              console.log('Apply')
            }}>
              Apply
            </button>
          </>
        }

      </div>
      <div className={styles.exportSection}>

      </div>
    </main>
  </DeviceConfigsCtx.Provider>

}

const areAllModifierOwnersSet = deviceConfigs =>
  deviceConfigs.every(
    ({ mapping }) =>
      Object
        .values(mapping)
        .every(
          ({ modifiers }) =>
            Object.values(modifiers).every(id => id !== undefined)
        )
  )
