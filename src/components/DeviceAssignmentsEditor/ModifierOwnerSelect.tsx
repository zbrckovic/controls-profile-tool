import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'
import React, {FC} from 'react'

interface Props {
    className?: string,
    deviceAssignments: DeviceAssignment[],
    modifier: Control,
    value?: ImportedDeviceId,
    onChange: (owner?: ImportedDeviceId) => void
}

export const ModifierOwnerSelect: FC<Props> = ({
                                                   className,
                                                   deviceAssignments,
                                                   modifier,
                                                   value,
                                                   onChange
                                               }) => {
    const potentialModifierOwners = deviceAssignments.filter(deviceAssignment =>
        !deviceAssignment.hasControl(modifier) &&
        (
            deviceAssignment.device === undefined ||
            deviceAssignment.device.hasControl(modifier)))
        .map(deviceAssignment => deviceAssignment.id)

    return (
        <select
            className={className}
            value={value === undefined ? '' : value}
            onChange={({target: {value: newOwner}}) => {
                onChange(newOwner === '' ? undefined : newOwner)
            }}
        >
            <option key={null} value={''}></option>
            {
                potentialModifierOwners.map(potentialOwner => (
                    <option key={potentialOwner} value={potentialOwner}>
                        {potentialOwner}
                    </option>
                ))
            }
        </select>
    )
}