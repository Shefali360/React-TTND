import React from 'react';
import styles from './ComplaintPopup.module.css';


const ComplaintPopup=(props)=>{
    const complaint = props.complaint;
    const date=new Date(complaint.timestamp);
    const dayNum=date.getDate();
    const dayFormat = dayNum < 10 ? "0" + dayNum : dayNum;
    const month=date.getMonth()+1;   
    const monthFormat = month < 10 ? "0" + month : month;
    const year=date.getFullYear();  
    return(
        <div className={styles.overlay} onClick={props.click}>
        <div className={styles.popup}>
        <div className={styles.data}>
            <div className={styles.column1}>
         <p className={styles.issueId}>{complaint.issueId}</p>
         <p className={styles.status}>({complaint.status})</p>
         </div>
         <p className={styles.text}>Logged On:{dayFormat}/{monthFormat}/{year}</p>
        {(complaint.status==="In Progress")?<p className={styles.text}>Estimated time:{complaint.estimatedTime.count} {complaint.estimatedTime.timeType}</p>:null}
        {(complaint.lockedBy)?<p className={styles.text}>Locked By:{complaint.lockedBy}</p>:null}
        <p className={styles.assignedTo}>Assigned To:{complaint.assignedTo}</p>
         <div className={styles.column2}>
         <p className={styles.text}>Department:{complaint.department}</p>
         <p className={styles.text}>Issue Title:{complaint.issue}</p>
         </div>
         <p className={styles.text}>{complaint.concern}</p>
        </div>
        </div>
        </div>
    );
}

export default ComplaintPopup;
