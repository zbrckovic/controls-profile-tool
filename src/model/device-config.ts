import {Device} from './device'
import {ControlConfig} from "./control-config";

export class DeviceConfig {
    constructor(
        readonly id: string,
        public device?: Device,
        readonly mapping: Record<string, ControlConfig> = {}
    ) {
    }
}
