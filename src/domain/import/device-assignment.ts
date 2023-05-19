import {Device} from 'domain/device'
import {ControlAssignment} from './control-assignment'
import {ImportedDeviceId} from './types'
import {Control} from '../types'

/**
 * Information about control assignments for a single device.
 */
export class DeviceAssignment {
    constructor(
        /**
         * The external id of this device assigned by the importer.
         */
        readonly id: ImportedDeviceId,
        /**
         * The name of the device assigned by the importer.
         */
        readonly name: string,
        /**
         * A known device to which this device corresponds.
         *
         * Existence of this value means that this external device has been recognized as one of the
         * known devices.
         */
        public device?: Device,
        /**
         * An object which associates controls to their assignments.
         */
        readonly mapping: Record<Control, ControlAssignment> = {}
    ) {
    }

    withModifierOwnerForControl(control: Control, modifier: Control, owner?: ImportedDeviceId) {
        const controlAssignment = this.mapping[control]

        return new DeviceAssignment(
            this.id,
            this.name,
            this.device,
            {
                ...this.mapping,
                [control]: controlAssignment.withModifierOwner(modifier, owner)
            }
        )
    }

    /**
     * Returns a copy of `this` which associates `modifier` with `owner` in case `modifier` exists.
     */
    withModifierOwner(modifier: Control, owner?: ImportedDeviceId) {
        return new DeviceAssignment(
            this.id,
            this.name,
            this.device,
            Object.fromEntries(
                Object
                    .entries(this.mapping)
                    .map(([control, controlConfig]) => [
                        control,
                        controlConfig.withModifierOwner(modifier, owner)
                    ])
            )
        )
    }

    doAllModifiersHaveOwners() {
        return Object
            .values(this.mapping)
            .every(controlConfig => controlConfig.doAllModifiersHaveOwners())
    }

    hasControl(control: Control) {
        return this.mapping.hasOwnProperty(control)
    }

    fillInModifierOwners(deviceAssignments: DeviceAssignment[]) {
        Object.values(this.mapping).forEach(controlConfig => {
            Object.keys(controlConfig.modifiers).forEach(modifier => {
                const owner = DeviceAssignment.findTheModifierOwner(deviceAssignments, modifier)
                controlConfig.setModifierOwner(modifier, owner)
            })
        })
    }

    /**
     * Tries to find the device which could be the owner of `modifier`.
     *
     * It picks the first device whose assignment doesn't have a mapping for `modifier`, and it
     * has a recognized device with `modifier` among its controls.
     */
    private static findTheModifierOwner(
        deviceAssignments: DeviceAssignment[],
        modifier: Control
    ): ImportedDeviceId | undefined {
        const deviceAssignment = deviceAssignments.find(deviceAssignment =>
            !(deviceAssignment.hasControl(modifier)) &&
            deviceAssignment.device?.hasControl(modifier))

        return deviceAssignment?.id
    }
}
