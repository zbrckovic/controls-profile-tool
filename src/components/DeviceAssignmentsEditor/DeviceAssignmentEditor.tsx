import classNames from 'classnames'
import {ModifiersTable} from 'components/DeviceAssignmentsEditor/ModifiersTable'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'
import React, {FC} from 'react'
import {Card} from '../general/Card'
import styles from './DeviceAssignmentEditor.module.css'

interface Props {
    value: DeviceAssignment,
    onChange: (newValue: DeviceAssignment) => void,
    setModifierOwnerToAll: (modifier: Control, owner: ImportedDeviceId | undefined) => void
    className?: string,
}

export const DeviceAssignmentEditor: FC<Props> = ({
                                                      value,
                                                      onChange,
                                                      setModifierOwnerToAll,
                                                      className,
                                                  }) =>
    <Card className={classNames(className, styles.root)}>
        <h2>{value.device?.toString() ?? 'Unknown Device'}</h2>
        <h3>{value.id}</h3>
        <table className={styles.controlAssignmentsTable}>
            <thead>
            <tr>
                <th className={styles.controlColumn}>Control</th>
                <th className={styles.commandColumn}>Command</th>
                <th className={styles.modifiersColumn}>Modifiers</th>
            </tr>
            </thead>
            <tbody>
            {
                Object
                    .entries(value.mapping)
                    .map(([control, controlAssignment]) => (
                        <tr key={control}>
                            <td className={styles.controlColumn} title={control}>
                                {control}
                            </td>
                            <td className={styles.commandColumn} title={controlAssignment.command}>
                                {controlAssignment.command}
                            </td>
                            <td className={styles.modifiersColumn}>
                                <ModifiersTable
                                    className={styles.modifiersTable}
                                    modifiers={controlAssignment.modifiers}
                                    onChange={(modifier, newOwner) => {
                                        onChange(
                                            value.withModifierOwnerForControl(
                                                control,
                                                modifier,
                                                newOwner
                                            ))
                                    }}
                                    setModifierOwnerToAll={setModifierOwnerToAll}
                                />
                            </td>
                        </tr>
                    ))
            }
            </tbody>
        </table>
    </Card>