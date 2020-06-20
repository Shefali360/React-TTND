import React from 'react';
import styles from './Loader.module.css';

const Loader=()=>{
    return(
<div className={styles.spinner}>
  <div className={styles.cube1}></div>
  <div className={styles.cube2}></div>
</div>)}

export default Loader;