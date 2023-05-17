export class Device {
    constructor(
        readonly id: string,
        readonly manufacturer: string,
        readonly model: string,
        readonly controls: string[]
    ) {
    }

    toString() {
        return `${this.manufacturer} ${this.model}`
    }

    hasControl(control: string) {
        return this.controls.includes(control)
    }
}
