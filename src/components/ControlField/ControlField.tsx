import {ControlAssignment} from 'domain/import/control-assignment'
import {Control} from 'domain/types'
import React, {FC} from 'react'

interface Props {
    control: Control;
    assignments: ControlAssignment[];
}

export const ControlField: FC<Props> = ({control, assignments}) =>
    <div style={{color: assignments.length > 0 ? 'black' : 'red'}}>
        {assignments.length === 0 ? control : assignments.map(a => a.command).join(", ")}
    </div>