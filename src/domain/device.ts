import {DeviceId} from "./hardware";
import {Control} from "./import/control-assignment";

/**
 * A device known by this application.
 */
export class Device {
    constructor(
        readonly id: DeviceId,
        readonly manufacturer: string,
        readonly model: string,
        readonly controls: Control[]
    ) {
    }

    toString() {
        return `${this.manufacturer} ${this.model}`
    }

    hasControl(control: Control) {
        return this.controls.includes(control)
    }
}
