import {ControlField} from 'components/ControlField'
import {ControlAssignment} from 'domain/import/control-assignment'
import {DeviceAssignment} from 'domain/import/device-assignment'
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

    fill(deviceAssignment?: DeviceAssignment) {
        this.fields.forEach(field => {
            const controlAssignments = deviceAssignment?.controlAssignments
                .filter(ca => field.controls.includes(ca.control)) ?? []
            field.fill(controlAssignments)
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

    fill(controlAssignments: ControlAssignment[]) {
        this.field.render(<ControlField controls={this.controls} assignments={controlAssignments}/>)
    }

}