import React from 'react'
import styles from './ModifierDeviceCell.module.css'
import { ModifierOwnerSelect } from 'components/ModifierOwnerSelect'

export const ModifierDeviceCell = ({
  modifier,
  deviceId,
  onChange,
  setModifierOwner
}) => (
  <div className={styles.root}>
    <ModifierOwnerSelect
      className={styles.ownerSelect}
      modifier={modifier}
      owner={deviceId}
      onChange={onChange}
    />
    <button
      className={styles.setToAllButton}
      onClick={() => { setModifierOwner(modifier) }}
    >
      To all
    </button>
  </div>
)

