/**
 * @param id
 * @param device - An internal device object.
 * @param mapping - An object which maps controls to control configs.
 */
export const createDeviceConfig = ({
  id,
  device,
  mapping
}) => {
  const that = Object.create(behavior)
  Object.assign(that, { id, device, mapping })
  return that
}

const behavior = {}