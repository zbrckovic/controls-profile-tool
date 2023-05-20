import {ControlAssignment} from 'domain/import/control-assignment'
import {Control} from 'domain/types'
import React, {FC} from 'react'

interface Props {
    control: Control;
    assignment?: ControlAssignment;
}

export const ControlField: FC<Props> = ({control, assignment}) =>
    <div style={{color: assignment !== undefined ? 'black' : 'red'}}>
        {assignment?.command ?? control}
    </div>