import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ComplaintList.module.css";
import ComplaintPopup from "../../../components/ComplaintPopup/ComplaintPopup";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import sharedStyles from "../../../containers/ResolvedPage/AllComplaintsList/AllComplaintsList.module.css";
import { stringify } from "query-string";
import InfiniteScroll from "react-infinite-scroller";
import errorStyles from "../../BuzzPage/RecentBuzz/RecentBuzzFile/RecentBuzz";
import Dropdown from "../../../components/Dropdown/Dropdown";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import { complaintsEndpoint, userEndpoint } from "../../../APIs/APIEndpoints";
import { errorOccurred } from "../../../store/actions";
import Loader from "../../../components/Loader/Loader";
import EditComplaintPopup from "../../../components/EditComplaintPopup/EditComplaintPopup";
import DeleteAssurancePopup from "../../../components/DeleteAssurance/DeleteAssurance";

class UserComplaintList extends Component {
  state = {
    complaint: {},
    popupVisible: false,
    department: "",
    status: "",
    searchInput: "",
    editedDept: "",
    initialDept: "",
    deptdata: {},
    title: "",
    concern: "",
    files: [],
    id: null,
    editClicked: false,
    filters: {},
    complaintsList: [],
    error: false,
    skip: 0,
    spinner: true,
    networkErr: false,
    submitDisabled: true,
    departmentEmpty: false,
    issueEmpty: false,
    concernEmpty: false,
    userData: {},
    deletePopupVisible: false,
    deletionId: null,
  };
  limit = 10;
  statusArray = [
    { value: "", name: "Select Status" },
    { value: "Open", name: "Open" },
    { value: "In Progress", name: "In Progress" },
    { value: "Closed", name: "Closed" },
  ];

  getComplaints = (skip) => {
    authorizedRequestsHandler()
      .get(
        complaintsEndpoint +
          `?skip=${skip}&limit=${this.limit}&` +
          stringify(this.state.filters)
      )
      .then((res) => {
        const complaintsList = Array.from(this.state.complaintsList);
        complaintsList.push(...res.data);
        this.setState({
          complaintsList: complaintsList,
          skip: skip + 10,
          hasMore: !(res.data.length < this.limit),
          spinner: false,
        });
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
    this.getComplaints(this.state.skip);
  }

  componentDidUpdate(prevProps) {
    if (this.props.submitted.submitted > prevProps.submitted.submitted) {
      this.setState({ complaintsList: [], spinner: true, hasMore: false });
      this.getComplaints(0);
    }
  }

  handleFilterChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closePopup = () => {
    this.setState({ complaint: {}, popupVisible: false });
  };

  statusColor = (status) => {
    if (status === "Open") {
      return styles.open;
    } else if (status === "In Progress") {
      return styles.progress;
    } else if (status === "Closed") {
      return styles.closed;
    }
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
    authorizedRequestsHandler()
      .get(
        complaintsEndpoint + `?skip=0&limit=${this.limit}&` + stringify(filters)
      )
      .then((res) => {
        if (res.data.length !== 0) {
          this.setState({
            complaintsList: res.data,
            skip: this.limit,
            hasMore: !(res.data.length < this.limit),
          });
        } else if (res.data.length === 0) {
          this.setState({ complaintsList: [] });
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
      status: "",
      searchInput: "",
      hasMore: false,
    });
    authorizedRequestsHandler()
      .get(complaintsEndpoint + `?skip=0&limit=${this.limit}`)
      .then((res) => {
        this.setState({
          complaintsList: res.data,
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
  closeFormPopup = () => {
    this.setState({ editClicked: false });
  };

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (
          this.state.editedDept !== "" &&
          this.state.title !== "" &&
          this.state.concern !== ""
        )
          this.setState({
            submitDisabled: false,
            departmentEmpty: false,
            issueEmpty: false,
            concernEmpty: false,
          });
        if (this.state.editedDept === "") {
          this.setState({ departmentEmpty: true });
        }
        if (this.state.title === "") {
          this.setState({ issueEmpty: true });
        }
        if (this.state.concern === "") {
          this.setState({ concernEmpty: true });
        }
      }
    );
  };

  fileChange = (event) => {
    this.setState({ files: event.target.files });
  };

  submitHandler = (event) => {
    event.preventDefault();
    let formData = new FormData();
    if (this.state.files.length > 0) {
      for (let i = 0; i < this.state.files.length; i++) {
        formData.append(
          "files",
          this.state.files[i],
          this.state.files[i]["name"]
        );
      }
    }
    if (this.state.editedDept !== this.state.initialDept) {
      formData.append("department", this.state.editedDept);
    }
    formData.append("issue", this.state.title);
    formData.append("concern", this.state.concern);
    this.setState({ spinner: true });
    authorizedRequestsHandler()
      .patch(complaintsEndpoint + `/${this.state.id}`, formData)
      .then(async (res) => {
        const array = this.state.complaintsList;
        const index = array.findIndex((ele) => ele._id === this.state.id);
        if (this.state.initialDept !== this.state.editedDept) {
          const user = {};
          const dept = {};
          dept["_id"] = res.data.department;
          user["email"] = res.data.assignedTo;
          await authorizedRequestsHandler()
            .get(userEndpoint + `?skip=0&limit=1&` + stringify(user))
            .then((res) => {
              const userData = res.data[0];
              this.setState({
                userData: { name: userData.name, email: userData.email },
                deptData: userData.department,
              });
            })
            .catch((err) => console.log(err));
          array[index].assignedTo = this.state.userData;
          array[index].department = this.state.deptData;
        }
        array[index].issue = res.data.issue;
        array[index].concern = res.data.concern;
        if (res.data.files.length > 0) {
          array[index].files = res.data.files;
        }
        this.setState({
          editedDept: "",
          title: "",
          formSubmitted: true,
          submitDisabled: true,
          concern: "",
          files: [],
          spinner: false,
          editClicked: false,
        });
        this.handle = setTimeout(() => {
          this.setState({ formSubmitted: false });
        }, 1000);
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

  editComplaint = (id) => {
    const filter = {};
    if (id) {
      filter["_id"] = id;
    }
    authorizedRequestsHandler()
      .get(
        complaintsEndpoint + `?skip=0&limit=${this.limit}&` + stringify(filter)
      )
      .then((res) => {
        this.setState({
          id: res.data[0]._id,
          initialDept: res.data[0].department._id,
          editedDept: res.data[0].department._id,
          title: res.data[0].issue,
          concern: res.data[0].concern,
          editClicked: true,
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

  deleteComplaint = () => {
    authorizedRequestsHandler()
      .delete(complaintsEndpoint + `/${this.state.deletionId}`)
      .then((res) => {
        let arr = this.state.complaintsList;
        for (let i in arr) {
          if (arr[i]._id === this.state.deletionId) {
            arr.splice(i, 1);
            break;
          }
        }
        this.setState({
          complaintsList: this.state.complaintsList,
          deletePopupVisible: false,
        });
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

  showDeletePopup = (id) => {
    this.setState({ deletePopupVisible: true, deletionId: id });
  };

  closeDeletePopup = () => {
    this.setState({ deletePopupVisible: false });
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
        <tr className={errorStyles.errorContainer}>
          <td className={errorStyles.error}>
            <i className="fa fa-exclamation-triangle"></i>Complaint List can't
            be loaded.
          </td>
        </tr>
      );
    } else if (this.state.complaintsList.length === 0)
      tableData = (
        <tr>
          <td>Table has no data.</td>
        </tr>
      );
    else {
      let count = this.state.complaintsList;
      tableData = count.map((complaint) => {
        return (
          <tr key={complaint._id}>
            <td>{complaint.department.department}</td>
            <td>
              <button
                className={styles.issueId}
                onClick={() => {
                  this.setState({ complaint: complaint, popupVisible: true });
                }}
              >
                {complaint.issueId}
              </button>
            </td>
            <td>{complaint.assignedTo.name}</td>
            <td className={this.statusColor(complaint.status)}>
              {complaint.status}
            </td>
            <td>
              <i
                className={["fa fa-edit", styles.edit].join(" ")}
                onClick={() => this.editComplaint(complaint._id)}
              ></i>
              <i
                className={["fa fa-times", styles.delete].join(" ")}
                onClick={() => this.showDeletePopup(complaint._id)}
              ></i>
            </td>
          </tr>
        );
      });
    }

    return (
      <div className={styles.complaintsList}>
        {this.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4>Your Complaints</h4>
        <div className={sharedStyles.filterFields}>
          <div className={dropdownStyles.dropdown}>
            <Dropdown
              name="department"
              value={this.state.department}
              change={this.handleFilterChange}
              array={this.props.deptArray}
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
          <div className={[sharedStyles.search, styles.search].join(" ")}>
            <input
              type="text"
              placeholder="Enter Issue ID"
              name="searchInput"
              value={this.state.searchInput}
              onChange={this.handleFilterChange}
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
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Issue Id</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <InfiniteScroll
              loadMore={() => this.getComplaints(this.state.skip)}
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
        {this.state.deletePopupVisible ? (
          <DeleteAssurancePopup
            name="Complaint"
            message="Are you sure you want to delete this complaint?"
            delete={this.deleteComplaint}
            cancel={this.closeDeletePopup}
            class={styles.deletePopup}
          />
        ) : null}
        {this.state.editClicked ? (
          <EditComplaintPopup
            dept={this.state.editedDept}
            issue={this.state.title}
            concern={this.state.concern}
            handleChange={this.handleChange}
            deptArray={this.props.deptArray}
            fileChange={this.fileChange}
            closePopup={this.closeFormPopup}
            clicked={(event) => {
              this.submitHandler(event);
            }}
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

export default connect(null, mapDispatchToProps)(UserComplaintList);
