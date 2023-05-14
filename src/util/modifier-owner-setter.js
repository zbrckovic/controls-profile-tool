export const createModifierOwnerSetter = ({ modifier, owner }) => {
  const instance = Object.create(behavior)
  return Object.assign(instance, { modifier, owner })
}

const behavior = {
  setModifierOwnerToDeviceConfigs (deviceConfigs) {
    return deviceConfigs.map(deviceConfig =>
      this._setModifierOwnerToDeviceConfig(deviceConfig)
    )
  },

  _setModifierOwnerToDeviceConfig (deviceConfig) {
    return {
      ...deviceConfig,
      mapping: this._setModifierOwnerToMapping(deviceConfig.mapping)
    }
  },

  _setModifierOwnerToMapping (mapping) {
    return Object.fromEntries(
      Object
        .entries(mapping)
        .map(([control, controlConfig]) => [
          control,
          this._setModifierOwnerToControlConfig(controlConfig)
        ])
    )
  },

  _setModifierOwnerToControlConfig (controlConfig) {
    return {
      ...controlConfig,
      modifiers: this._setModifierOwnerToModifiers(controlConfig.modifiers)
    }
  },

  _setModifierOwnerToModifiers (modifiers) {
    if (!Object.hasOwn(modifiers, this.modifier)) return modifiers
    return ({ ...modifiers, [this.modifier]: this.owner })
  }
}