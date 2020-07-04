import React, { Component } from "react";
import Complaints from "./Complaints/Complaints";
import Users from "./Users/Users";
import Department from "./Department/Department";
import {departmentEndpoint} from "../../APIs/APIEndpoints";
import {authorizedRequestsHandler} from "../../APIs/APIs";
import styles from "./SuperAdmin.module.css";

class SuperAdmin extends Component{

    state = {
        deptArray: [],
        error: false,
        spinner: true,
        networkErr: false,
      };
    
      getDepartment = () => {
        authorizedRequestsHandler()
          .get(departmentEndpoint)
          .then((res) => {
            this.setState({ deptArray: res.data, spinner: false });
          })
          .catch((err) => {
            console.log(err);
            this.setState({ error: true, spinner: false });
            // const errorCode = err.response.data.errorCode;
            // if (errorCode === "INVALID_TOKEN") {
            //   this.props.errorOccurred();
            // }
            // if (err.response.status === 500) {
            //   this.setState({ networkErr: true });
            // }
          });
      };

      componentDidMount(){
          this.getDepartment();
      }
    render(){
    return(
        <div>
        <div className={styles.userAndDeptTable}>
        <Users/>
        <Department deptArray={this.state.deptArray} state={this.state}/>
        </div>
        <Complaints/>
        </div>
    )
}
}

export default SuperAdmin;