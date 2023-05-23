export type ImportedDeviceId = string

/**
 * Information about the external device comming from the importer.
 */
export class ImportedDevice {
    /**
     * The external id of this device assigned by the importer.
     */
    constructor(
        readonly id: ImportedDeviceId,
        /**
         * The ordinal number of the imported device.
         */
        readonly ordinal: number,
        /**
         * The name of the device assigned by the importer.
         */
        readonly name: string) {
    }

    compare(other: ImportedDevice) {
        return this.ordinal - other.ordinal
    }
}