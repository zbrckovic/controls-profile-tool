import { Card } from '../Card'
import styles from './DeviceConfig.module.css'
import { ModifierDeviceCell } from './ModifierDeviceCell'
import React from 'react'
import classNames from 'classnames'

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
    <td>{control}</td>
    <td>{command}</td>
    <td>
      <ModifiersTable
        modifiers={modifiers}
        onChange={newModifiers => {
          onChange({ command, category, modifiers: newModifiers })
        }}
        setModifierOwner={setModifierOwner}
      />
    </td>
  </tr>

const ModifiersTable = ({
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
          <ModifierRow
            key={modifier}
            modifier={modifier}
            deviceId={deviceId}
            onChange={newDeviceId => {
              const newModifiers = Object.fromEntries([
                ...modifiersEntries.slice(0, i),
                [modifier, newDeviceId],
                ...modifiersEntries.slice(i + 1),
              ])
              onChange(newModifiers)
            }}
            setModifierOwner={() => {
              setModifierOwner(modifier, deviceId)
            }}
          />
        ))
      }
      </tbody>
    </table>
  )
}

const ModifierRow = ({
  modifier,
  deviceId,
  onChange,
  setModifierOwner
}) => {
  return (
    <tr key={modifier}>
      <td>{modifier}</td>
      <td>
        <ModifierDeviceCell
          modifier={modifier}
          deviceId={deviceId}
          onChange={onChange}
          setModifierOwner={setModifierOwner}
        />
      </td>
    </tr>
  )
}
