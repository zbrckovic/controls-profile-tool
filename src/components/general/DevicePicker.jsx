import React from 'react'

export const DevicePicker = ({ devicesById, value, onChange }) =>
  <select
    value={value === undefined ? '' : value.id}
    onChange={({ target: { value } }) => {
      if (value === '') {
        onChange(undefined)
      } else {
        onChange(devicesById[value])
      }

    }}>
    <option value={''}></option>
    {
      Object.entries(devicesById).map(([deviceId, device]) =>
        <option
          key={deviceId}
          value={deviceId}
        >
          {device.toString()}
        </option>
      )
    }
  </select>