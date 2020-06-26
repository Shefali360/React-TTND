import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import Loader from "../../../components/Loader/Loader";
import RecentBuzz from "./RecentBuzzFile/RecentBuzz";
import styles from "./RecentBuzz.module.css";
import InfiniteScroll from "react-infinite-scroller";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import { buzzEndpoint } from "../../../APIs/APIEndpoints";
import { errorOccurred } from "../../../store/actions";
import Dropdown from "../../../components/Dropdown/Dropdown";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import sharedStyles from "../../../containers/ResolvedPage/AllComplaintsList/AllComplaintsList.module.css";
import { stringify } from "query-string";

class RecentBuzzData extends Component {
  state = {
    buzz: [],
    error: false,
    skip: 0,
    hasMore: false,
    spinner: true,
    networkErr: false,
    category:'',
    filters:{}

  };

  limit = 5;
 categoryArray = [
    { value: "", name: "Choose Category" },
    { value: "Activity buzz", name: "Activity" },
    { value: "Lost and Found buzz", name: "Lost and Found" }
  ];

  getBuzz = (skip) => {
    authorizedRequestsHandler()
      .get(buzzEndpoint + `?skip=${skip}&limit=${this.limit}`)
      .then((res) => {
        const buzz = Array.from(this.state.buzz);
        buzz.push(...res.data);
        this.setState({
          buzz: buzz,
          skip: skip + 5,
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
    this.getBuzz(this.state.skip);
  }

  componentDidUpdate(prevProps) {
    if (this.props.submitted.submitted > prevProps.submitted.submitted) {
      this.setState({ buzz: [], spinner: true, hasMore: false });
      this.getBuzz(0);
    }
  }

  handleFilterChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  applyFilters = () => {
    const filters = {};
    if (this.state.category) {
      filters["category"] = this.state.category;
    }
    this.setState({ filters: filters, skip: 0, hasMore: false });
    authorizedRequestsHandler()
      .get(
        buzzEndpoint + `?skip=0&limit=${this.limit}&` + stringify(filters)
      )
      .then((res) => {
        if (res.data.length !== 0) {
          this.setState({
            buzz: res.data,
            skip: this.limit,
            hasMore: !(res.data.length < this.limit),
          });
        } else if (res.data.length === 0) {
          this.setState({ buzz: [] });
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
      category: "",
      hasMore: false,
    });
    authorizedRequestsHandler()
      .get(buzzEndpoint + `?skip=0&limit=${this.limit}`)
      .then((res) => {
        this.setState({
          buzz: res.data,
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
  render() {
    let buzzData = null;
    if (this.state.spinner) {
      buzzData = <Spinner />;
    } else if (this.state.error) {
      buzzData = (
        <div className={styles.errorContainer}>
          <i className={["fa fa-exclamation-triangle", styles.error].join(" ")}>
            <span>Buzz data can't be loaded!</span>
          </i>
        </div>
      );
    } else if (this.state.buzz.length === 0) {
      buzzData = (
        <p>No buzz going around.You need to post something to create one!</p>
      );
    } else {
      let count = this.state.buzz;
      buzzData = count.map((buzz) => {
        const todayDate = new Date();
        const time = todayDate.getTime();
        let dur = time - buzz.createdOn;
        let date= new Date(buzz.createdOn);
        const dayNum = date.getDate();
        const dayFormat = dayNum < 10 ? "0" + dayNum : dayNum;
        const month = date.getMonth() + 1;
        const monthFormat = month < 10 ? "0" + month : month;
        const year = date.getFullYear();
        let imageData = [];
        let altData = null;
        if (buzz.images.length !== 0) {
          imageData = buzz.images;
        }
        if (buzz.images.length !== 0) {
          altData = buzz.images;
        }
        return (
          <li key={buzz._id}>
            <RecentBuzz
              buzz={buzz}
              dayFormat={dayFormat}
              monthFormat={monthFormat}
              duration={dur}
              images={imageData}
              alt={altData}
              yearFormat={year}
            />
          </li>
        );
      });
    }
    return (
      <div className={styles.mainDiv}>
        {this.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <h4 className={styles.heading}>
          <i className="fa fa-at"></i>Recent Buzz
        </h4>
        <div className={styles.filterBar}>
          <div className={sharedStyles.search}>
          <input
              type="text"
              placeholder="Search any user.."
              name="searchInput"
              // value={this.state.searchInput}
              // onChange={this.handleFilterChange}
            />
            </div>
            <div>
          <div className={dropdownStyles.dropdown}>
            <Dropdown
              name="category"
              value={this.state.category}
              change={this.handleFilterChange}
              array={this.categoryArray}
            />
          </div>
          <i
            className={["fa fa-check", sharedStyles.check,styles.filterButtons].join(" ")}
            onClick={this.applyFilters}
            title="Apply Filters"
          ></i>
           <i
            className={["fa fa-undo", sharedStyles.undo,styles.filterButtons].join(" ")}
            onClick={this.resetFilters}
            title="Reset Filters"
          ></i>
          </div>
      </div>
        <ul className={styles.List}>
          <InfiniteScroll
            loadMore={() => this.getBuzz(this.state.skip)}
            hasMore={this.state.hasMore}
            loader={<Loader key={1} />}
            useWindow={false}
            initialLoad={false}
          >
            {buzzData}
          </InfiniteScroll>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    errorOccurred: () => dispatch(errorOccurred()),
  };
};

export default connect(null, mapDispatchToProps)(RecentBuzzData);
