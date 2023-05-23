import classNames from 'classnames'
import {DeviceAssignmentEditor} from 'components/DeviceAssignmentsEditor/DeviceAssignmentEditor'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {Modifiers} from 'domain/modifiers'
import React, {FC} from 'react'
import styles from './DeviceAssignmentsEditor.module.css'
import {ImportedDevice} from 'domain/import/imported-device';
import {Control} from "../../domain/import/control-assignment";

interface Props {
    className?: string,
    deviceAssignments: DeviceAssignment[],
    modifiers: Modifiers,
    value: DeviceAssignment[],
    onChange: (newValue: DeviceAssignment[]) => void,
    setModifierOwnerToAll: (modifier: Control, owner: ImportedDevice | undefined) => void
}

export const DeviceAssignmentsEditor: FC<Props> = ({
                                                       className,
                                                       modifiers,
                                                       deviceAssignments,
                                                       value = [],
                                                       onChange,
                                                       setModifierOwnerToAll
                                                   }) =>
    <div className={classNames(className, styles.root)}>
        {
            value.map((deviceAssignment, i) =>
                <DeviceAssignmentEditor
                    className={styles.deviceAssignmentEditor}
                    modifiers={modifiers}
                    key={deviceAssignment.importedDevice.id}
                    deviceAssignments={deviceAssignments}
                    value={deviceAssignment}
                    onChange={newDeviceAssignment => {
                        onChange([...value.slice(0, i), newDeviceAssignment, ...value.slice(i + 1)])
                    }}
                    setModifierOwnerToAll={setModifierOwnerToAll}
                />
            )
        }
    </div>


