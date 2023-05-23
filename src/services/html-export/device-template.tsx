import {ControlField} from 'components/ControlField'
import {ModifierField} from 'components/ModifierField'
import {ControlAssignment} from 'domain/import/control-assignment'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ModifierRepresentations, Modifiers} from 'domain/modifiers'
import {Control} from 'domain/types'
import React from 'react'
import {createRoot, Root} from 'react-dom/client'

/**
 * Id of the device taken from template html.
 */
export type TemplateDeviceId = string;

export class DeviceTemplate {
    private readonly fields: TemplateField[] = []

    constructor(readonly id: TemplateDeviceId) {
    }

    setField(element: Element, controls: Control[]) {
        this.fields.push(new TemplateField(element, controls))
    }

    fill(modifiers: Modifiers, deviceAssignment?: DeviceAssignment) {
        this.fields.forEach(field => {
            // Check if the field is a modifier
            if (field.controls.length === 1 && deviceAssignment !== undefined) {
                const modifierRepresentations = modifiers.getForOwner(deviceAssignment.id)
                if (modifierRepresentations !== undefined) {
                    const [fieldControl] = field.controls
                    if (modifierRepresentations.hasOwnProperty(fieldControl)) {
                        field.fillWithModifier(fieldControl, modifierRepresentations[fieldControl])
                        return
                    }
                }
            }

            const controlAssignments = deviceAssignment?.controlAssignments.filter(
                ca => field.controls.includes(ca.control)) ?? []

            field.fillWithControls(modifiers, controlAssignments)
        })
    }
}

export class TemplateField {
    private readonly field: Root
    readonly controls: Control[]

    constructor(element: Element, controls: Control[]) {
        this.field = createRoot(element)
        this.controls = controls
    }

    fillWithControls(modifiers: Modifiers, controlAssignments: ControlAssignment[]) {
        this.field.render(
            <ControlField
                modifiers={modifiers}
                controls={this.controls}
                assignments={controlAssignments}/>)
    }

    fillWithModifier(modifier: Control, representation: string) {
        this.field.render(<ModifierField modifier={modifier} representation={representation}/>)
    }
}