import React, {FC} from 'react'
import styles from './ControlField.module.css'

interface Props {
    control: string;
    modifier: string;
}

export const ControlField: FC<Props> = ({control, modifier}) => {
    if (control === undefined) return null
    return <div className={styles.root}>
        {control}
    </div>
}