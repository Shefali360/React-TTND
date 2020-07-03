import React, { Component } from "react";
import complaintStyles from "../../../containers/ComplaintPage/ComplaintList/ComplaintList.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./Department.module.css";

class Department extends Component {
  render() {
    let dept = null;
    if (this.props.state.spinner) {
      dept = (
        <tr>
          <td>
            <Spinner />
          </td>
        </tr>
      );
    } else if (this.props.state.error) {
      dept = (
        <tr>
          <td>
            <i className="fa fa-exclamation-triangle">
            </i>Department List can't be loaded.
          </td>
        </tr>
      );
    } else if (this.props.deptArray.length === 0)
     dept = (
        <tr>
          <td>Table has no data.</td>
        </tr>
      );
    else {
      let department = this.props.deptArray;
      dept = department.map((dept) => {
        return (
          <tr key={dept._id}>
            <td>{dept.department}</td>
          </tr>
        );
      });
    }

    return (
      <div className={[complaintStyles.complaintsList,styles.box].join(' ')}>
        {this.props.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4>All Departments</h4>
        <div className={complaintStyles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
            {dept||[]}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Department;
