import React from 'react'
import styles from './Card.module.css'
import classNames from 'classnames'

export const Card = ({ className, children }) => {
  return <div className={classNames(styles.root, className)}>{children}</div>
}