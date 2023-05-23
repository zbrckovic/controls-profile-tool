import React, {FC} from 'react'
import {Control} from "../domain/import/control-assignment";

interface Props {
    modifier: Control,
    representation: string
}

export const ModifierField: FC<Props> = ({modifier, representation}) => {
    return <div style={{fontSize: '25px', fontWeight: 'bold'}}>{representation}</div>
}