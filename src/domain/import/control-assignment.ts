import {ExternalDeviceId} from "./types";
import {Control} from "../types";

/**
 * Information assigned to a single control.
 */
export class ControlAssignment {
    constructor(
        /**
         * A description of the in-game function the control has.
         */
        readonly command: string,
        /**
         * An object whose keys are modifier controls which need to be combined
         * with the main control. Values are ids of modifier owners i.e.
         * devices to which modifiers belong to.
         *
         * If the value associated to modifier is `undefined`, it means the
         * modifier has not yet been associated with its owner and that makes
         * this control assignment incomplete.
         */
        readonly modifiers: Record<Control, ExternalDeviceId | undefined>
    ) {
    }

    withModifiers(modifiers: Record<Control, ExternalDeviceId>) {
        return new ControlAssignment(this.command, modifiers)
    }

    /**
     * Returns a copy of `this` which associates `modifier` with `owner` in case
     * `modifier` exists.
     */
    withModifierOwner(modifier: Control, owner?: ExternalDeviceId) {
        return new ControlAssignment(
            this.command,
            this.createModifiersWithModifierOwner(modifier, owner))
    }

    setModifierOwner(modifier: Control, owner?: ExternalDeviceId) {
        if (this.modifiers.hasOwnProperty(modifier)) {
            this.modifiers[modifier] = owner
        }
    }

    doAllModifiersHaveOwners() {
        return Object.values(this.modifiers).every(id => id !== undefined)
    }

    /**
     * Returns a copy of `modifiers` which associates `modifier` with `owner` in
     * case `modifier` exists.
     */
    private createModifiersWithModifierOwner(
        modifier: Control,
        owner?: ExternalDeviceId
    ) {
        if (!this.modifiers.hasOwnProperty(modifier)) return this.modifiers
        return {...this.modifiers, [modifier]: owner}
    }
}