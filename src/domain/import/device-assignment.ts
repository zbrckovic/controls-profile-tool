import {Device} from 'domain/device'
import {ControlAssignment} from './control-assignment'
import {ImportedDeviceId} from './types'
import {Control} from '../types'

/**
 * Information about control assignments for a single device.
 */
export class DeviceAssignment {
    constructor(
        readonly ordinal: number,
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
        readonly controlAssignments: ControlAssignment[] = []
    ) {
    }

    compare(deviceAssignment: DeviceAssignment) {
        return this.ordinal - deviceAssignment.ordinal
    }

    withModifierOwnerForControlAssignment(i: number, modifier: Control, owner?: ImportedDeviceId) {
        const controlAssignment = this.controlAssignments[i]

        return new DeviceAssignment(
            this.ordinal,
            this.id,
            this.name,
            this.device,
            [
                ...this.controlAssignments.slice(0, i),
                controlAssignment.withModifierOwner(modifier, owner),
                ...this.controlAssignments.slice(i + 1)
            ]
        )
    }

    /**
     * Returns a copy of `this` which associates `modifier` with `owner` in case `modifier` exists.
     */
    withModifierOwner(modifier: Control, owner?: ImportedDeviceId) {
        return new DeviceAssignment(
            this.ordinal,
            this.id,
            this.name,
            this.device,
            this.controlAssignments.map(ca => ca.withModifierOwner(modifier, owner))
        )
    }

    doAllModifiersHaveOwners() {
        return this.controlAssignments.every(ca => ca.doAllModifiersHaveOwners())
    }

    hasControl(control: Control) {
        return this.controlAssignments.some(ca => ca.control === control)
    }

    fillInModifierOwners(deviceAssignments: DeviceAssignment[]) {
        this.controlAssignments.forEach(ca => {
            Object.keys(ca.modifiers).forEach(modifier => {
                const owner = DeviceAssignment.findTheModifierOwner(deviceAssignments, modifier)
                ca.setModifierOwner(modifier, owner)
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
