import {DevicesMappingTable} from 'components/HTMLExporter/DevicesMappingTable'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import React, {FC, useCallback, useEffect, useState} from 'react'
import {DeviceTemplate, TemplateDeviceId, TemplateField} from 'services/html-export/device-template'
import {templateFiles} from 'templates'

import styles from './HTMLExporter.module.css'
import {TemplateFilePicker} from './TemplatePicker'

const DEVICE_ATTRIBUTE = 'data-device'
const CONTROL_ATTRIBUTE = 'data-ctrl'

interface Props {
    deviceAssignments: DeviceAssignment[]
}

interface State {
    deviceTemplatesById: Record<TemplateDeviceId, DeviceTemplate>,
    devicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined>
}

export const HTMLExporter: FC<Props> = ({deviceAssignments = []}) => {
    const [templateFilename, setTemplateFilename] = useState<string | undefined>(() => {
        return Object.keys(templateFiles)[0]
    })
    const [state, setState] = useState<State>({deviceTemplatesById: {}, devicesMapping: {}})

    const ref = useCallback((iframeEl: HTMLIFrameElement | null) => {
        iframeEl?.addEventListener('load', () => {
            const doc = iframeEl.contentWindow?.document
            if (!doc) return

            const newDeviceTemplatesById: Record<ImportedDeviceId, DeviceTemplate> = {}
            doc.querySelectorAll(`[${DEVICE_ATTRIBUTE}]`).forEach(el => {
                const templateDeviceId = el.getAttribute(DEVICE_ATTRIBUTE)
                const templateControl = el.getAttribute(CONTROL_ATTRIBUTE)

                if (templateDeviceId && templateControl) {
                    let deviceTemplate = newDeviceTemplatesById[templateDeviceId]
                    if (deviceTemplate === undefined) {
                        deviceTemplate = new DeviceTemplate(templateDeviceId)
                        newDeviceTemplatesById[templateDeviceId] = deviceTemplate
                    }
                    deviceTemplate.setField(templateControl, el)
                }
            })

            const devicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined> =
                Object.fromEntries(Object.keys(newDeviceTemplatesById).map(id => [id, undefined]))

            setState({deviceTemplatesById: newDeviceTemplatesById, devicesMapping})
        })
    }, [])

    useEffect(() => {
        const deviceTemplatesList = Object.values(state.deviceTemplatesById)
        if (deviceTemplatesList.some(({id}) => state.devicesMapping[id] === undefined)) return

        const deviceAssignmentsById: Record<ImportedDeviceId, DeviceAssignment> = {}
        deviceAssignments.forEach(deviceAssignment => {
            deviceAssignmentsById[deviceAssignment.id] = deviceAssignment
        })

        deviceTemplatesList.forEach(deviceTemplate => {
            // FIXME: When you change imported device assignments this becomes undefined
            const importedDeviceId = state.devicesMapping[deviceTemplate.id]!
            const deviceAssignment = deviceAssignmentsById[importedDeviceId]
            deviceTemplate.fill(deviceAssignment)
        })
    }, [deviceAssignments, state])

    return <div className={styles.root}>
        <TemplateFilePicker
            className={styles.templateFileSelect}
            templateFiles={Object.keys(templateFiles)}
            value={templateFilename}
            onChange={setTemplateFilename}/>
        {
            Object.keys(state.deviceTemplatesById).length > 0 && (
                <DevicesMappingTable
                    className={styles.deviceMappingTable}
                    devicesMapping={state.devicesMapping}
                    onChange={(newDevicesMapping) => {
                        setState(old => ({...old, devicesMapping: newDevicesMapping}))
                    }}
                    deviceAssignments={deviceAssignments}
                />
            )
        }
        <iframe
            ref={ref}
            className={styles.templateFilePreview}
            src={!templateFilename ? undefined : templateFiles[templateFilename]}>
        </iframe>
    </div>
}