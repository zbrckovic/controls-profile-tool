/**
 * Internal definition of a device.
 */
export const createDevice = ({ id, manufacturer, model, controls }) => {
  const that = Object.create(behavior)
  return Object.assign(that, { id, manufacturer, model, controls })
}

const behavior = {
  toString () {
    return `${this.manufacturer} ${this.model}`
  },
  hasControl (control) {
    return this.controls.includes(control)
  }
}
