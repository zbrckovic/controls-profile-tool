import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment'
import React, {FC} from 'react'
import {ModifierOwnerSelect} from './ModifierOwnerSelect'
import styles from './ModifiersTable.module.css'
import {ImportedDevice} from "../../domain/import/imported-device";
import {Control} from "../../domain/import/control-assignment";

interface Props {
    className?: string
    deviceAssignments: DeviceAssignment[],
    modifiers: Record<Control, ImportedDevice | undefined>
    onChange: (modifier: Control, owner: ImportedDevice | undefined) => void
    setModifierOwnerToAll: (modifier: Control, owner: ImportedDevice | undefined) => void
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