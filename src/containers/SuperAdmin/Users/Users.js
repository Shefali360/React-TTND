import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import { stringify } from "query-string";
import Loader from "../../../components/Loader/Loader";
import { userEndpoint, departmentEndpoint } from "../../../APIs/APIEndpoints";
import complaintStyles from "../../../containers/ComplaintPage/ComplaintList/ComplaintList.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import styles from "./Users.module.css";

class Users extends Component {
  state = {
    skip: 0,
    filters: {},
    networkErr: false,
    spinner: true,
    error: false,
    allUsersList: [],
    dept:''
  };

  limit = 10;

  getDepartment = (department) => {
    const dept = {};
    dept["_id"] = department;
    authorizedRequestsHandler()
      .get(departmentEndpoint + `?skip=0&limit=1&` + stringify(dept))
      .then((res) =>{ this.setState({ dept: res.data.department })})
      .catch((err) => console.log(err));
  };

  getAllUsers = (skip) => {
    authorizedRequestsHandler()
      .get(
        userEndpoint +
          `?skip=${skip}&limit=${this.limit}&` +
          stringify(this.state.filters)
      )
      .then((res) => {
        const allUsersList = Array.from(this.state.allUsersList);
        allUsersList.push(...res.data);
        this.setState({
          allUsersList: allUsersList,
          skip: skip + 10,
          hasMore: !(res.data.length < this.limit),
          spinner: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getAllUsers(this.state.skip);
  }

  render() {
    let userData = null;
    if (this.state.spinner) {
      userData = (
        <tr>
          <td>
            <Spinner />
          </td>
        </tr>
      );
    } else if (this.state.error) {
      userData = (
        <tr>
          <td>
            <i className="fa fa-exclamation-triangle"></i>User List can't be
            loaded.
          </td>
        </tr>
      );
    } else if (this.state.allUsersList.length === 0)
      userData = (
        <tr>
          <td>Table has no data.</td>
        </tr>
      );
    else {
      let user = this.state.allUsersList;
      userData = user.map((user) => {
        return (
          <tr key={user._id}>
            <td colSpan={2}>{user.email}</td>
            <td>{user.name}</td>
            <td>{user.role}</td>
            <td>{user.department&&user.department.department}</td>
          </tr>
        );
      });
    }

    return (
      <div className={[complaintStyles.complaintsList,styles.box].join(' ')}>
        {this.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4>All Users</h4>
        <div className={complaintStyles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th colSpan={2}>User Mail</th>
                <th>Username</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <InfiniteScroll
              loadMore={() => this.getAllUsers(this.state.skip)}
              hasMore={this.state.hasMore}
              loader={
                <tr key={1}>
                  <td colSpan={4}>
                    <Loader />
                  </td>
                </tr>
              }
              threshold={0.8}
              useWindow={false}
              initialLoad={false}
              element={"tbody"}
            >
              {userData || []}
            </InfiniteScroll>
          </table>
        </div>
      </div>
    );
  }
}

export default Users;
