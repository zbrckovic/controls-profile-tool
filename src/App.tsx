import {DCSImporter} from 'components/DCSImporter'
import {DeviceAssignmentsEditor} from 'components/DeviceAssignmentsEditor'
import {ExportConfigurator} from 'components/ExportConfigurator'
import {TemplateFilePicker} from 'components/TemplateFilePicker'
import {TemplateRenderer} from 'components/TemplateRenderer'
import {UNOWNED} from 'domain/import/control-assignment'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'
import React, {FC, useMemo, useState} from 'react'
import {DeviceTemplate, TemplateDeviceId} from 'services/html-export/device-template'
import {templateFiles} from 'template-files'
import styles from './App.module.css'

interface State {
    deviceAssignments?: DeviceAssignment[]
    templateFilename?: string
    deviceTemplates?: Record<ImportedDeviceId, DeviceTemplate>
    devicesMapping?: Record<TemplateDeviceId, ImportedDeviceId | undefined>
}

export const App: FC = () => {
    const [{
        deviceAssignments,
        templateFilename,
        deviceTemplates,
        devicesMapping
    }, setState] = useState<State>({})

    const isValid = useMemo(
        () =>
            deviceAssignments !== undefined &&
            deviceAssignments.every(deviceAssignment => deviceAssignment.doAllModifiersHaveOwners()),
        [deviceAssignments]
    )

    const modifiers = useMemo(() => {
        const result: Record<ImportedDeviceId | typeof UNOWNED, Set<Control>> = {
            [UNOWNED]: new Set()
        }

        deviceAssignments?.forEach(da => {
            da.controlAssignments.forEach(ca => {
                Object.entries(ca.modifiers).forEach(([modifier, owner]) => {
                    let modifiersForOwner = result[owner ?? UNOWNED]
                    if (modifiersForOwner === undefined) {
                        modifiersForOwner = new Set()
                        result[owner ?? UNOWNED] = modifiersForOwner
                    }
                    modifiersForOwner.add(modifier)
                })
            })
        })

        return result
    }, [deviceAssignments])

    return <main className={styles.root}>
        <h1>Import</h1>
        <DCSImporter
            className={styles.importer}
            onImport={deviceAssignments => setState({deviceAssignments})}/>
        {
            deviceAssignments !== undefined && (
                <DeviceAssignmentsEditor
                    className={styles.deviceAssignmentsEditor}
                    deviceAssignments={deviceAssignments}
                    value={deviceAssignments}
                    onChange={newDeviceAssignments => {
                        setState(old => ({...old, deviceAssignments: newDeviceAssignments}))
                    }}
                    setModifierOwnerToAll={(modifier, owner) => {
                        setState(old => ({
                            ...old,
                            deviceAssignments: deviceAssignments.map(deviceAssignment =>
                                deviceAssignment.withModifierOwner(modifier, owner))
                        }))
                    }}
                />
            )
        }
        <h1>Export</h1>
        <p>Pick a template</p>
        <TemplateFilePicker
            className={styles.templateFilePicker}
            templateFiles={Object.keys(templateFiles)}
            value={templateFilename}
            onChange={newTemplateFilename => {
                setState(old => ({...old, templateFilename: newTemplateFilename}))
            }}/>
        {
            deviceAssignments !== undefined &&
            isValid &&
            devicesMapping !== undefined &&
            deviceTemplates !== undefined && <>
            <p>Map template devices to imported devices</p>
            <ExportConfigurator
              className={styles.exportConfigurator}
              deviceAssignments={deviceAssignments}
              deviceTemplatesById={deviceTemplates}
              devicesMapping={devicesMapping}
              onDevicesMappingChange={newDevicesMapping => {
                  setState(old => ({...old, devicesMapping: newDevicesMapping}))
              }}/>

          </>
        }
        <TemplateRenderer
            className={styles.templateRenderer}
            deviceAssignments={deviceAssignments}
            templateFilename={templateFilename}
            deviceTemplates={deviceTemplates}
            devicesMapping={devicesMapping}
            onDeviceTemplatesChange={newDeviceTemplates => {
                const newDevicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined> =
                    Object.fromEntries(
                        Object.keys(newDeviceTemplates).map(id => [id, undefined])
                    )

                setState(old => ({
                    ...old,
                    deviceTemplates: newDeviceTemplates,
                    devicesMapping: newDevicesMapping
                }))
            }}/>
    </main>
}
