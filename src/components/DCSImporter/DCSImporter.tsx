import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment'
import React, {FC} from 'react'
import {importDeviceAssignments} from 'services/dcs-import/import-device-assignments'
import styles from './DCSImporter.module.css'

interface Props {
    className?: string,
    onImport: (deviceAssignments: DeviceAssignment[]) => void
}

/**
 * Inputs selected files, parses them and produces device assignments.
 */
export const DCSImporter: FC<Props> = ({className, onImport}) =>
    <div className={classNames(className, styles.root)}>
        <p>Please upload html files with controls configuration exported from DCS.</p>
        <input
            multiple
            type="file"
            onChange={({target: {files}}) => {
                const filesArray = files ? Array.from(files) : []
                importDeviceAssignments(filesArray).then(onImport)
            }}
        />
    </div>