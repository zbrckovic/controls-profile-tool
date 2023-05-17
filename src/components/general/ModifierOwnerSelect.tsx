import React, {FC, useContext} from 'react'
import { DeviceConfigsCtx } from 'contexts'

interface Props {
  className?: string,
  modifier: string,
  owner: string,
  onChange: (owner?: string) => void
}

export const ModifierOwnerSelect: FC<Props> = ({
  className,
  modifier,
  owner,
  onChange
}) => {
  const deviceConfigs = useContext(DeviceConfigsCtx)

  const potentialModifierOwners = deviceConfigs.filter(deviceConfig =>
    !(deviceConfig.mapping.hasOwnProperty(modifier)) &&
    (
      deviceConfig.device === undefined ||
      deviceConfig.device.hasControl(modifier))
  )

  return (
    <select
      className={className}
      value={owner === undefined ? '' : owner}
      onChange={({ target: { value: deviceId } }) => {
        onChange(deviceId === '' ? undefined : deviceId)
      }}
    >
      <option key={null} value={''}></option>
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