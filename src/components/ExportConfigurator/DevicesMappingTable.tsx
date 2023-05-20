import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import React, {FC} from 'react'
import {TemplateDeviceId} from 'services/html-export/device-template'
import styles from './DevicesMappingTable.module.css'

interface Props {
    className?: string,
    devicesMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined>
    onChange: (deviceMapping: Record<TemplateDeviceId, ImportedDeviceId | undefined>) => void
    deviceAssignments: DeviceAssignment[]
}

export const DevicesMappingTable: FC<Props> = ({
                                                   className,
                                                   deviceAssignments,
                                                   devicesMapping,
                                                   onChange
                                               }) => (
    <table className={classNames(className, styles.root)}>
        <thead>
        <tr>
            <th className={styles.templateDeviceCell}>Template Device</th>
            <th className={styles.importerDeviceCell}>Imported Device</th>
        </tr>
        </thead>
        <tbody>
        {
            Object.keys(devicesMapping).map(templateDeviceId =>
                <tr key={templateDeviceId}>
                    <td className={styles.templateDeviceCell}>{templateDeviceId}</td>
                    <td className={styles.importerDeviceCell}>
                        <select
                            className={styles.devicePicker}
                            value={devicesMapping[templateDeviceId] === undefined
                                ? ''
                                : devicesMapping[templateDeviceId]}
                            onChange={({target: {value}}) => {
                                onChange({
                                    ...devicesMapping,
                                    [templateDeviceId]: value === '' ? undefined : value
                                })
                            }}>
                            <option value={''}></option>
                            {
                                deviceAssignments.map(({id}) =>
                                    <option key={id} value={id}>{id}</option>
                                )
                            }
                        </select>
                    </td>
                </tr>
            )
        }
        </tbody>
    </table>
)