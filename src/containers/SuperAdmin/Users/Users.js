import React, { Component } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { stringify } from "query-string";
import Loader from "../../../components/Loader/Loader";
import {
  userEndpoint,
  updatePrivilegesEndpoint,
  departmentEndpoint,
} from "../../../APIs/APIEndpoints";
import complaintStyles from "../../../containers/ComplaintPage/ComplaintList/ComplaintList.module.css";
import Spinner from "../../../components/Spinner/Spinner";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import styles from "./Users.module.css";
import Dropdown from "../../../components/Dropdown/Dropdown";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import sharedStyles from "../../ResolvedPage/AllComplaintsList/AllComplaintsList.module.css";

class Users extends Component {
  state = {
    skip: 0,
    filters: {},
    networkErr: false,
    spinner: true,
    error: false,
    allUsersList: [],
    department: "",
    role: "",
  };

  limit = 10;
  roleArray = [
    { value: "", name: "Role" },
    { value: "User", name: "User" },
    { value: "Admin", name: "Admin" },
  ];

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

  handleChange = async (event, email) => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "department") {
      const dept = {};
      dept["_id"] = event.target.value;
      await authorizedRequestsHandler()
        .get(departmentEndpoint + "?" + stringify(dept))
        .then((res) => {
          this.setState({ department: res.data[0] });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    authorizedRequestsHandler()
      .patch(
        updatePrivilegesEndpoint + `/${email}`,
        !this.state.role
          ? { department: this.state.department }
          : { role: this.state.role }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        const errorCode = err.response.data.errorCode;
        if (errorCode === "INVALID_TOKEN") {
          this.props.errorOccurred();
        }
        if (err.response.status === 500) {
          this.setState({ networkErr: true });
        }
      });
  };

  handleFilterChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  applyFilters = () => {
    const filters = {};
    if (this.state.department && this.state.department !== "all") {
      filters["department"] = this.state.department;
    }
    if (this.state.role) {
      filters["role"] = this.state.role;
    }
    console.log(filters);
    this.setState({ filters: filters, skip: 0, hasMore: false });
    authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=${this.limit}&` + stringify(filters))
      .then((res) => {
        console.log(res);
        if (res.data.length !== 0) {
          this.setState({
            allUsersList: res.data,
            skip: this.limit,
            hasMore: !(res.data.length < this.limit),
          });
        } else if (res.data.length === 0) {
          this.setState({ allUsersList: [] });
        }
      })
      .catch((err) => {
        this.setState({ error: true });
        const errorCode = err.response.data.errorCode;
        if (errorCode === "INVALID_TOKEN") {
          this.props.errorOccurred();
        }
        if (err.response.status === 500) {
          this.setState({ networkErr: true });
        }
      });
  };

  resetFilters = () => {
    this.setState({
      filters: {},
      skip: 0,
      department: "",
      role: "",
      hasMore: false,
    });
    authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=${this.limit}`)
      .then((res) => {
        this.setState({
          allUsersList: res.data,
          skip: this.limit,
          hasMore: !(res.data.length < this.limit),
        });
      })
      .catch((err) => {
        this.setState({ error: true });
        const errorCode = err.response.data.errorCode;
        if (errorCode === "INVALID_TOKEN") {
          this.props.errorOccurred();
        }
        if (err.response.status === 500) {
          this.setState({ networkErr: true });
        }
      });
  };

  removeSuperAdmin = () => {
    let user = this.state.allUsersList;
    for (let i = 0; i < user.length; i++) {
      if (user[i].role === "SuperAdmin") {
        user.splice(i, 1);
        break;
      }
    }

    return user;
  };

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
      let user = this.removeSuperAdmin();
      if (!(this.state.filters.department || this.state.department === "all")) {
        user = user.filter((userData) => {
          return !userData.department;
        });
      }
      userData = user.map((user) => {
        return (
          <tr key={user._id}>
            <td colSpan={2}>{user.email}</td>
            <td>
              <Link
                className={styles.name}
                to={{ pathname: "/profile", state: { email: user.email } }}
              >
                {user.name}
              </Link>
            </td>
            <td>
              <div className={dropdownStyles.dropdown}>
                <Dropdown
                  defaultvalue={user.role}
                  name="role"
                  change={(event) => this.handleChange(event, user.email)}
                  array={this.roleArray}
                />
              </div>
            </td>
            <td>
              <div className={dropdownStyles.dropdown}>
                <Dropdown
                  name="department"
                  defaultvalue={
                    user.department ? user.department.department : ""
                  }
                  change={(event) => this.handleChange(event, user.email)}
                  array={this.props.deptArray}
                />
              </div>
            </td>
          </tr>
        );
      });
    }

    return (
      <div className={[complaintStyles.complaintsList, styles.box].join(" ")}>
        {this.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4>
          All Users{" "}
          <span className={styles.text}>
            (Showing users without department by default)
          </span>
        </h4>
        <div className={sharedStyles.filterFields}>
          <div className={dropdownStyles.dropdown}>
            <Dropdown
              name="role"
              value={this.state.role}
              change={this.handleFilterChange}
              array={this.roleArray}
            />
          </div>
          <div className={dropdownStyles.dropdown}>
            <Dropdown
              name="department"
              value={this.state.department}
              change={this.handleFilterChange}
              array={this.props.deptArray}
            />
          </div>
          <i
            className={["fa fa-check", sharedStyles.check].join(" ")}
            onClick={this.applyFilters}
            title="Apply Filters"
          ></i>
          <i
            className={["fa fa-undo", sharedStyles.undo].join(" ")}
            onClick={this.resetFilters}
            title="Reset Filters"
          ></i>
          <div className={sharedStyles.mobileButtons}>
            <button className={sharedStyles.apply} onClick={this.applyFilters}>
              Apply Filters
            </button>
            <button className={sharedStyles.reset} onClick={this.resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
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
