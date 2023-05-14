import React from 'react'

import styles from './ModifiersTable.module.css'
import { ModifierOwnerSelect } from '../../general/ModifierOwnerSelect'

export const ModifiersTable = ({
  modifiers,
  onChange,
  setModifierOwner
}) => {
  const modifiersEntries = Object.entries(modifiers)

  return (
    modifiersEntries.length > 0 &&
    <table className={styles.modifiersTable}>
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
                  owner={deviceId}
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
  )
}
