import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ComplaintPopup from "../../../components/ComplaintPopup/ComplaintPopup";
import InfiniteScroll from "react-infinite-scroller";
import { stringify } from "query-string";
import Loader from "../../../components/Loader/Loader";
import sharedStyles from "../../../containers/ResolvedPage/AllComplaintsList/AllComplaintsList.module.css";
import complaintStyles from "../../../containers/ComplaintPage/ComplaintList/ComplaintList.module.css";
import { errorOccurred } from "../../../store/actions";
import {
  departmentEndpoint,
  complaintsEndpoint,
  userEndpoint,
} from "../../../APIs/APIEndpoints";
import Spinner from "../../../components/Spinner/Spinner";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import Dropdown from "../../../components/Dropdown/Dropdown";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import styles from "./Complaints.module.css";

class Complaints extends Component {
  state = {
    department: "",
    status: "",
    skip: 0,
    search: "",
    searchInput: "",
    filters: {},
    networkErr: false,
    allComplaintsList: [],
    spinner: true,
    error: false,
    complaint: {},
    popupVisible: false,
    deptArray: [],
    userMail: "",
  };
  limit = 10;
  statusArray = [
    { value: "", name: "Select Status" },
    { value: "Open", name: "Open" },
    { value: "In Progress", name: "In Progress" },
    { value: "Closed", name: "Closed" },
  ];
  searchArray = [
    { value: "", name: "Search By" },
    { value: "issueId", name: "Issue id" },
    { value: "lockedBy", name: "Locked By" },
  ];

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

  complaintEndpoint = (skip, filters) => {
    return authorizedRequestsHandler().get(
      complaintsEndpoint +
        `?all=true&skip=${skip}&limit=${this.limit}&` +
        stringify(filters)
    );
  };

  fetchComplaints = (skip, filter, filtered) => {
    this.complaintEndpoint(skip, filter)
      .then((res) => {
        let complaintsList = [];
        if (filtered === 1) {
          if (res.data.length !== 0) {
            complaintsList = res.data;
          } else if (res.data.length === 0) {
            complaintsList = [];
          }
        } else {
          complaintsList = Array.from(this.state.allComplaintsList);
          complaintsList.push(...res.data);
        }
        this.setState({
          allComplaintsList: complaintsList,
          skip: skip + 10,
          hasMore: !(res.data.length < this.limit),
          spinner: false,
        });
      })
      .catch((err) => {
        this.setState({ error: true, spinner: false });
        this.errorHandler(err);
      });
  };

  getAllComplaints = (skip) => {
    this.fetchComplaints(skip, this.state.filters);
  };

  closePopup = () => {
    this.setState({ complaint: {}, popupVisible: false });
  };

  componentDidMount() {
    this.getAllComplaints(this.state.skip);
    this.getDepartment();
  }
  statusColor = (status) => {
    if (status === "Open") {
      return complaintStyles.open;
    } else if (status === "In Progress") {
      return complaintStyles.progress;
    } else if (status === "Closed") {
      return complaintStyles.closed;
    }
  };

  handleFilterChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getUser = (userName) => {
    const user = {};
    user["name"] = userName;
    authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=1&` + stringify(user))
      .then((res) => {
        const userData = res.data[0];
        this.setState({ userMail: userData.email });
      })
      .catch((err) => {
        this.setState({ error: true, spinner: false });
        this.errorHandler(err);
      });
  };

  departmentArray = (department) => {
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
        this.errorHandler(err);
      });
  };

  applyFilters = () => {
    const filters = {};
    if (this.state.department) {
      filters["department"] = this.state.department;
    }
    if (this.state.status) {
      filters["status"] = this.state.status;
    }
    if (this.state.searchInput) {
      filters["issueId"] = this.state.searchInput.trim().toUpperCase();
    }
    this.setState({ filters: filters, skip: 0, hasMore: false });
    this.fetchComplaints(0, filters, 1);
  };

  resetFilters = () => {
    this.setState({
      filters: {},
      department: "",
      status: "",
      searchInput: "",
      search: "",
      hasMore: false,
    });
    this.fetchComplaints(0, "", 1);
  };

  render() {
    let tableData = null;
    if (this.state.spinner) {
      tableData = (
        <tr>
          <td>
            <Spinner />
          </td>
        </tr>
      );
    } else if (this.state.error) {
      tableData = (
        <tr>
          <td>
            <i className="fa fa-exclamation-triangle"></i>Complaint List can't
            be loaded.
          </td>
        </tr>
      );
    } else if (this.state.allComplaintsList.length === 0)
      tableData = (
        <tr>
          <td>Table has no data.</td>
        </tr>
      );
    else {
      let count = this.state.allComplaintsList;
      tableData = count.map((complaint) => {
        return (
          <tr key={complaint._id}>
            <td>
              {complaint.department
                ? complaint.department.department
                : "Not Available"}
            </td>
            <td>
              <button
                className={complaintStyles.issueId}
                onClick={() => {
                  this.setState({ complaint: complaint, popupVisible: true });
                }}
              >
                {complaint.issueId}
              </button>
            </td>
            <td>
              <Link
                className={styles.name}
                to={{
                  pathname: "/profile",
                  state: { email: complaint.lockedBy.email },
                }}
              >
                {complaint.lockedBy.name}
              </Link>
            </td>
            <td>
              <Link
                className={styles.name}
                to={{
                  pathname: "/profile",
                  state: { email: complaint.assignedTo.email },
                }}
              >
                {complaint.assignedTo.name}
              </Link>
            </td>
            <td className={this.statusColor(complaint.status)}>
              {complaint.status}
            </td>
          </tr>
        );
      });
    }

    return (
      <div className={complaintStyles.complaintsList}>
        {this.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4>All Complaints</h4>
        <div className={sharedStyles.filterFields}>
          <div className={dropdownStyles.dropdown}>
            <Dropdown
              name="department"
              value={this.state.department}
              change={this.handleFilterChange}
              array={this.state.deptArray}
            />
          </div>
          <div className={dropdownStyles.dropdown}>
            <Dropdown
              name="status"
              value={this.state.status}
              change={this.handleFilterChange}
              array={this.statusArray}
            />
          </div>
          <div>
            <div className={[sharedStyles.search, styles.search].join(" ")}>
              <input
                type="text"
                placeholder="Enter Issue ID"
                name="searchInput"
                value={this.state.searchInput}
                onChange={this.handleFilterChange}
              />
            </div>
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
        <div>
          <table className={styles.tableList}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Issue Id</th>
                <th>Locked By</th>
                <th>Assigned To</th>
                <th>Status</th>
              </tr>
            </thead>
            <InfiniteScroll
              loadMore={() => this.getAllComplaints(this.state.skip)}
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
              {tableData || []}
            </InfiniteScroll>
          </table>
        </div>
        {this.state.popupVisible ? (
          <ComplaintPopup
            complaint={this.state.complaint}
            click={this.closePopup}
          />
        ) : null}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    errorOccurred: () => dispatch(errorOccurred()),
  };
};

export default connect(null, mapDispatchToProps)(Complaints);
