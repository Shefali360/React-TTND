import React from "react";
import logo from "../../Images/logo.jpeg";
import styles from "./TopDiv.module.css";
import Logout from '../../containers/Logout/Logout';
import {Link} from 'react-router-dom';


const TopDiv = (props) => {

  return (
    <div className={styles.top}>
      <nav className={styles.navbar}>
       <Link className={styles.logo} to="/buzz"><img src={logo} alt="TTN Logo" /></Link>
      <Logout/>
      </nav>
      <div className={styles.topDiv}>
        <div className={styles.innerDiv}>
          <p>{props.text}</p>
        </div>
      </div>
    </div>
  );
};

export default TopDiv;
