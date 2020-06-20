import React,{Component} from 'react';
import styles from './Logout.module.css';
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

class Logout extends Component{
    render(){
      if(this.props.logoutPressed){
       return <Redirect to="/login"/>
      }
    return(<button className={styles.Logout} type="logout" name="logout" onClick={this.props.onRevokeToken}>
    Logout <i className="fa fa-sign-out"></i>
  </button>);
}
}


const mapStateToProps=(state)=>{
  return{
    logoutPressed:state.logout.loggedout,
    token:state.logout.token
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onRevokeToken: () => dispatch(actions.revokeToken()),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Logout);