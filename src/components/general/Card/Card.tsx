import React, {FC, PropsWithChildren} from 'react'
import styles from './Card.module.css'
import classNames from 'classnames'

interface Props extends PropsWithChildren {
    className?: string
}

export const Card: FC<Props> = ({className, children}) =>
    <div className={classNames(styles.root, className)}>{children}</div>