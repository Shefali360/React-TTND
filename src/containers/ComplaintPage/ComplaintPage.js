import React, { Component } from "react";
import Complaintbox from "./ComplaintBox/ComplaintBox";
import ComplaintsList from "./ComplaintList/ComplaintList";
import { connect } from "react-redux";
import { errorOccurred } from "../../store/actions/index";
import { authorizedRequestsHandler } from "../../APIs/APIs";
import { departmentEndpoint } from "../../APIs/APIEndpoints";

class ComplaintPage extends Component {
  state = {
    userName: "",
    userMail: "",
    complaintSubmitted: { submitted: 0 },
    deptArray: [],
    error: false,
    spinner: false,
    networkErr: false,
  };

  departmentArray = (department, value) => {
    let deptArray = [{ value: "", name: "Select Department" }];
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
        this.setState({ deptArray: dept, spinner: false });
      })
      .catch((err) => {
        this.setState({ error: true, spinner: false });
        const errorCode = err.response.data.errorCode;
        if (errorCode === "INVALID_TOKEN") {
          this.props.errorOccurred();
        }
        if (err.response.status === 500) {
          this.setState({ networkErr: true });
        }
      });
  };

  componentDidMount() {
    this.getDepartment();
  }
  complaintSubmitted = (event) => {
    this.setState({ complaintSubmitted: event });
  };

  render() {
    return (
      <div>
        <Complaintbox
          submitted={this.complaintSubmitted}
          deptArray={this.state.deptArray}
        />
        <ComplaintsList
          submitted={this.state.complaintSubmitted}
          deptArray={this.state.deptArray}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    errorOccurred: () => dispatch(errorOccurred()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintPage);
