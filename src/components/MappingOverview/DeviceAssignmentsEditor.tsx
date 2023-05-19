import {DeviceAssignmentEditor} from 'components/MappingOverview/DeviceAssignmentEditor'
import {DeviceAssignment} from 'domain/import/device-assignment'
import {ExternalDeviceId} from 'domain/import/types'
import {Control} from 'domain/types'
import React, {FC} from 'react'
import styles from './MappingOverview.module.css'

interface Props {
    value: DeviceAssignment[],
    onChange: (newValue: DeviceAssignment[]) => void,
    setModifierOwnerToAll: (modifier: Control, owner: ExternalDeviceId | undefined) => void
}

export const DeviceAssignmentsEditor: FC<Props> = ({
                                                       value = [],
                                                       onChange,
                                                       setModifierOwnerToAll
                                                   }) =>
    <div className={styles.root}>
        {
            value.map((deviceAssignment, i) =>
                <DeviceAssignmentEditor
                    className={styles.deviceAssignmentEditor}
                    key={deviceAssignment.id}
                    value={deviceAssignment}
                    onChange={newDeviceAssignment => {
                        onChange([...value.slice(0, i), newDeviceAssignment, ...value.slice(i + 1)])
                    }}
                    setModifierOwnerToAll={setModifierOwnerToAll}
                />
            )
        }
    </div>


