import React, {FC} from 'react'
import styles from './DCSImporter.module.css'
import classNames from 'classnames'
import {DeviceAssignment} from 'domain/import/device-assignment';
import {importDeviceAssignments} from "services/dcs-import/import-device-assignments";

interface Props {
    className?: string,
    onChange: (deviceAssignments: DeviceAssignment[]) => void
}

export const DCSImporter: FC<Props> = ({className, onChange}) =>
    <div className={classNames(className, styles.root)}>
        <p>
            Please upload html files with controls configuration exported from
            DCS.
        </p>
        <input
            multiple
            type="file"
            onChange={({target: {files}}) => {
                importDeviceAssignments(files ? Array.from(files) : []).then(onChange)
            }}
        />
    </div>