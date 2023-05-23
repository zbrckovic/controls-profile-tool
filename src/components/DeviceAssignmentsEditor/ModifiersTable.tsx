import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {Control} from 'domain/types'
import React, {FC} from 'react'
import {ModifierOwnerSelect} from './ModifierOwnerSelect'
import styles from './ModifiersTable.module.css'
import {ImportedDeviceId} from "../../domain/import/imported-device";

interface Props {
    className?: string
    deviceAssignments: DeviceAssignment[],
    modifiers: Record<Control, ImportedDeviceId | undefined>
    onChange: (modifier: Control, owner: ImportedDeviceId | undefined) => void
    setModifierOwnerToAll: (modifier: Control, owner: ImportedDeviceId | undefined) => void
}

export const ModifiersTable: FC<Props> = ({
                                              className,
                                              deviceAssignments,
                                              modifiers,
                                              onChange,
                                              setModifierOwnerToAll
                                          }) =>
    <table className={classNames(className, styles.root)}>
        <tbody>
        {
            Object
                .entries(modifiers)
                .map(([modifier, ownerId]) => (
                    <tr key={modifier}>
                        <td className={styles.modifierCell}>
                            {modifier}
                        </td>
                        <td className={styles.modifierOwnerCell}>
                            <div>
                                <ModifierOwnerSelect
                                    className={styles.ownerSelect}
                                    deviceAssignments={deviceAssignments}
                                    modifier={modifier}
                                    value={ownerId}
                                    onChange={newOwner => {
                                        onChange(modifier, newOwner)
                                    }}
                                />
                                <button
                                    className={styles.setToAllButton}
                                    onClick={() => {
                                        setModifierOwnerToAll(modifier, ownerId)
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