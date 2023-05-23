import classNames from 'classnames'
import {ModifiersTable} from 'components/DeviceAssignmentsEditor/ModifiersTable'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {Modifiers} from 'domain/modifiers'
import {Control} from 'domain/types'
import React, {FC} from 'react'
import {Card} from '../general/Card'
import styles from './DeviceAssignmentEditor.module.css'
import {ImportedDevice} from "domain/import/imported-device";

interface Props {
    deviceAssignments: DeviceAssignment[],
    modifiers: Modifiers,
    value: DeviceAssignment,
    onChange: (newValue: DeviceAssignment) => void,
    setModifierOwnerToAll: (modifier: Control, owner: ImportedDevice | undefined) => void
    className?: string,
}

export const DeviceAssignmentEditor: FC<Props> = ({
                                                      deviceAssignments,
                                                      modifiers,
                                                      value,
                                                      onChange,
                                                      setModifierOwnerToAll,
                                                      className,
                                                  }) =>
    <Card
        className={classNames(className, styles.root)}>
        <h2>{value.device?.toString() ?? 'Unknown Device'}</h2>
        <h3>{value.importedDevice.id}</h3>
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
                value.controlAssignments.map((controlAssignment, i) => (
                    <tr key={i}>
                        <td className={styles.controlColumn} title={controlAssignment.control}>
                            {controlAssignment.control}
                        </td>
                        <td className={styles.commandColumn} title={controlAssignment.command}>
                            {controlAssignment.command}
                        </td>
                        <td className={styles.modifiersColumn}>
                            <ModifiersTable
                                className={styles.modifiersTable}
                                deviceAssignments={deviceAssignments}
                                modifiers={controlAssignment.modifiers}
                                onChange={(modifier, newOwner) => {
                                    onChange(
                                        value.withModifierOwnerForControlAssignment(
                                            i,
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
            {Object
                .entries(modifiers.getForOwner(value.importedDevice))
                .map(([modifierControl, modifier]) => (
                    <tr key={modifierControl}>
                        <td className={styles.modifierColumn}>{modifierControl}</td>
                        <td>{modifier.representation}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>