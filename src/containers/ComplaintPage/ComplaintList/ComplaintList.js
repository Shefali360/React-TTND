import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import styles from "./ComplaintList.module.css";
import ComplaintPopup from "../../../components/ComplaintPopup/ComplaintPopup";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import sharedStyles from "../../../containers/ResolvedPage/AllComplaintsList/AllComplaintsList.module.css";
import { stringify } from "query-string";
import InfiniteScroll from "react-infinite-scroller";
import errorStyles from '../../BuzzPage/RecentBuzz/RecentBuzzFile/RecentBuzz';
import Dropdown from '../../../components/Dropdown/Dropdown';
import {authorizedRequestsHandler} from '../../../APIs/APIs';
import {complaintsEndpoint} from '../../../APIs/APIEndpoints';
import { errorOccurred } from "../../../store/actions";
import Loader from '../../../components/Loader/Loader';

class UserComplaintList extends Component {
  state = {
    complaint: {},
    popupVisible: false,
    department: "",
    status: "",
    searchInput: "",
    filters: {},
    complaintsList: [],
    error: false,
    skip: 0,
    spinner:true,
    networkErr:false
  };
  limit = 10;
  departmentArray=[{value:"",name:"Department"},{value:"Admin",name:"Admin"},{value:"IT",name:"IT"},{value:"HR",name:"HR"},{value:"Infra",name:"Infra"}];
  statusArray=[{value:"",name:"Status"},{value:"Open",name:"Open"},{value:"In Progress",name:"In Progress"},{value:"Closed",name:"Closed"}];



  getComplaints = (skip) => {
   authorizedRequestsHandler()
      .get(
        complaintsEndpoint+`?skip=${skip}&limit=${this.limit}&`+stringify(this.state.filters)
      )
      .then((res) => {
        const complaintsList = Array.from(this.state.complaintsList);
        complaintsList.push(...res.data);
       this.setState({complaintsList: complaintsList,
          skip: skip + 10,
          hasMore: !(res.data.length < this.limit),
          spinner:false})
      })
      .catch((err) => {
       this.setState({error: true,spinner:false
        })
        const errorCode=err.response.data.errorCode;
         if(errorCode==="INVALID_TOKEN"){
            this.props.errorOccurred();
         }
        if(err.response.status===500){
         this.setState({networkErr:true});
        }
      
      });
  };
  componentDidMount() {
    this.getComplaints(this.state.skip);
  }

  componentDidUpdate(prevProps) {
    if (this.props.submitted.submitted > prevProps.submitted.submitted){
     this.setState({complaintsList:[],spinner:true,hasMore:false})
      this.getComplaints(0);
    }
  }

  handleFilterChange = (event) => {
    this.setState({ [event.target.name]: event.target.value});
  };

  closePopup = () => {
   this.setState({complaint: {},
      popupVisible: false})
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
   this.setState({ filters: filters,skip:0,hasMore:false})
   authorizedRequestsHandler()
      .get(complaintsEndpoint+`?skip=0&limit=${this.limit}&`+ stringify(filters))
      .then((res) => {
        if (res.data.length !== 0) {
         this.setState({  complaintsList:res.data,skip:this.limit,hasMore:!(res.data.length < this.limit)})
        } else if (res.data.length === 0) {
          this.setState({ complaintsList: []})
        }
      })
      .catch((err) => {
       this.setState({error:true})
       const errorCode=err.response.data.errorCode;
       if(errorCode==="INVALID_TOKEN"){
          this.props.errorOccurred();
       }
        if(err.response.status===500){
         this.setState({networkErr:true});
        }
      });
  };
  resetFilters = () => {
   this.setState({filters: {},skip:0,department:"",status:"",searchInput:"",hasMore:false});
   authorizedRequestsHandler()
      .get(complaintsEndpoint+`?skip=0&limit=${this.limit}`
      )
      .then((res) => {
       this.setState({ complaintsList: res.data,skip:this.limit,hasMore:!(res.data.length < this.limit)})
      })
      .catch((err) => {
        this.setState({error: true})
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
    let tableData = null;
    if(this.state.spinner){
      tableData= 
    <tr>
      <td>
        <Spinner />
      </td>
    </tr>
    }
    else if (this.state.error) {
      tableData = (
        <tr className={errorStyles.errorContainer}>
          <td className={errorStyles.error}><i className="fa fa-exclamation-triangle"></i>Complaint List can't be loaded.</td>
        </tr>
      );
    } else if(this.state.complaintsList.length===0)
    tableData=(<tr><td>Table has no data.</td></tr>)
    else{
      let count = this.state.complaintsList;
      tableData = count.map((complaint) => {
        return (
          <tr key={complaint._id}>
            <td>{complaint.department}</td>
            <td><button
              className={styles.issueId}
              onClick={() => {
               this.setState({ complaint: complaint,
                  popupVisible: true});
              }}
            >
              {complaint.issueId}
            </button>
            </td>
            <td>{complaint.assignedTo}</td>
            <td className={this.statusColor(complaint.status)}>
              {complaint.status}
            </td>
          </tr>
        );
      });
    }
   
    return (
      <div className={styles.complaintsList}>
         {(this.state.networkErr)?alert("Please check your internet connection"):null}
        <h4>Your Complaints</h4>
        <div className={sharedStyles.filterFields}>
          <div className={dropdownStyles.dropdown}>
          <Dropdown name="department" value={this.state.department} change={this.handleFilterChange}
                array={this.departmentArray}/>
          </div>
          <div className={dropdownStyles.dropdown}>
          <Dropdown name="status" value={this.state.status} change={this.handleFilterChange}
                array={this.statusArray}/>
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
            onClick={this.applyFilters} title="Apply Filters"
          ></i>
          <i
            className={["fa fa-undo", sharedStyles.undo].join(" ")}
            onClick={this.resetFilters} title="Reset Filters"
          ></i>
          <div className={sharedStyles.mobileButtons}>
           <button className={sharedStyles.apply} onClick={this.applyFilters}>Apply Filters</button>
          <button className={sharedStyles.reset}onClick={this.resetFilters}>Reset Filters</button>
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
              </tr>
            </thead>
            <InfiniteScroll
              loadMore={() => this.getComplaints(this.state.skip)}
              hasMore={this.state.hasMore}
              loader={
                <tr key={1}>
                  <td colSpan={4}>
                    <Loader/>
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

const mapDispatchToProps=(dispatch)=>{
  return{
    errorOccurred:()=>dispatch(errorOccurred())
  }
  }
  
export default connect(null,mapDispatchToProps)(UserComplaintList);
