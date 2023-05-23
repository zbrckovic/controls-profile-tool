import classNames from 'classnames'
import {DevicesMappingTable} from 'components/ExportConfigurator/DevicesMappingTable'
import {DeviceAssignment} from 'domain/import/device-assignment'
import React, {FC} from 'react'
import {DeviceTemplate, TemplateDeviceId} from 'services/html-export/device-template'

import styles from './ExportConfigurator.module.css'
import {ImportedDeviceId} from "../../domain/import/imported-device";

interface Props {
    className?: string,
    deviceAssignments: DeviceAssignment[]
    deviceTemplatesById: Record<TemplateDeviceId, DeviceTemplate>
    devicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined>
    onDevicesMappingChange:
        (devicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined>) => void
}

export const ExportConfigurator: FC<Props> = ({
                                                  className,
                                                  deviceAssignments,
                                                  deviceTemplatesById,
                                                  devicesMapping,
                                                  onDevicesMappingChange
                                              }) => {

    return <div className={classNames(className, styles.root)}>
        {
            Object.keys(deviceTemplatesById).length > 0 && (
                <DevicesMappingTable
                    className={styles.deviceMappingTable}
                    devicesMapping={devicesMapping}
                    onChange={(newDevicesMapping) => onDevicesMappingChange(newDevicesMapping)}
                    deviceAssignments={deviceAssignments}
                />
            )
        }
    </div>
}