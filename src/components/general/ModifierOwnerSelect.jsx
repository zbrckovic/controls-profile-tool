import React, { useContext } from 'react'
import { DeviceConfigsCtx } from 'contexts'

export const ModifierOwnerSelect = ({
  className,
  modifier,
  owner,
  onChange
}) => {
  const deviceConfigs = useContext(DeviceConfigsCtx)

  const potentialModifierOwners = deviceConfigs.filter(deviceConfig =>
    !Object.hasOwn(deviceConfig.mapping, modifier) &&
    (
      deviceConfig.device === undefined ||
      deviceConfig.device.hasControl(modifier))
  )

  return (
    <select
      className={className}
      value={owner}
      onChange={({ target: { value: deviceId } }) => {
        onChange(deviceId === '' ? undefined : deviceId)
      }}
    >
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