import {ImportedDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'

export type ModifierRepresentations = Record<Control, string>

export class Modifiers {
    private static representations = ['*', '+', '$']
    private representationIndex = 0

    private readonly unowned = new Set<Control>
    private readonly owned: Record<ImportedDeviceId, ModifierRepresentations> = {}

    setModifierOwner(modifier: Control, owner?: ImportedDeviceId) {
        if (owner === undefined) {
            this.unowned.add(modifier)
        } else {
            let modifierRepresentations = this.owned[owner]
            if (modifierRepresentations === undefined) {
                modifierRepresentations = {}
                this.owned[owner] = modifierRepresentations
            }
            const currentRepresentation = modifierRepresentations[modifier]
            if (currentRepresentation === undefined) {
                modifierRepresentations[modifier] = this.newRepresentation()
            }
        }
    }

    getForOwner(owner: ImportedDeviceId): ModifierRepresentations {
        return this.owned[owner] ?? {}
    }

    private newRepresentation() {
        const representation = Modifiers.representations[this.representationIndex]
        this.representationIndex += 1
        return representation
    }
}

class Modifier {
    constructor(
        readonly owner: ImportedDeviceId,
        readonly control: Control,
        readonly representation: string
    ) {
    }
}