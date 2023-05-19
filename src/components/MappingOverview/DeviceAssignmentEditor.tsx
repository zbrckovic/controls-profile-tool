import classNames from 'classnames'
import {ModifierOwnerSelect} from 'components/general/ModifierOwnerSelect'
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
                                <table className={styles.modifiersTable}>
                                    <tbody>
                                    {
                                        Object
                                            .entries(controlAssignment.modifiers)
                                            .map(([modifier, ownerId]) => (
                                                <tr key={modifier}>
                                                    <td className={styles.modifierCell}>
                                                        {modifier}
                                                    </td>
                                                    <td className={styles.modifierOwnerCell}>
                                                        <div>
                                                            <ModifierOwnerSelect
                                                                className={styles.ownerSelect}
                                                                modifier={modifier}
                                                                value={ownerId}
                                                                onChange={newOwner => {
                                                                    onChange(
                                                                        value.withModifierOwnerForControl(
                                                                            control,
                                                                            modifier,
                                                                            newOwner
                                                                        ))
                                                                }}
                                                            />
                                                            <button
                                                                className={styles.setToAllButton}
                                                                onClick={() => {
                                                                    setModifierOwnerToAll(
                                                                        modifier,
                                                                        ownerId)
                                                                }}>
                                                                To all
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ))
            }
            </tbody>
        </table>
    </Card>