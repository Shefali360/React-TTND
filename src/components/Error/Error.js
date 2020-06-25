import React from 'react';
import styles from './Error.module.css';

const Error=(props)=>{
    return(
        <div className={styles.ErrorDiv}>
            <div className={styles.innerDiv}>
            <h3>Error Occurred</h3>
            <p>{props.errorMessage}</p>
            </div>
        </div>
    )
}

export default Error;