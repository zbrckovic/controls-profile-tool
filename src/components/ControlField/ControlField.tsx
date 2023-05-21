import {ControlAssignment} from 'domain/import/control-assignment'
import {Control} from 'domain/types'
import React, {FC} from 'react'

interface Props {
    controls: Control[];
    assignments: ControlAssignment[];
}

export const ControlField: FC<Props> = ({controls, assignments}) =>
    <div style={{color: assignments.length > 0 ? 'black' : 'red'}}>
        {assignments.length === 0 ? controls.join(';') : assignments.map(a => a.command).join(', ')}
    </div>