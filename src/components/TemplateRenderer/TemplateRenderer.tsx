import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import React, {FC, useCallback, useEffect} from 'react'
import {DeviceTemplate, TemplateDeviceId} from 'services/html-export/device-template'
import {templateFiles} from 'templates'
import styles from './TemplateRenderer.module.css'

interface Props {
    className?: string,
    deviceAssignments?: DeviceAssignment[],
    templateFilename?: string,
    deviceTemplates?: Record<ImportedDeviceId, DeviceTemplate>
    devicesMapping?: Record<TemplateDeviceId, ImportedDeviceId | undefined>
    onDeviceTemplatesChange: (deviceTemplates: Record<ImportedDeviceId, DeviceTemplate>) => void
}

const DEVICE_ATTRIBUTE = 'data-device'
const CONTROL_ATTRIBUTE = 'data-ctrl'

export const TemplateRenderer: FC<Props> = ({
                                                className,
                                                deviceAssignments,
                                                templateFilename,
                                                deviceTemplates,
                                                devicesMapping,
                                                onDeviceTemplatesChange
                                            }) => {
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

            onDeviceTemplatesChange(newDeviceTemplatesById)
        })
    }, [])

    useEffect(() => {
        if (deviceAssignments === undefined) return
        if (deviceTemplates === undefined) return
        if (devicesMapping === undefined) return

        const deviceTemplatesList = Object.values(deviceTemplates)
        if (deviceTemplatesList.some(({id}) => devicesMapping[id] === undefined)) return

        const deviceAssignmentsById: Record<ImportedDeviceId, DeviceAssignment> = {}
        deviceAssignments.forEach(deviceAssignment => {
            deviceAssignmentsById[deviceAssignment.id] = deviceAssignment
        })

        deviceTemplatesList.forEach(deviceTemplate => {
            const importedDeviceId = devicesMapping[deviceTemplate.id]!
            const deviceAssignment = deviceAssignmentsById[importedDeviceId]
            deviceTemplate.fill(deviceAssignment)
        })
    }, [deviceAssignments, deviceTemplates, devicesMapping])

    return <iframe
        ref={ref}
        className={classNames(className, styles.root)}
        src={!templateFilename ? undefined : templateFiles[templateFilename]}>
    </iframe>
}