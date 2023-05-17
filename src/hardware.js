import { createDevice } from './model/device'

/**
 * Internal id of a device.
 *
 * This enum can be considered a database of all devices known by this
 * application. If a device is missing from this list, that doesn't mean it's
 * not supported. It only means some convenient features will not work with it.
 */
export const DeviceId = {
  Thrustmaster_T16000M: 'Thrustmaster_T16000M'
}

/**
 * Information about every device known by this application.
 */
export const devicesById = {
  [DeviceId.Thrustmaster_T16000M]: createDevice({
    id: DeviceId.Thrustmaster_T16000M,
    manufacturer: 'Thrustmaster',
    model: 'T.16000M',
    controls: [
      // Stick axes
      'JOY_X', // roll
      'JOY_Y', // pitch
      'JOY_Z', // jaw

      // POV hat-switch
      'JOY_BTN_POV1_U', // up
      'JOY_BTN_POV1_UR', // up-right
      'JOY_BTN_POV1_R', // right
      'JOY_BTN_POV1_DR', // down-right
      'JOY_BTN_POV1_D', // down
      'JOY_BTN_POV1_DL', // down-left
      'JOY_BTN_POV1_L', // left
      'JOY_BTN_POV1_UL', // up-left

      'JOY_BTN1', // trigger

      // Joystick head buttons
      'JOY_BTN2', // bottom
      'JOY_BTN3', // left
      'JOY_BTN4', // right

      // Base buttons
      // top left row counting towards the inside
      'JOY_BTN5',
      'JOY_BTN6',
      'JOY_BTN7',
      // bottom left row counting towards the outside
      'JOY_BTN8',
      'JOY_BTN9',
      'JOY_BTN10',
      // top right row counting towards the inside
      'JOY_BTN11',
      'JOY_BTN12',
      'JOY_BTN13',
      // bottom right row counting towards the outside
      'JOY_BTN14',
      'JOY_BTN15',
      'JOY_BTN16'
    ]
  })
}
