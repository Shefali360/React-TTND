import React,{Component} from 'react';
import styles from './Login.module.css';
import ttn from '../../Images/logo.jpeg';
import Entrybutton from './EntryButton/EntryButton';

class Login extends Component{

    determineEndpoint=(endpoint)=>{
        localStorage.setItem("endpoint",endpoint);
    }
    render(){
        let errorState=this.props.location.state;
        return(
            <div className={styles.mainImg}>
                  <div className={styles.overlay}>
                <div className={styles.loginDiv}>
                        <img src={ttn} alt='TTN Logo'/>
                        <h5>Create Your Own Buzz</h5>
                        {(errorState&&errorState.errorCode==="DUPLICATE_KEY")?<span className={styles.errorMsg}>User already exists</span>:null}
                        <Entrybutton text="Sign up with gmail" click={()=>this.determineEndpoint("signup")}/>
                        {(errorState&&errorState.errorCode==="UNAUTHORIZED_ACCESS")?<p className={styles.errorMsg}>Please signup first</p>:null}
                        <Entrybutton text="Sign in with gmail" click={()=>this.determineEndpoint("signin")}/>
                </div>
            </div>
            </div>
        );
    }
}

export default Login;