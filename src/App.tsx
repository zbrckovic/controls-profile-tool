import {DCSImporter} from 'components/DCSImporter'
import {HTMLExporter} from 'components/HTMLExporter'
import {DeviceAssignmentsEditor} from 'components/MappingOverview'
import {DeviceAssignmentsCtx} from 'contexts'
import {DeviceAssignment} from 'domain/import/device-assignment'
import React, {FC, useMemo, useState} from 'react'
import styles from './App.module.css'

export const App: FC = () => {
    const [deviceAssignments, setDeviceAssignments] = useState<DeviceAssignment[]>([])

    const isValid = useMemo(
        () => deviceAssignments
            .every(deviceAssignment => deviceAssignment.doAllModifiersHaveOwners()),
        [deviceAssignments]
    )

    return <DeviceAssignmentsCtx.Provider value={deviceAssignments}>
        <main className={styles.root}>
            <DCSImporter className={styles.importer}
                         onImport={setDeviceAssignments}/>
            {
                deviceAssignments.length > 0 && <>
                <DeviceAssignmentsEditor
                  value={deviceAssignments}
                  onChange={setDeviceAssignments}
                  setModifierOwnerToAll={(modifier, owner) => {
                      setDeviceAssignments(old =>
                          old.map(deviceAssignment =>
                              deviceAssignment.withModifierOwner(modifier, owner)))
                  }}
                />
                <button disabled={!isValid} onClick={() => {
                    console.log('Apply')
                }}>
                  Apply
                </button>
              </>
            }
            <HTMLExporter deviceAssignments={deviceAssignments}/>
        </main>
    </DeviceAssignmentsCtx.Provider>

}
