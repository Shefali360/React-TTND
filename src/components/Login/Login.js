import React,{Component} from 'react';
import styles from './Login.module.css';
import ttn from '../../Images/logo.jpeg';
import Loginbutton from './LoginButton/LoginButton';

class Login extends Component{
    render(){
        return(
            <div className={styles.mainImg}>
                  <div className={styles.overlay}>
                <div className={styles.loginDiv}>
                        <img src={ttn} alt='TTN Logo'/>
                        <h5>Create Your Own Buzz</h5>
                        <Loginbutton/>
                </div>
            </div>
            </div>
        );
    }
}

export default Login;