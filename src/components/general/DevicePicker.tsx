import React, {FC} from 'react'
import {Device} from "../../model/device";

interface Props {
    devicesById: Record<string, Device>,
    value: Device,
    onChange: (device?: Device) => void
}

export const DevicePicker: FC<Props> = ({devicesById, value, onChange}) =>
    <select
        value={value === undefined ? '' : value.id}
        onChange={({target: {value}}) => {
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