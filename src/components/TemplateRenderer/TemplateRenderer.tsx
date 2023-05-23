import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {Modifiers} from 'domain/modifiers'
import {Control} from 'domain/types'
import React, {FC, useCallback, useEffect} from 'react'
import {DeviceTemplate, TemplateDeviceId} from 'services/html-export/device-template'
import {templateFiles} from 'template-files'
import styles from './TemplateRenderer.module.css'
import {ImportedDeviceId} from "../../domain/import/imported-device";

interface Props {
    className?: string,
    deviceAssignments?: DeviceAssignment[],
    modifiers: Modifiers,
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
                                                modifiers,
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
                const templateControlsTxt = el.getAttribute(CONTROL_ATTRIBUTE)


                if (templateDeviceId && templateControlsTxt) {
                    const templateControls: Control[] = templateControlsTxt.split(';')

                    let deviceTemplate = newDeviceTemplatesById[templateDeviceId]
                    if (deviceTemplate === undefined) {
                        deviceTemplate = new DeviceTemplate(templateDeviceId)
                        newDeviceTemplatesById[templateDeviceId] = deviceTemplate
                    }


                    deviceTemplate.setField(el, templateControls)
                }
            })

            onDeviceTemplatesChange(newDeviceTemplatesById)
        })
    }, [onDeviceTemplatesChange])

    useEffect(() => {
        if (deviceTemplates === undefined) return

        const deviceTemplatesList = Object.values(deviceTemplates)

        const deviceAssignmentsById: Record<ImportedDeviceId, DeviceAssignment> = {}

        if (deviceAssignments !== undefined) {
            deviceAssignments.forEach(deviceAssignment => {
                deviceAssignmentsById[deviceAssignment.importedDevice.id] = deviceAssignment
            })
        }

        deviceTemplatesList.forEach(deviceTemplate => {
            const importedDeviceId = devicesMapping?.[deviceTemplate.id]
            const deviceAssignment = importedDeviceId !== undefined
                ? deviceAssignmentsById[importedDeviceId]
                : undefined

            deviceTemplate.fill(modifiers, deviceAssignment)
        })
    }, [deviceAssignments, modifiers, deviceTemplates, devicesMapping])

    return <iframe
        ref={ref}
        className={classNames(className, styles.root)}
        src={!templateFilename ? undefined : templateFiles[templateFilename]}>
    </iframe>
}