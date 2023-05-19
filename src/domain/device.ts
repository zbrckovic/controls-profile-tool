import {Control} from "./types";
import {DeviceId} from "./hardware";

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
