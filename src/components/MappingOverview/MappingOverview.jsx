import React, { useContext } from 'react'
import styles from './MappingOverview.module.css'
import { DeviceConfigsCtx } from '../../contexts'

export const MappingOverview = ({
  deviceConfigs = [],
  onChange,
  setModifierOwner
}) =>
  <div className={styles.root}>
    {
      deviceConfigs.map((deviceConfig, i) =>
        <DeviceConfig
          key={deviceConfig.id}
          deviceConfig={deviceConfig}
          onChange={newDeviceConfig => {
            onChange([
              ...deviceConfigs.slice(0, i),
              newDeviceConfig,
              ...deviceConfigs.slice(i + 1)
            ])
          }}
          setModifierOwner={setModifierOwner}
        />
      )
    }
  </div>

export const DeviceConfig = ({
  deviceConfig: { id, device, mapping },
  onChange,
  setModifierOwner,
}) => {
  return <div className={styles.device}>
    <h2>{device?.toString() ?? 'Unknown Device'}</h2>
    <h3>{id}</h3>
    <div className={styles.mapping}>
      {
        Object
          .entries(mapping)
          .map(([control, controlConfig]) => (
            <ControlConfig
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
    </div>
  </div>
}

const ControlConfig = ({
  control,
  controlConfig: {
    command,
    category,
    modifiers
  },
  onChange,
  setModifierOwner
}) => {
  return (
    <div
      key={control}>
      <label>{control}</label>
      <label>{command}</label>
      <label>{category}</label>
      <Modifiers
        modifiers={modifiers}
        onChange={newModifiers => {
          onChange({ command, category, modifiers: newModifiers })
        }}
        setModifierOwner={setModifierOwner}
      />
    </div>
  )
}

const Modifiers = ({
  modifiers,
  onChange,
  setModifierOwner
}) => {
  const modifiersEntries = Object.entries(modifiers)

  return (
    modifiersEntries.length > 0 && <div>
      <label>modifiers</label>
      {
        modifiersEntries.map(([modifier, deviceId], i) => (
          <Modifier
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
    </div>
  )
}

const Modifier = ({
  modifier,
  deviceId,
  onChange,
  setModifierOwner
}) => {
  return (
    <div key={modifier}>
      <label>{modifier}</label>
      <div>
        <ModifierOwnerSelect
          modifier={modifier}
          value={deviceId}
          onChange={({ target: { value: deviceId } }) => { onChange(deviceId) }}
        />
        <button onClick={() => { setModifierOwner(modifier) }}>
          To all
        </button>
      </div>
    </div>
  )
}

const ModifierOwnerSelect = ({ modifier, value, onChange }) => {
  const deviceConfigs = useContext(DeviceConfigsCtx)

  const potentialModifierOwners = deviceConfigs.filter(deviceConfig =>
    !Object.hasOwn(deviceConfig.mapping, modifier) &&
    (
      deviceConfig.device === undefined ||
      deviceConfig.device.hasControl(modifier))
  )

  return (
    <select value={value} onChange={onChange}>
      <option key={null} value={undefined}></option>
      {
        potentialModifierOwners.map(({ id }) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))
      }
    </select>
  )
}