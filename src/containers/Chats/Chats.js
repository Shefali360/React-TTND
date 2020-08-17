import React,{Component} from "react";
import styles from './Chats.module.css';
import {withRouter} from 'react-router-dom';


class Chats extends Component{

    state={
        chatscreenVisible:false
    }

    showChatScreen=()=>{
        this.setState({chatscreenVisible:true})
    }
    render(){
        return(
            <div className={styles.chatList}>
            <h4>Your Chats</h4>
            <ul className={styles.names}>
                <li onClick={this.showChatScreen}>Shefali Goyal</li>
            </ul>
            </div>
        )
    }
}

export default withRouter(Chats);