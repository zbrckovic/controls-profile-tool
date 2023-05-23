import {ImportedDevice} from "./imported-device";

/**
 * Control of a device: button, axis, switch...
 */
export type Control = string

/**
 * Information assigned to a single control.
 */
export class ControlAssignment {
    constructor(
        readonly control: Control,
        /**
         * A description of the in-game function the control has.
         */
        readonly command: string,
        /**
         * An object whose keys are modifier controls which need to be combined
         * with the main control. Values are modifier owners i.e. devices to
         * which modifiers belong to.
         *
         * If the value associated to modifier is `undefined`, it means the
         * modifier has not yet been associated with its owner and that makes
         * this control assignment incomplete.
         */
        readonly modifiers: Record<Control, ImportedDevice | undefined>
    ) {
    }

    /**
     * Returns a string which uniquely represents this combination of modifiers.
     */
    getModifierComboId() {
        return JSON.stringify(Object.keys(this.modifiers))
    }

    hasModifiers() {
        return Object.keys(this.modifiers).length > 0
    }

    withModifiers(modifiers: Record<Control, ImportedDevice>) {
        return new ControlAssignment(this.control, this.command, modifiers)
    }

    /**
     * Returns a copy of `this` which associates `modifier` with `owner` in case
     * `modifier` exists.
     */
    withModifierOwner(modifier: Control, owner?: ImportedDevice) {
        return new ControlAssignment(
            this.control,
            this.command,
            this.createModifiersWithModifierOwner(modifier, owner))
    }

    setModifierOwner(modifier: Control, owner?: ImportedDevice) {
        if (this.modifiers.hasOwnProperty(modifier)) {
            this.modifiers[modifier] = owner
        }
    }

    doAllModifiersHaveOwners() {
        return Object.values(this.modifiers).every(owner => owner !== undefined)
    }

    /**
     * Returns a copy of `modifiers` which associates `modifier` with `owner` in
     * case `modifier` exists.
     */
    private createModifiersWithModifierOwner(
        modifier: Control,
        owner?: ImportedDevice
    ) {
        if (!this.modifiers.hasOwnProperty(modifier)) return this.modifiers
        return {...this.modifiers, [modifier]: owner}
    }
}
