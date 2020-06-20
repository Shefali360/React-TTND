import React, { Component } from "react";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import styles from "./AllComplaintsList.module.css";
import sharedStyles from "../../ComplaintPage/ComplaintList/ComplaintList.module.css";
import { connect } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import ComplaintPopup from "../../../components/ComplaintPopup/ComplaintPopup";
import {stringify} from "query-string";
import InfiniteScroll from 'react-infinite-scroller';
import errorStyles from '../../BuzzPage/RecentBuzz/RecentBuzzFile/RecentBuzz.module.css';
import SmallSpinner from "../../../components/SmallSpinner/SmallSpinner";
import Dropdown from '../../../components/Dropdown/Dropdown';
import {authorizedRequestsHandler} from '../../../APIs/APIs';
import {allComplaintsEndpoint} from '../../../APIs/APIEndpoints';
import {complaintsEndpoint} from '../../../APIs/APIEndpoints';
import { errorOccurred } from "../../../store/actions";
import Loader from '../../../components/Loader/Loader';

class AllComplaintsList extends Component {
  state = {
    popupVisible: false,
    value: "",
    id: null,
    issueId: null,
    allComplaintsList: [],
    descriptionPopupVisible: false,
    complaint: {},
    estimatedTime: {
      count: 0,
      timeType: "hours",
      status: "",
    },
    department:'',
    status:'',
    search:'',
    searchInput:'',
    filters:{},
    submitDisabled: true,
    skip:0,
    formSubmitted:false,
    spinner:true,
    requesting:false,
    countEmpty:false,
    networkErr:false
  };
  limit=10;
  departmentArray=[{value:"",name:"Department"},{value:"Admin",name:"Admin"},{value:"IT",name:"IT"},{value:"HR",name:"HR"},{value:"Infra",name:"Infra"}];
  statusArray=[{value:"",name:"Status"},{value:"Open",name:"Open"},{value:"In Progress",name:"In Progress"},{value:"Closed",name:"Closed"}];
  searchArray=[{value:"",name:"Search By"},{value:"issueId",name:"Issue id"},{value:"lockedBy",name:"Locked By"}];
  timeTypeArray=[{value:"hours",name:"hours"},{value:"days",name:"days"},{value:"weeks",name:"weeks"},{value:"months",name:"months"}]

  componentDidMount() {
    this.getAllComplaintsList();
    
   }

  getAllComplaintsList=()=>{
   authorizedRequestsHandler()
    .get(allComplaintsEndpoint+`?skip=${this.state.skip}&limit=${this.limit}&`+stringify(this.state.filters))
    .then((res) => {
      const allComplaintsList = Array.from(this.state.allComplaintsList);
      allComplaintsList.push(...res.data);
      this.setState({
      allComplaintsList:allComplaintsList,
      skip:this.state.skip + 10,
      hasMore:!(res.data.length<this.limit),
      spinner:false
    })
    })
    .catch((err) => {
      this.setState({ error: true,spinner:false });
      const errorCode=err.response.data.errorCode;
      if(errorCode==="INVALID_TOKEN"){
         this.props.errorOccurred();
      }
      if(err.response.status===500){
        this.setState({networkErr:true});
      }
    });
  }

  handleEstimatedTimeChange = (event) => {
    const estimatedTime = { ...this.state.estimatedTime };
    estimatedTime[event.target.name] = event.target.value;
     this.setState(
      {
        estimatedTime: estimatedTime,
      },
      () => {
        
        if (
         this.state.estimatedTime.count !== "" &&
          this.state.estimatedTime.timeType !== ""
        )
         { this.setState({ submitDisabled: false,countEmpty:false });}
        if (this.state.estimatedTime.count === "")
          { this.setState({ countEmpty:true });}
      }
    
    );
  };

  handleFilterChange=(event)=>{
    this.setState({
      [event.target.name]:event.target.value
    })
  }

  applyFilters=()=>{
    const filters={};
  
    if(this.state.department){
      filters["department"]=this.state.department;
    }
    if(this.state.status){
      filters["status"]=this.state.status;
    }
    if(this.state.search){
      this.state.search==="issueId"?filters[this.state.search]=this.state.searchInput.trim().toUpperCase():filters[this.state.search]=this.state.searchInput.trim();
    }
     this.setState({filters:filters,skip:0,hasMore:false});
    
   authorizedRequestsHandler()
      .get(allComplaintsEndpoint+`?skip=0&limit=${this.limit}&`+stringify(filters))
      .then((res) => {
     
        if (res.data.length !== 0) {
          this.setState({
          allComplaintsList: res.data,
          skip:this.limit,
          hasMore:!(res.data.length < this.limit)
        });}else if (res.data.length === 0) {
          this.setState({ complaintsList: []})
        }
      })
      .catch((err) => {
         this.setState({ error: true });
         const errorCode=err.response.data.errorCode;
         if(errorCode==="INVALID_TOKEN"){
            this.props.errorOccurred();
         }
        if(err.response.status===500){
          this.setState({networkErr:true});
        }
      });
  }

  resetFilters=()=>{
     this.setState({filters:{},department:"",status:"",searchInput:"",search:"",hasMore:false});
   authorizedRequestsHandler()
      .get(allComplaintsEndpoint+`?skip=0&limit=${this.limit}`)
      .then((res) => {
        this.setState({
          allComplaintsList: res.data,
          skip:this.limit,
          hasMore:!(res.data.length < this.limit)
        });
      })
      .catch((err) => {
         this.setState({ error: true });
         const errorCode=err.response.data.errorCode;
         if(errorCode==="INVALID_TOKEN"){
            this.props.errorOccurred();
         }
        if(err.response.status===500){
          this.setState({networkErr:true});
        }
      });
  }
  submitHandler = (event) => {
    event.preventDefault();
    const formData = {
      estimatedTime: {
        count: this.state.estimatedTime.count,
        timeType: this.state.estimatedTime.timeType,
      },
      status: this.state.value,
    };
     this.setState({requesting:true});
   authorizedRequestsHandler()
      .patch(complaintsEndpoint+`/${this.state.id}`, formData)
      .then((res) => {
        this.setState({
          formSubmitted: true,
          popupVisible:false,
          submitDisabled: true,
          estimatedTime: { count: 0, timeType: "hours" },
          requesting:false
        });
        setTimeout(() => {this.setState({formSubmitted: false});}, 1000);
      })
      .catch((err) => {
        const errorCode=err.response.data.errorCode;
        if(errorCode==="INVALID_TOKEN"){
           this.props.errorOccurred();
        }
        if(err.response.status===500){
          this.setState({networkErr:true});
        }
      });
  };

  closeDescriptionPopup = () => {
    this.setState({
      complaint: {},
      descriptionPopupVisible: false,
    });
  };
  openPopupOnDropdownClick = (event, id, issueId) => {
    if (event.target.value=== "In Progress") {
      this.setState({
        popupVisible: true,
        id: id,
        issueId: issueId,
      });
    }
  };
  
  handleChange = (event,id) => {
    if (event.target.value === "In Progress") {
       this.setState({ value: event.target.value });
    } else 
     {
     authorizedRequestsHandler()
        .patch(
          complaintsEndpoint+`/${id}`,
          { status: event.target.value }
        )
        .then((res) => {
         
        })
        .catch((err) => {
          const errorCode=err.response.data.errorCode;
          if(errorCode==="INVALID_TOKEN"){
             this.props.errorOccurred();
          }
          if(err.response.status===500){
            this.setState({networkErr:true});
          }
        });
    }
  };

  statusColor=(status)=>{
    switch (status) {
      case "Open":return styles.open;
      case "In Progress":return styles.progress;
      case "Closed":return styles.closed;
      default:return null;
    }
  }

  hidePopup=()=>{
     this.setState({popupVisible:false});
  }
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
    } else if(this.state.allComplaintsList.length === 0) {
      tableData=(<tr><td>Table has no data.</td></tr>)
    } else {
      let count = this.state.allComplaintsList;
      tableData = count.map((complaint) => {
        return (
          <tr key={complaint._id}>
            <td>{complaint.department}</td>
            <td
              className={styles.issueId}
              onClick={() => {
                this.setState({
                  complaint: complaint,
                  descriptionPopupVisible: true,
                });
              }}
            >
              {complaint.issueId}
            </td>
            <td>{complaint.lockedBy}</td>
            <td colSpan={2}>{complaint.email}</td>
            <td>{complaint.assignedTo}</td>
            <td>
              <div className={dropdownStyles.dropdown}>
                <select
                  defaultValue={complaint.status}
                  ref={this.statusColor}
                  className={this.statusColor(complaint.status)}
                  name="status"
                  onChange={(event)=>this.handleChange(event,complaint._id)}
                  onClick={(event) =>
                    this.openPopupOnDropdownClick(
                      event,
                      complaint._id,
                      complaint.issueId
                    )
                  }
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </td>
          </tr>
        );
      });
    }

    return (
      <div id="card" className={sharedStyles.complaintsList}>
          {(this.state.networkErr)?alert("Please check your internet connection"):null}
        <h4>All Complaints</h4>
        <div className={styles.filterFields}>
       
          <div className={dropdownStyles.dropdown}>
          <Dropdown name="department" value={this.state.department} change={this.handleFilterChange}
                array={this.departmentArray}/>
          </div>
          <div className={dropdownStyles.dropdown}>
          <Dropdown name="status" value={this.state.status} change={this.handleFilterChange}
                array={this.statusArray}/>
          </div>
          <div>
          <div className={styles.search}>
            <input type="search" placeholder="Search" name="searchInput" value={this.state.searchInput} onChange={this.handleFilterChange}/>
            <div className={dropdownStyles.dropdown}>
            <Dropdown name="search" value={this.state.search} change={this.handleFilterChange}
                array={this.searchArray}/>
            </div>
          </div>
          {(this.state.searchInput!==""&&this.state.search===""?<p className={styles.message}>Please select a field to search by.</p>:null)}
          </div>
          <i className={["fa fa-check",styles.check].join(' ')}onClick={this.applyFilters} title="Apply Filters"></i>
          <i className={["fa fa-undo",styles.undo].join(' ')}  onClick={this.resetFilters} title="Reset Filters"></i>
          <div className={styles.mobileButtons}>
          <button className={styles.apply} onClick={this.applyFilters}>Apply Filters</button>
          <button className={styles.reset}onClick={this.resetFilters}>Reset Filters</button>
        </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Department</th>
              <th>Issue Id</th>
              <th>Locked By</th>
              <th colSpan={2}>Logger Email ID</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <InfiniteScroll
              loadMore={()=>this.getAllComplaintsList()}
              hasMore={this.state.hasMore}
              loader={<tr key={1}><td colSpan={4}><Loader/></td></tr>}
              threshold={0.8}
              useWindow={false}
              initialLoad={false}
              element={'tbody'}>
              {tableData||[]}
          </InfiniteScroll>
        </table>
        {this.state.descriptionPopupVisible ? (
          <ComplaintPopup
            complaint={this.state.complaint}
            click={this.closeDescriptionPopup}
          />
        ) : null}
        <div className={styles.overlay +
            " " +
            (this.state.popupVisible ? "null" : styles.display)}>
        <div
          className={
            styles.popup +
            " " +
            (this.state.popupVisible ? "null" : styles.display)
          }
        >
        
            <h5>
              Estimated Time
            </h5>
          <p className={styles.popupIssueId}>{this.state.issueId}</p>
  
          <form className={styles.popupForm}>
            <div className={styles.formdata}>
              <input
                type="text"
                placeholder="Count"
                name="count"
                value={this.state.estimatedTime.count}
                onChange={this.handleEstimatedTimeChange}
              />
              <div className={[dropdownStyles.dropdown,styles.dropdown].join(' ')}>
              <Dropdown class={styles.select} name="timeType" value={this.state.estimatedTime.count} change={this.handleEstimatedTimeChange}
                array={this.timeTypeArray}/>
              </div>
            </div>
            <button
              type="submit"
              value="submit"
              disabled={this.state.submitDisabled}
              onClick={(event) => {
                this.submitHandler(event);
              }}
            >
              Submit
            </button>
            {(this.state.requesting)?<SmallSpinner/>:null}
            {(this.state.formSubmitted)?<i className="fa fa-check"></i>:null}
            {(this.state.countEmpty)?<p className={styles.errormsg}>Please fill in all the fields.</p>:null}
          </form>
        </div>
      </div>
      </div>
    );
  }
}


const mapDispatchToProps=(dispatch)=>{
  return{
    errorOccurred:()=>dispatch(errorOccurred())
  }
  }
export default connect(null,mapDispatchToProps)(AllComplaintsList);
