import React, { Component } from "react";
import Complaints from "./Complaints/Complaints";
import Users from "./Users/Users";
import Department from "./Department/Department";
import { departmentEndpoint } from "../../APIs/APIEndpoints";
import { authorizedRequestsHandler } from "../../APIs/APIs";
import {connect} from "react-redux";
import { errorOccurred } from "../../store/actions";

class SuperAdmin extends Component {
  state = {
    deptArray: [],
    dept: [],
    error: false,
    spinner: true,
    networkErr: false,
  };

  errorHandler = (err) => {
    if (err.response) {
      const errorCode = err.response.data.errorCode;
      if (errorCode === "INVALID_TOKEN") {
        this.props.errorOccurred();
      }
      if (err.response.status === 500) {
        this.setState({ networkErr: true });
      }
    }
  };

  departmentArray = (department) => {
    let deptArray = [
      { value: "", name: "Department" },
      { value: "all", name: "All" },
    ];
    department.forEach((dept) => {
      deptArray.push({ value: dept._id, name: dept.department });
    });
    return deptArray;
  };

  getDepartment = () => {
    authorizedRequestsHandler()
      .get(departmentEndpoint)
      .then((res) => {
        const dept = this.departmentArray(res.data);
        this.setState({ deptArray: res.data, dept: dept, spinner: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: true, spinner: false });
        this.errorHandler(err);
      });
  };

  render() {
    return (
      <div>
        <Complaints />
        <Users deptArray={this.state.dept} />
        <Department
          deptArray={this.state.deptArray}
          state={this.state}
          getDept={this.getDepartment}
        />
      </div>
    );
  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    errorOccurred:()=>dispatch(errorOccurred())
  }
  }

export default connect(null,mapDispatchToProps)(SuperAdmin);
