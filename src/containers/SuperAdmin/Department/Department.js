import React, { Component } from "react";
import complaintStyles from "../../../containers/ComplaintPage/ComplaintList/ComplaintList.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./Department.module.css";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import { departmentEndpoint } from "../../../APIs/APIEndpoints";
import DeleteAssurancePopup from "../../../components/DeleteAssurance/DeleteAssurance";
import DepartmentPopup from "./DepartmentPopup/DepartmentPopup";
import { stringify } from "querystring";

class Department extends Component {
  state = {
    id: "",
    deptid: "",
    dept: "",
    departmentList: [],
    popupVisible: false,
    deletePopupVisible: false,
    department: "",
    submitDisabled: false,
    editPopupVisible: false,
    spinner:false
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

  componentDidMount(){
    this.props.getDept();
  }
  openPopup = () => {
    this.setState({
      popupVisible: true,
    });
  };

  closeEditPopup = () => {
    this.setState({ editPopupVisible: false });
  };

  closePopup = () => {
    this.setState({ popupVisible: false });
  };

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      }
      // () => {
      //     if (event.target.name !=="")
      //     { this.setState({ submitDisabled:false });}
      // }
    );
  };

  submitHandler = (event) => {
    event.preventDefault();
    const department = {
      department: this.state.department,
    };
    authorizedRequestsHandler()
      .post(departmentEndpoint, department)
      .then((res) => {
        this.props.deptArray.push(res.data);
        this.setState({
          popupVisible: false,
          submitDisabled: true,
        });
      })
      .catch((err) => {
       this.errorHandler(err);
      });
  };

  showDeletePopup = (id) => {
    this.setState({ deletePopupVisible: true, id: id });
  };

  closeDeletePopup = () => {
    this.setState({ deletePopupVisible: false });
  };

  submitEditHandler = (event) => {
    event.preventDefault();
    const formData = {
      department: this.state.dept,
    };
    // this.setState({ spinner: true});
    authorizedRequestsHandler()
      .patch(departmentEndpoint + `/${this.state.deptid}`, formData)
      .then((res) => {
        const array = this.props.deptArray;
        const index = array.findIndex((ele) => ele._id === this.state.deptid);
        array[index].department = res.data.department;
        this.setState({
          departmentList: array,
          dept: "",
          editPopupVisible: false,
          // formSubmitted: true,
          // submitDisabled: true,
          // spinner: false,
          // editClicked:false
        });
        // setTimeout(() => {
        //   this.setState({ formSubmitted: false });
        // }, 1000);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ spinner: false });
       this.errorHandler(err);
      });
  };

  editDepartment = (id) => {
    const filter = {};
    if (id) {
      filter["_id"] = id;
    }
    authorizedRequestsHandler()
      .get(departmentEndpoint + "?" + stringify(filter))
      .then((res) => {
        this.setState({
          deptid: res.data[0]._id,
          dept: res.data[0].department,
          editPopupVisible: true,
        });
      })
      .catch((err) => {  this.errorHandler(err);});
  };

  deleteDepartment = () => {
    this.setState({spinner:true});
    authorizedRequestsHandler()
      .delete(departmentEndpoint + `/${this.state.id}`)
      .then((res) => {
        let arr = this.props.deptArray;
        for (let i in arr) {
          if (arr[i]._id === this.state.id) {
            arr.splice(i, 1);
            break;
          }
        }
        this.setState({ deletePopupVisible: false, departmentList: arr,spinner:false });
      })
      .catch((err) => {
        this.errorHandler(err);
      });
  };

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
            <i className="fa fa-exclamation-triangle"></i>Department List can't
            be loaded.
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
            <td>
              {(dept.department)?dept.department:"Not Available"}
            </td>
            <td>
              <i
                className={["fa fa-edit", styles.edit].join(" ")}
                onClick={() => this.editDepartment(dept._id)}
                title="Edit Department"
              ></i>
              </td>
              <td>
              <i
                className={["fa fa-trash", styles.delete].join(" ")}
                onClick={() => this.showDeletePopup(dept._id)}
                title="Delete Department"
              ></i>
            </td>
          </tr>
        );
      });
    }

    return (
      <div className={[complaintStyles.complaintsList, styles.box].join(" ")}>
        {this.props.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4>All Departments</h4>
        <i
          className={["fa fa-building-o", styles.icon].join(" ")}
          onClick={this.openPopup}
          title="Add Department"
        ></i>
        <div className={complaintStyles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{dept || []}</tbody>
          </table>
          {this.state.deletePopupVisible ? (
            <DeleteAssurancePopup
              name="Department"
              message="Want to proceed with the deletion?"
              spinner={this.state.spinner}
              delete={this.deleteDepartment}
              cancel={this.closeDeletePopup}
            />
          ) : null}
          <div
            className={
              styles.overlay +
              " " +
              (this.state.popupVisible ? "null" : styles.display)
            }
          >
            <div
              className={
                styles.popup +
                " " +
                (this.state.popupVisible ? "null" : styles.display)
              }
            >
              <DepartmentPopup
                heading="Add New Department"
                click={this.closePopup}
                name="department"
                value={this.state.department}
                change={this.handleChange}
                disabled={this.state.submitDisabled}
                submit={(event) => this.submitHandler(event)}
              />
            </div>
          </div>
          <div
            className={
              styles.overlay +
              " " +
              (this.state.editPopupVisible ? "null" : styles.display)
            }
          >
            <div
              className={
                styles.popup +
                " " +
                (this.state.editPopupVisible ? "null" : styles.display)
              }
            >
              <DepartmentPopup
                heading="Edit Department"
                click={this.closeEditPopup}
                name="dept"
                value={this.state.dept}
                change={this.handleChange}
                disabled={this.state.submitDisabled}
                submit={(event) => this.submitEditHandler(event)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Department;
