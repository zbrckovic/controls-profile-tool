import React, {FC, useContext} from 'react'
import {DeviceAssignmentsCtx} from 'contexts'
import {Control} from "domain/types";
import {ExternalDeviceId} from "domain/import/types";

interface Props {
    className?: string,
    modifier: Control,
    value?: ExternalDeviceId,
    onChange: (owner?: ExternalDeviceId) => void
}

export const ModifierOwnerSelect: FC<Props> = ({
                                                   className,
                                                   modifier,
                                                   value,
                                                   onChange
                                               }) => {
    const deviceAssignments = useContext(DeviceAssignmentsCtx)

    const potentialModifierOwners = deviceAssignments
        .filter(deviceAssignment =>
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