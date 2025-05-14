import React from 'react'
import styles from './styles.module.css'

export const PyramidLoader: React.FC = () => {
  return (
    <div className={styles.pyramidLoader}>
      <div className={styles.wrapper}>
        <span className={`${styles.side} ${styles.side1}`}></span>
        <span className={`${styles.side} ${styles.side2}`}></span>
        <span className={`${styles.side} ${styles.side3}`}></span>
        <span className={`${styles.side} ${styles.side4}`}></span>
        <span className={styles.shadow}></span>
      </div>
    </div>
  )
}
