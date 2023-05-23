import {DeviceAssignment} from 'domain/import/device-assignment'
import {Control} from 'domain/types'
import React, {FC, useMemo} from 'react'
import {ImportedDevice, ImportedDeviceId} from "domain/import/imported-device";

interface Props {
    className?: string,
    deviceAssignments: DeviceAssignment[],
    modifier: Control,
    value?: ImportedDevice,
    onChange: (owner?: ImportedDevice) => void
}

export const ModifierOwnerSelect: FC<Props> = ({
                                                   className,
                                                   deviceAssignments,
                                                   modifier,
                                                   value,
                                                   onChange
                                               }) => {
    const potentialOwners = useMemo(() => {
        const result: Record<ImportedDeviceId, ImportedDevice> = {}
        deviceAssignments
            .filter(da => isDeviceAssignmentPotentialModifierOwner(da, modifier))
            .map(da => da.importedDevice)
            .forEach(device => {
                result[device.id] = device
            })
        return result
    }, [deviceAssignments, modifier])

    return (
        <select
            className={className}
            value={value === undefined ? '' : value.id}
            onChange={({target: {value: newOwnerId}}) => {
                onChange(newOwnerId === '' ? undefined : potentialOwners[newOwnerId])
            }}
        >
            <option key={null} value={''}></option>
            {
                Object.values(potentialOwners).map(potentialOwner => (
                    <option key={potentialOwner.id} value={potentialOwner.id}>
                        {potentialOwner.id}
                    </option>
                ))
            }
        </select>
    )
}

const isDeviceAssignmentPotentialModifierOwner = (deviceAssignment: DeviceAssignment, modifier: Control) =>
    !deviceAssignment.hasControl(modifier) &&
    (
        deviceAssignment.device === undefined ||
        deviceAssignment.device.hasControl(modifier))