import {DeviceAssignment} from 'domain/import/device-assignment'
import {ExternalDeviceId} from 'domain/import/types'
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
    deviceTemplatesById: Record<ExternalDeviceId, DeviceTemplate>,
    devicesMapping: Record<TemplateDeviceId, ExternalDeviceId | undefined>
}

export const HTMLExporter: FC<Props> = ({deviceAssignments = []}) => {
    const [templateFilename, setTemplateFilename] = useState<string | undefined>(undefined)
    const [state, setState] = useState<State>({
        deviceTemplatesById: {},
        devicesMapping: {}
    })

    const ref = useCallback((iframeEl: HTMLIFrameElement) => {
        iframeEl.addEventListener('load', () => {
            const doc = iframeEl.contentWindow?.document
            if (!doc) return

            const newDeviceTemplatesById: Record<ExternalDeviceId, DeviceTemplate> = {}
            doc.querySelectorAll(`[${DEVICE_ATTRIBUTE}]`).forEach(el => {
                const templateDeviceId = el.getAttribute(DEVICE_ATTRIBUTE)
                const templateControl = el.getAttribute(CONTROL_ATTRIBUTE)

                if (templateDeviceId && templateControl) {
                    let deviceTemplate = newDeviceTemplatesById[templateDeviceId]
                    if (deviceTemplate === undefined) {
                        deviceTemplate = new DeviceTemplate(templateDeviceId)
                        newDeviceTemplatesById[templateDeviceId] = deviceTemplate
                    }
                    deviceTemplate.setField(templateControl, new TemplateField(el))
                }
            })

            setState({deviceTemplatesById: newDeviceTemplatesById, devicesMapping: {}})
        })
    }, [])

    useEffect(() => {
        const deviceTemplatesList = Object.values(state.deviceTemplatesById)
        if (deviceTemplatesList.some(({id}) => state.devicesMapping[id] === undefined)) return

        const deviceAssignmentsById: Record<ExternalDeviceId, DeviceAssignment> = {}
        deviceAssignments.forEach(deviceConfig => {
            deviceAssignmentsById[deviceConfig.id] = deviceConfig
        })

        deviceTemplatesList.forEach(deviceTemplate => {
            const deviceAssignment = deviceAssignmentsById[deviceTemplate.id]
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
            Object.keys(state.deviceTemplatesById).length > 0 &&
          <table>
            <thead>
            <tr>
              <th>
                Template Device
              </th>
              <th>
                Imported Device
              </th>
            </tr>
            </thead>
            <tbody>
            {
                Object.keys(state.deviceTemplatesById).map(templateDeviceId =>
                    <tr key={templateDeviceId}>
                        <td>{templateDeviceId}</td>
                        <td>
                            <select
                                value={state.devicesMapping[templateDeviceId] === undefined
                                    ? ''
                                    : state.devicesMapping[templateDeviceId]}
                                onChange={({target: {value}}) => {
                                    setState(old => ({
                                        ...old,
                                        devicesMapping: {
                                            ...old.devicesMapping,
                                            [templateDeviceId]: value
                                        }
                                    }))
                                }}>
                                <option value={''}></option>
                                {
                                    deviceAssignments.map(deviceAssignment =>
                                        <option
                                            key={deviceAssignment.id}
                                            value={deviceAssignment.id}
                                        >
                                            {deviceAssignment.id}
                                        </option>
                                    )
                                }
                            </select>
                        </td>
                    </tr>
                )
            }
            </tbody>
          </table>
        }
        {
            templateFilename !== undefined &&
          <iframe
            ref={ref}
            className={styles.templateFilePreview}
            src={templateFiles[templateFilename]}>
          </iframe>
        }
    </div>
}