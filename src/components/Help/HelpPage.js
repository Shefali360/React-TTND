import React from "react";
import styles from "./HelpPage.module.css";
const HelpPage = () => {
  return (
    <>
      <div className={styles.Help}>
        <h4>Our Offices</h4>
        <div className={styles.div}>
          <div className={styles.address}>
            <h3>NOIDA</h3>
            <p>
              2nd Floor, NSL Techzone SEZ, Noida-Greater Noida Expressway,
              Sector 144, Noida, Uttar Pradesh 201301, India
            </p>
            <span>Tel:+91 120 4601800</span>
          </div>
          <div className={styles.address}>
            <h3>USA</h3>
            <p>TO THE NEW INC 101 Hudson Street #2100 Jersey City, NJ 07302</p>
            <span>Tel:+1(201)633-2314</span>
          </div>
          <div className={styles.address}>
            <h3>DUBAI</h3>
            <p>
              Sentro Business Center, Office No:1107 The Onyx, Tower 2, The
              Greens, Sheikh Zayed Road, Dubai, U.A.E
            </p>
            <span>Tel:+97143999496</span>
          </div>
        </div>
      </div>
      <div className={styles.Help}>
        <h4>Write To Us</h4>
        <div className={styles.div}>
          <i className="fa fa-envelope"></i>
          <h3>Write to Us</h3>
          <button>sales@tothenew.com</button>
        </div>
      </div>
      <div className={styles.Help}>
        <h4>Connect With Us</h4>
        <div className={styles.icons}>
          <a
            href="https://www.linkedin.com/company/tothenew"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fa fa-linkedin"></i>
          </a>
          <a
            href="https://twitter.com/tothenew"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fa fa-twitter"></i>
          </a>
          <a
            href="https://www.facebook.com/TOTHENEWDigital/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fa fa-facebook"></i>
          </a>
          <a
            href="https://www.youtube.com/c/tothenew"
            rel="noopener noreferrer"
            target="_blank"
          >
            <i className="fa fa-youtube"></i>
          </a>
          <a
            href="https://www.glassdoor.co.in/Overview/Working-at-TO-THE-NEW-EI_IE1011609.11,21.htm"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Glassdoor</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
