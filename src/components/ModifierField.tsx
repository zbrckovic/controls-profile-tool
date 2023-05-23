import {Control} from 'domain/types'
import React, {FC} from 'react'

interface Props {
    modifier: Control,
    representation: string
}

export const ModifierField: FC<Props> = ({modifier, representation}) => {
    return <div style={{fontSize: '25px', fontWeight: 'bold'}}>{representation}</div>
}