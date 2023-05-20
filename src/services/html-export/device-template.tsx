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
    private readonly fields: Record<Control, TemplateField> = {}

    constructor(readonly id: TemplateDeviceId) {
    }

    setField(control: Control, field: Element) {
        this.fields[control] = new TemplateField(control, field)
    }

    fill(deviceAssignment?: DeviceAssignment) {
        Object
            .entries(this.fields)
            .forEach(([control, field]) => {
                const controlAssignment = deviceAssignment?.mapping[control]
                field.fill(controlAssignment)
            })
    }
}

export class TemplateField {
    private readonly control: Control
    private readonly field: Root

    constructor(control: Control, element: Element) {
        this.control = control
        this.field = createRoot(element)
    }

    fill(controlAssignment?: ControlAssignment) {
        this.field.render(<ControlField control={this.control} assignment={controlAssignment}/>)
    }

}