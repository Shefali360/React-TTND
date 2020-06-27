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

  componentDidMount() {
  }

  complaintSubmitted=(event)=>{
    this.setState({complaintSubmitted:event});
  }

  render(){
    return (
      <div>
         
        <Complaintbox submitted={this.complaintSubmitted} />
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
