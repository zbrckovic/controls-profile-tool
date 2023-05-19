import React, {FC} from 'react'

import styles from './ModifiersTable.module.css'
import {ModifierOwnerSelect} from 'components/general/ModifierOwnerSelect'
import {Control} from "domain/types";
import {ExternalDeviceId} from "domain/import/types";

interface Props {
    modifiers: Record<Control, ExternalDeviceId | undefined>,
    onChange: (value: Record<Control, ExternalDeviceId | undefined>) => void,
    setModifierOwner: (modifier: Control, owner: ExternalDeviceId | undefined) => void
}

export const ModifiersTable: FC<Props> = ({
                                              modifiers,
                                              onChange,
                                              setModifierOwner
                                          }) => {
    const modifiersEntries = Object.entries(modifiers)
    if (modifiersEntries.length === 0) return null

    return <table className={styles.modifiersTable}>
        <tbody>
        {
            modifiersEntries.map(([modifier, deviceId], i) => (
                <tr key={modifier}>
                    <td className={styles.modifierCell}>{modifier}</td>
                    <td className={styles.modifierOwnerCell}>
                        <div>
                            <ModifierOwnerSelect
                                className={styles.ownerSelect}
                                modifier={modifier}
                                value={deviceId}
                                onChange={newDeviceId => {
                                    const newModifiers = Object.fromEntries([
                                        ...modifiersEntries.slice(0, i),
                                        [modifier, newDeviceId],
                                        ...modifiersEntries.slice(i + 1),
                                    ])
                                    onChange(newModifiers)
                                }}
                            />
                            <button
                                className={styles.setToAllButton}
                                onClick={() => {
                                    setModifierOwner(modifier, deviceId)
                                }}
                            >
                                To all
                            </button>
                        </div>
                    </td>
                </tr>
            ))
        }
        </tbody>
    </table>
}
