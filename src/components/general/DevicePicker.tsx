import {Device} from 'domain/device'
import {DeviceId} from 'domain/hardware'
import React, {FC} from 'react'

interface Props {
    devicesById: Record<DeviceId, Device>,
    value: Device,
    onChange: (device?: Device) => void
}

export const DevicePicker: FC<Props> = ({devicesById, value, onChange}) =>
    <select
        value={value === undefined ? '' : value.id}
        onChange={({target: {value: newDeviceId}}) => {
            if (newDeviceId === '') {
                onChange(undefined)
            } else {
                onChange(devicesById[newDeviceId as DeviceId])
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