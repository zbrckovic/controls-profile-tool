import React from 'react'
import styles from './ControlField.module.css'

export const ControlField = ({ control, modifier }) => {
  if (control === undefined) return

  return <div className={styles.root}>
    {control}
  </div>
}