export const createDevice = ({ name, manufacturer, model, controls }) => {
  const device = Object.create(behavior)

  return Object.assign(device, {
    name,
    manufacturer,
    model,
    controls
  })
}

const behavior = {
  toString () {
    return `${this.manufacturer} ${this.model}`
  },
  hasControl (control) {
    return this.controls.includes(control)
  }
}
