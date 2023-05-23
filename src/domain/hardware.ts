import {Device} from './device'

/**
 * Internal id of a device.
 *
 * This enum enumerates ids of all devices known by this application.
 *
 * If a device is missing from this enum, that doesn't mean it's not supported.
 * It only means some convenient features will not work with it.
 */
export enum DeviceId {
    Thrustmaster_T16000M = 'Thrustmaster T.16000M',
    Thrustmaster_TWCS = 'Thrustmaster TWCS'
}

/**
 * Every device known by this application.
 */
export const devicesById = {
    [DeviceId.Thrustmaster_T16000M]: new Device(
        DeviceId.Thrustmaster_T16000M,
        'Thrustmaster',
        'T.16000M',
        [
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
    ),
    [DeviceId.Thrustmaster_TWCS]: new Device(
        DeviceId.Thrustmaster_TWCS,
        'Thrustmaster',
        'TWCS',
        [
            // Throttle axes
            'JOY_X', // mini stick horizontal
            'JOY_Y', // mini stick vertical
            'JOY_Z', // throttle
            'JOY_RX', // right pedal,
            'JOY_RY', // left pedal,
            'JOY_RZ', // rocker switch
            'JOY_SLIDER1', // antenna
            'JOY_SLIDER2', // rudder

            // POV hat-switch
            'JOY_BTN_POV1_U', // up
            'JOY_BTN_POV1_UR', // up-right
            'JOY_BTN_POV1_R', // right
            'JOY_BTN_POV1_DR', // down-right
            'JOY_BTN_POV1_D', // down
            'JOY_BTN_POV1_DL', // down-left
            'JOY_BTN_POV1_L', // left
            'JOY_BTN_POV1_UL', // up-left

            'JOY_BTN1',
            'JOY_BTN2',
            'JOY_BTN3',
            'JOY_BTN4',
            'JOY_BTN5',
            'JOY_BTN6',
            'JOY_BTN7',
            'JOY_BTN8',
            'JOY_BTN9',
            'JOY_BTN10',
            'JOY_BTN11',
            'JOY_BTN12',
            'JOY_BTN13',
            'JOY_BTN14',
            'JOY_BTN15',
            'JOY_BTN16'
        ]
    )
}
