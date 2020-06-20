import React, { Component } from "react";
import styles from "./ComplaintBox.module.css";
import { connect } from "react-redux";
import SmallSpinner from "../../../components/SmallSpinner/SmallSpinner";
import {authorizedRequestsHandler} from '../../../APIs/APIs';
import {complaintsEndpoint} from '../../../APIs/APIEndpoints';
import { errorOccurred } from "../../../store/actions";
import Dropdown from '../../../components/Dropdown/Dropdown';

class ComplaintBox extends Component{
state = {
    department: "",
    issue: "",
    concern:"",
    files:[],
    submitDisabled: true,
    error: false,
    formSubmitted:false,
    spinner:false,
    departmentEmpty: false,
    issueEmpty:false,
    concernEmpty:false,
    networkErr:false,
    redirect:false
  }; 
  counter=0;
  departmentArray=[{value:"",name:"Select Department"},{value:"Admin",name:"Admin"},{value:"IT",name:"IT"},{value:"HR",name:"HR"},{value:"Infra",name:"Infra"}];
  issueArray=[{value:"",name:"Select Issue Title"},{value:"Hardware",name:"Hardware"},{value:"Infrastructure",name:"Infrastructure"},{value:"Others",name:"Others"}]

  fileChange=(event)=>{
     this.setState({files:event.target.files});
  }

  handleChange = (event) => {
     this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (this.state.department !== "" && this.state.issue !== "" && this.state.concern !== "")
           this.setState({ submitDisabled: false,departmentEmpty:false,issueEmpty:false,concernEmpty:false });
          if (this.state.department ==="")
          { this.setState({ departmentEmpty:true });}
          if (this.state.issue ==="")
          { this.setState({ issueEmpty:true });}
          if (this.state.concern ==="")
          { this.setState({ concernEmpty:true });}
      }
    );
  };

  submitHandler = (event) => {
    event.preventDefault();

    let formData=new FormData();
    for(let i=0;i<this.state.files.length;i++){
        formData.append("files",this.state.files[i],this.state.files[i]["name"])
    }
    formData.append("department",this.state.department);
    formData.append("issue",this.state.issue);
    formData.append("concern",this.state.concern);
    this.setState({spinner:true});
   authorizedRequestsHandler()
      .post(complaintsEndpoint,formData)
      .then((res) => {
        this.props.submitted({submitted:++this.counter});
         this.setState({
          department: '',
          issue: '',
          formSubmitted: true,
          submitDisabled: true,
          concern: '',
          files: [],
          spinner:false
        });
        this.handle = setTimeout(() => { this.setState({formSubmitted: false});}, 1000);
      })
      .catch((err) => {
        const errorCode=err.response.data.errorCode;
         if(errorCode==="INVALID_TOKEN"){
            this.props.errorOccurred();
         }
        if(err.response.status===500){
          this.setState({networkErr:true});
        }
      });

  };

  render() {
    return (
      <div className={styles.complaintBox}>
         {(this.state.networkErr)?alert("Please check your internet connection"):null}
        <h4>Complaint Box</h4>
        <form className={styles.complaintForm}>
        <div className={[styles.item,styles.dropdownMenu].join(' ')}> 
          <label>Select Department</label>
          <Dropdown class={styles.select} name="department" value={this.state.department} change={this.handleChange}
                array={this.departmentArray}/>
          </div>
          <div className={[styles.item,styles.dropdownMenu].join(' ')}>
          <label>Issue Title</label>
          <Dropdown class={styles.select} name="issue" value={this.state.issue} change={this.handleChange}
                array={this.issueArray}/>
          </div>
          <div className={styles.item}>
          <label>Your Name</label>
          <input className={[styles.input,styles.readOnly].join(' ')}type="text" name="name" value={this.props.name || ''} readOnly/>
          </div>
          <div className={styles.item}>
          <label >Email Id</label>
          <input className={[styles.input,styles.readOnly].join(' ')}type="email" name="email" value={this.props.mail || ''} readOnly/>
          </div>
          <div className={styles.textarea}> 
          <label>Your Concern</label>
          <textarea className={styles.Textarea} name="concern" rows="10" cols="50" placeholder="Please write your concern..."
          value={this.state.concern} onChange={this.handleChange}></textarea>
          </div>
          <div className={styles.attachment}>
          <div className={styles.realimage}>
            <input type="file" name="files" onChange={this.fileChange} multiple />
            <div className={styles.fakeImage}>
            <i className="fa fa-image"></i>
            </div>
            </div>
        </div>

            <div className={styles.Button}>
            {(this.state.spinner)?<div className={styles.spinner}><SmallSpinner/></div>:null}
            {(this.state.departmentEmpty||(this.state.issueEmpty)||(this.state.concernEmpty))?<p className={styles.errormsg}>Please fill in all the fields.</p>:null}
          <button className={styles.button} type="submit" value="Submit"
          disabled={this.state.submitDisabled}
          onClick={(event) => {
            this.submitHandler(event);
          }}>
            Submit
          </button>
          </div>
          <div className={styles.message}>
            {(this.state.formSubmitted)?<p>Successful!</p>:null}
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    errorOccurred:()=>dispatch(errorOccurred())
  }
  }
  


export default connect(null,mapDispatchToProps)(ComplaintBox);
