import { Card } from '../general/Card'
import styles from './DeviceConfig.module.css'
import React from 'react'
import classNames from 'classnames'
import { ModifiersTable } from './ModifiersTable'

export const DeviceConfig = ({
  deviceConfig: { id, device, mapping },
  onChange,
  setModifierOwner,
  className,
}) =>
  <Card className={classNames(className, styles.root)}>
    <h2>{device?.toString() ?? 'Unknown Device'}</h2>
    <h3>{id}</h3>
    <table className={styles.table}>
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
          .entries(mapping)
          .map(([control, controlConfig]) => (
            <ControlConfigTableRow
              key={control}
              control={control}
              controlConfig={controlConfig}
              onChange={newControlConfig => {
                onChange({
                  id,
                  device,
                  mapping: {
                    ...mapping,
                    [control]: newControlConfig
                  }
                })
              }}
              setModifierOwner={setModifierOwner}
            />
          ))
      }
      </tbody>
    </table>
  </Card>

const ControlConfigTableRow = ({
  control,
  controlConfig: {
    command,
    category,
    modifiers
  },
  onChange,
  setModifierOwner
}) =>
  <tr key={control}>
    <td className={styles.controlColumn}
        title={control}>
      {control}
    </td>
    <td className={styles.commandColumn}
        title={command}>
      {command}
    </td>
    <td className={styles.modifiersColumn}>
      <ModifiersTable
        modifiers={modifiers}
        onChange={newModifiers => {
          onChange({ command, category, modifiers: newModifiers })
        }}
        setModifierOwner={setModifierOwner}
      />
    </td>
  </tr>

