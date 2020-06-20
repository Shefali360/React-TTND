import React from "react";
import styles from "./AboutInfo.module.css";
import TTN from "../../Images/About.png";
import CustomerSuccess from "../../Images/Client.png";
import Agility from "../../Images/Agility.png";
import EnterprenaurialSpirit from "../../Images/EnterprenaurialSpirit.png";
import Transparency from "../../Images/Transparency.png";
import ConstantLearning from "../../Images/ConstantLearning.png";
import Creativity from "../../Images/Creativity.png";

const AboutInfo = () => {
  return (
    <>
      <div className={styles.Aboutinfo}>
        <h4>Who we are?</h4>
        <div className={styles.who}>
          <p className={styles.paragraph}>
            <img className={styles.ttnimg} src={TTN} alt="TTN"></img>
            TO THE NEW is a premium digital technology company that provides
            end-to-end Product Engineering and Digital Transformation services
            to Fortune 500 companies and Silicon Valley startups across the
            globe. We cover the entire gamut of product engineering including
            user experience design, web and mobile application development,
            cloud, devOps, big data, testing and infrastructure managed services
            to transform businesses digitally. At TO THE NEW, design led
            engineering is at the core of our offerings. Some of the
            cutting-edge technologies, frameworks and platforms we work on
            include MEAN, Grails, IoT, Blockchain, Bootstrap, AEM, Drupal,
            Hadoop, AWS, React, Ionic, Roku, iOS, and Android. The DNA of our
            Product Engineering services include design led engineering,
            cloud-native development, microservices driven architecture, DevOps,
            and CICD-led processes. Being an Agile company, we respond to change
            and pivot fast to create the best market fit with a quick turnaround
            time.
          </p>
        </div>
      </div>
      <div className={styles.Aboutinfo}>
        <h4>What do we stand for?</h4>
        <ul className={styles.pillars}>
          <li>
            <img src={CustomerSuccess} alt="Customer Success" />
            <h3>Customer Success</h3>
          </li>
          <li>
            <img src={Agility} alt="Agility" />
            <h3>Agility</h3>
          </li>
          <li>
            <img src={EnterprenaurialSpirit} alt="Entrepreneurial Spirit" />
            <h3>Entrepreneurial Spirit</h3>
          </li>
          <li>
            <img src={Transparency} alt="Transparency" />
            <h3>Transparency</h3>
          </li>
          <li>
            <img src={ConstantLearning} alt="Constant Learning" />
            <h3>Constant Learning</h3>
          </li>
          <li>
            <img src={Creativity} alt="Creativity" />
            <h3>Creativity and Innovation</h3>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AboutInfo;
