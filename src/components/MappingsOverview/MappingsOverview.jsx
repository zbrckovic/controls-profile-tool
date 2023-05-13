import React from 'react'
import { deviceControls } from '../../devices'

export function MappingsOverview ({ devices = [], onChange, setModifierOwner }) {
  return <div>
    {devices.map(function ({ id, name, mapping }, i) {
      return <Device
        devices={devices}
        key={id}
        id={id}
        name={name}
        mapping={mapping}
        onChange={function (newDevice) {
          const newDevices = [
            ...devices.slice(0, i),
            newDevice,
            ...devices.slice(i + 1)
          ]
          onChange(newDevices)
        }}
        setModifierOwner={setModifierOwner}
      />
    })}
  </div>
}

export function Device ({ devices, name, id, mapping = {}, onChange, setModifierOwner }) {
  return <div style={{ border: '1px solid red', width: '500px', display: 'flex', flexDirection: 'column' }}>
    <dl>
      <dt>Name</dt>
      <dd>{name ?? 'unrecognized'}</dd>

      <dt>Id</dt>
      <dd>{id}</dd>
    </dl>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {
        Object.entries(mapping).map(function ([control, { command, category, modifiers }]) {
          return <div key={control}>
            <label>{control}</label>
            <label>{command}</label>
            <label>{category}</label>
            <Modifiers
              devices={devices}
              modifiers={modifiers}
              onChange={function (newModifiers) {
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
        })
      }
    </div>

  </div>
}

function Modifiers ({ devices, modifiers, onChange, setModifierOwner }) {
  const modifiersEntries = Object.entries(modifiers)

  return (
    modifiersEntries.length > 0 && <div>
      <label>modifiers</label>
      {
        modifiersEntries.map(function ([modifier, deviceId], i) {
          return <Modifier
            key={modifier}
            devices={devices}
            modifier={modifier}
            deviceId={deviceId}
            onChange={function (newDeviceId) {
              const newModifierEntries = [
                ...modifiersEntries.slice(0, i),
                [modifier, newDeviceId],
                ...modifiersEntries.slice(i + 1),
              ]
              const newModifiers = Object.fromEntries(newModifierEntries)
              onChange(newModifiers)
            }}
            setModifierOwner={function() {
              setModifierOwner(modifier, deviceId)
            }}
          />
        })
      }
    </div>
  )
}

function Modifier ({ devices, modifier, deviceId, onChange, setModifierOwner }) {
  return (
    <div key={modifier}>
      <label>{modifier}</label>
      <div>
        <ModifierOwnerSelect
          modifier={modifier}
          devices={devices}
          value={deviceId}
          onChange={function ({ target: { value: deviceId } }) {
            onChange(deviceId)
          }}
        />
        <button
          onClick={function () { setModifierOwner(modifier) }}
        >
          To all
        </button>
      </div>
    </div>
  )
}

function ModifierOwnerSelect ({ modifier, devices, value, onChange }) {
  const potentialModifierOwners = devices
    .filter(function (device) {
      if (device.name === undefined) return true
      return deviceControls[device.name].includes(modifier)
    })

  return (
    <select value={value} onChange={onChange}>
      <option key={null} value={undefined}></option>
      {
        potentialModifierOwners.map(function ({ id }) {
          return <option key={id} value={id}>{id}</option>
        })
      }
    </select>
  )
}