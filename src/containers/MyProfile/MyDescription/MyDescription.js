import React,{Component} from "react";
import styles from "./MyDescription.module.css";
import {serverURI,pictureURI} from "../../../APIs/APIEndpoints";
import EditProfile from "../../../components/EditProfilePopup/EditProfilePopup";

class MyDescription extends Component{
    state={
        popupVisible:false
    }

    openPopup=()=>{
        this.setState({popupVisible:true})
    }

    closePopup=()=>{
        this.setState({popupVisible:false})
    }
    render(){
        return(
            <div className={styles.profile}>
                <h4>
                    My Profile
                </h4>
                <div className={styles.descBox}>
                <i className={["fa fa-edit",styles.edit].join(' ')} onClick={this.openPopup} title="Edit Profile"/>
                <div className={styles.picture}>
                <img
                className={styles.profilePic}
                 src={
                serverURI +
                pictureURI +
                "/" +
                encodeURIComponent(this.props.picture)
              }
              alt="Profile Pic"
            />
            <i className={["fa fa-plus-circle",styles.editPic].join(' ')} title="Edit Profile Picture"/>
                </div>
                <div className={styles.description}>
                <h2>{this.props.name}</h2>
                <h3>{this.props.role}</h3>
                <ul>
                <li><i className="fa fa-envelope"/>{this.props.email}</li>
                {(this.props.department)?<li><i className="fa fa-building-o"/>{this.props.department}</li>:null}
                 {(this.props.dob)?<li><i className="fa fa-birthday-cake"/>{this.props.dob}</li>:null}
                 {(this.props.phone)?<li><i className="fa fa-phone"/>{this.props.phone}</li>:null}
                 </ul>
                 </div>
                 {(this.state.popupVisible)?<EditProfile close={this.closePopup}/>:null}
                 </div>
            </div>
        )
    }
}

export default MyDescription;