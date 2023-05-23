import {Control} from 'domain/types'
import {ImportedDevice, ImportedDeviceId} from "./import/imported-device";

export class Modifiers {
    private static representations = ['*', '+', '$']
    private representationIndex = 0

    private readonly unowned = new Set<Control>
    private readonly owned: Record<ImportedDeviceId, Record<Control, Modifier>> = {}

    setModifierOwner(control: Control, owner?: ImportedDevice) {
        if (owner === undefined) {
            this.unowned.add(control)
        } else {
            let modifiersForDevice = this.owned[owner.id]
            if (modifiersForDevice === undefined) {
                modifiersForDevice = {}
                this.owned[owner.id] = modifiersForDevice
            }
            const currentModifier = modifiersForDevice[control]
            if (currentModifier === undefined) {
                modifiersForDevice[control] = new Modifier(
                    owner,
                    this.representationIndex,
                    control,
                    this.newRepresentation()
                )
            }
        }
    }

    getForOwner(owner: ImportedDevice): Record<Control, Modifier> {
        return this.owned[owner.id] ?? {}
    }

    private newRepresentation() {
        const representation = Modifiers.representations[this.representationIndex]
        this.representationIndex += 1
        return representation
    }
}

export class Modifier {
    constructor(
        readonly owner: ImportedDevice,
        readonly ordinal: number,
        readonly control: Control,
        readonly representation: string
    ) {
    }

    compare(other: Modifier) {
        const ownersOrder = this.owner.compare(other.owner)
        return ownersOrder !== 0 ? ownersOrder : this.ordinal - other.ordinal
    }
}