import {DCSImporter} from 'components/DCSImporter'
import {DeviceAssignmentsEditor} from 'components/DeviceAssignmentsEditor'
import {ExportConfigurator} from 'components/ExportConfigurator'
import {TemplateFilePicker} from 'components/TemplateFilePicker'
import {TemplateRenderer} from 'components/TemplateRenderer'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import {Modifiers} from 'domain/modifiers'
import React, {FC, useCallback, useMemo, useState} from 'react'
import {DeviceTemplate, TemplateDeviceId} from 'services/html-export/device-template'
import {templateFiles} from 'template-files'
import styles from './App.module.css'
import {Control} from "./domain/types";

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

    const modifiers: Modifiers = useMemo(() => {
        const result: Modifiers = new Modifiers()
        deviceAssignments?.forEach(deviceAssignment => {
            deviceAssignment.controlAssignments.forEach(controlAssignment => {
                Object.entries(controlAssignment.modifiers).forEach(([modifier, owner]) => {
                    result.setModifierOwner(modifier, owner)
                })
            })
        })
        return result
    }, [deviceAssignments])

    const handleTemplateFileChange = useCallback((newTemplateFilename: string | undefined) => {
        setState(old => ({...old, templateFilename: newTemplateFilename}))
    }, [])

    const handleDevicesMappingChange = useCallback((newDevicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined>) => {
        setState(old => ({...old, devicesMapping: newDevicesMapping}))
    }, [])

    const handleDeviceTemplatesChange = useCallback((newDeviceTemplates: Record<string, DeviceTemplate>) => {
        setState(old => {
            return ({
                ...old,
                deviceTemplates: newDeviceTemplates,
                devicesMapping: Object.fromEntries(
                    Object
                                .keys(newDeviceTemplates)
                                .map(id => {
                                    console.log(old.deviceAssignments)
                                    console.log(id)

                                    return [
                                        id,
                                        old.deviceAssignments?.find(({device}) => device?.id === id)?.id
                                    ]
                                })
                                )
            })
        })
    }, [])

    const handleSetModifierOwnerToAll = useCallback((modifier: Control, owner?: ImportedDeviceId) => {
        setState(old => ({
            ...old,
            deviceAssignments: old.deviceAssignments?.map(deviceAssignment =>
                deviceAssignment.withModifierOwner(modifier, owner))
        }))
    }, []);

    const handleDeviceAssignmentsChange = useCallback((newDeviceAssignments: DeviceAssignment[]) => {
        setState(old => ({...old, deviceAssignments: newDeviceAssignments}))
    }, []);

    return <main className={styles.root}>
        <h1>Import</h1>
        <DCSImporter
            className={styles.importer}
            onImport={deviceAssignments => setState({
                deviceAssignments,
                templateFilename: Object.keys(templateFiles)[0]
            })}/>
        {
            deviceAssignments !== undefined && (
                <DeviceAssignmentsEditor
                    className={styles.deviceAssignmentsEditor}
                    deviceAssignments={deviceAssignments}
                    modifiers={modifiers}
                    value={deviceAssignments}
                    onChange={handleDeviceAssignmentsChange}
                    setModifierOwnerToAll={handleSetModifierOwnerToAll}
                />
            )
        }
        <h1>Export</h1>
        <p>Pick a template</p>
        <TemplateFilePicker
            className={styles.templateFilePicker}
            templateFiles={Object.keys(templateFiles)}
            value={templateFilename}
            onChange={handleTemplateFileChange}/>
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
              onDevicesMappingChange={handleDevicesMappingChange}/>

          </>
        }
        <TemplateRenderer
            className={styles.templateRenderer}
            deviceAssignments={deviceAssignments}
            modifiers={modifiers}
            templateFilename={templateFilename}
            deviceTemplates={deviceTemplates}
            devicesMapping={devicesMapping}
            onDeviceTemplatesChange={handleDeviceTemplatesChange}/>
    </main>
}
