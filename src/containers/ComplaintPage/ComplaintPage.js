import React, { Component } from "react";
import Complaintbox from './ComplaintBox/ComplaintBox';
import ComplaintsList from "./ComplaintList/ComplaintList";
import { connect } from "react-redux";
import { errorOccurred } from "../../store/actions/index";

class ComplaintPage extends Component{

  state = {
    userName: '',
    userMail: '',
    complaintSubmitted:{submitted:0}
  }

  parseIdToken=()=>{
    try{
      const data=JSON.parse(atob(this.props.data.id_token.split('.')[1]));
      this.setState({
        userName: data.name,
        userMail: data.email
      });
    }catch(err){
      const errorCode=err.response.data.errorCode;
      if(errorCode==="INVALID_TOKEN"){
         this.props.errorOccurred();
      }
    }

  }

  componentDidMount() {
    this.parseIdToken();
  }

  complaintSubmitted=(event)=>{
    this.setState({complaintSubmitted:event});
  }

  render(){
    return (
      <div>
         
        <Complaintbox name={this.state.userName} mail={this.state.userMail}  submitted={this.complaintSubmitted} />
        <ComplaintsList submitted={this.state.complaintSubmitted}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.auth.token,
  };
};

const mapDispatchToProps=(dispatch)=>{
  return{
    errorOccurred:()=>dispatch(errorOccurred())
  }
  }
  
export default connect(mapStateToProps,mapDispatchToProps)(ComplaintPage);
