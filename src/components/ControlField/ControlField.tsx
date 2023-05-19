import {ControlAssignment} from 'domain/import/control-assignment'
import React, {FC} from 'react'
import styles from './ControlField.module.css'

interface Props {
    assignment?: ControlAssignment;
}

export const ControlField: FC<Props> = ({assignment}) => {
    if (!assignment) return null
    return <div className={styles.root}>
        {assignment.command}
    </div>
}