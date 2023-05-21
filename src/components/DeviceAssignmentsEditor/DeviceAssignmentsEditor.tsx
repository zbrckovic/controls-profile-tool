import classNames from 'classnames'
import {DeviceAssignmentEditor} from 'components/DeviceAssignmentsEditor/DeviceAssignmentEditor'
import {UNOWNED} from 'domain/import/control-assignment'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ImportedDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'
import React, {FC} from 'react'
import styles from './DeviceAssignmentsEditor.module.css'

interface Props {
    className?: string,
    deviceAssignments: DeviceAssignment[],
    modifiers: Record<ImportedDeviceId | typeof UNOWNED, Set<Control>>,
    value: DeviceAssignment[],
    onChange: (newValue: DeviceAssignment[]) => void,
    setModifierOwnerToAll: (modifier: Control, owner: ImportedDeviceId | undefined) => void
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
                    key={deviceAssignment.id}
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


