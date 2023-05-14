import React from 'react'
import { devices as internalDevices } from 'hardware'
import styles from './MappingsOverview.module.css'

export const MappingsOverview = ({
  devices = [],
  onChange,
  setModifierOwner
}) =>
  <div className={styles.root}>
    {
      devices.map(({ id, name, mapping }, i) =>
        <Device
          devices={devices}
          key={id}
          id={id}
          name={name}
          mapping={mapping}
          onChange={newDevice => {
            const newDevices = [
              ...devices.slice(0, i),
              newDevice,
              ...devices.slice(i + 1)
            ]
            onChange(newDevices)
          }}
          setModifierOwner={setModifierOwner}
        />
      )
    }
  </div>

export const Device = ({
  devices,
  name,
  id,
  mapping = {},
  onChange,
  setModifierOwner
}) => {
  return <div className={styles.device}>
    <dl>
      <dt>Name</dt>
      <dd>{name ?? 'unrecognized'}</dd>

      <dt>Id</dt>
      <dd>{id}</dd>
    </dl>

    <div className={styles.mapping}>
      {
        Object
          .entries(mapping)
          .map(([control, { command, category, modifiers }]) => (
            <div
              key={control}>
              <label>{control}</label>
              <label>{command}</label>
              <label>{category}</label>
              <Modifiers
                devices={devices}
                modifiers={modifiers}
                onChange={newModifiers => {
                  const newMapping = {
                    ...mapping,
                    [control]: {
                      command,
                      category,
                      modifiers: newModifiers
                    }
                  }

                  const newDevice = { name, id, mapping: newMapping }

                  onChange(newDevice)
                }}
                setModifierOwner={setModifierOwner}
              />
            </div>
          ))
      }
    </div>

  </div>
}

const Modifiers = ({ devices, modifiers, onChange, setModifierOwner }) => {
  const modifiersEntries = Object.entries(modifiers)

  return (
    modifiersEntries.length > 0 && <div>
      <label>modifiers</label>
      {
        modifiersEntries.map(([modifier, deviceId], i) => (
          <Modifier
            key={modifier}
            devices={devices}
            modifier={modifier}
            deviceId={deviceId}
            onChange={newDeviceId => {
              const newModifierEntries = [
                ...modifiersEntries.slice(0, i),
                [modifier, newDeviceId],
                ...modifiersEntries.slice(i + 1),
              ]
              const newModifiers = Object.fromEntries(newModifierEntries)
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
  devices, modifier, deviceId, onChange, setModifierOwner
}) => {
  return (
    <div key={modifier}>
      <label>{modifier}</label>
      <div>
        <ModifierOwnerSelect
          modifier={modifier}
          devices={devices}
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

const ModifierOwnerSelect = ({ modifier, devices, value, onChange }) => {
  const potentialModifierOwners = devices
    .filter(device => {
      if (device.name === undefined) return true
      return internalDevices[device.name].hasControl(modifier)
    })

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