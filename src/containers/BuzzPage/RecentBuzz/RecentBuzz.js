import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import Loader from "../../../components/Loader/Loader";
import RecentBuzz from "./RecentBuzzFile/RecentBuzz";
import styles from "./RecentBuzz.module.css";
import InfiniteScroll from "react-infinite-scroller";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import { buzzEndpoint, buzzUpdateEndpoint } from "../../../APIs/APIEndpoints";
import { errorOccurred } from "../../../store/actions";
import Dropdown from "../../../components/Dropdown/Dropdown";
import dropdownStyles from "../../../components/Dropdown/Dropdown.module.css";
import sharedStyles from "../../../containers/ResolvedPage/AllComplaintsList/AllComplaintsList.module.css";
import { stringify } from "query-string";
import EditBuzzPopup from "../../../components/EditBuzzPopup/EditBuzzPopup";
import DeleteAssurancePopup from "../../../components/DeleteAssurance/DeleteAssurance";

class RecentBuzzData extends Component {
  state = {
    id: null,
    deletionId: null,
    buzz: [],
    error: false,
    skip: 0,
    hasMore: false,
    spinner: true,
    networkErr: false,
    category: "",
    filters: {},
    description: "",
    buzzCategory: "",
    images: [],
    descEmpty: false,
    categoryEmpty: false,
    submitDisabled: true,
    editClicked: false,
    deletePopupVisible: false,
    imageExceeded:false,
    sizeExceeded:false,
    zeroFollowed:false
  };

  limit = 5;
  categoryArray = [
    { value: "", name: "Choose Category" },
    { value: "Activity buzz", name: "Activity" },
    { value: "Lost and Found buzz", name: "Lost and Found" },
  ];

  buzzEndpointToGetBuzz = (skip, filters) => {
    return authorizedRequestsHandler().get(
      buzzEndpoint + `?skip=${skip}&limit=${this.limit}&` + stringify(filters)
    );
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

  fetchBuzz = (skip, filter, filtered) => {
    this.buzzEndpointToGetBuzz(skip, filter)
      .then((res) => {
        let buzz = [];
        if (filtered === 1) {
          if (res.data.length !== 0) {
            buzz = res.data;
          } else if (res.data.length === 0) {
            buzz = [];
          }
        } else {
          buzz = Array.from(this.state.buzz);
          buzz.push(...res.data);
        }
        this.setState({
          buzz: buzz,
          skip: skip + 5,
          hasMore: !(res.data.length < this.limit),
          spinner: false,
        });
      })
      .catch((err) => {
        this.setState({ error: true, spinner: false });
        this.errorHandler(err);
      });
  };

  getBuzz = (skip) => {
    if(this.props.heading==="Friends Buzz"&& this.props.filters.length===0){
      this.setState({zeroFollowed:true,spinner:false});
    }else
     if (this.props.filters){
      let filter = {};
      filter["userId"] = this.props.filters;
      this.fetchBuzz(skip, filter);
    }else {
      this.fetchBuzz(skip, this.state.filters);
    }
  };

  componentDidMount() {
    this.getBuzz(this.state.skip);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.submitted &&
      this.props.submitted.submitted > prevProps.submitted.submitted
    ) {
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
    this.fetchBuzz(0, filters, 1);
  };

  resetFilters = () => {
    this.setState({
      filters: {},
      skip: 0,
      category: "",
      hasMore: false,
    });
    this.fetchBuzz(0, "", 1);
  };

   closePopup = () => {
    this.setState({ singleBuzz: {}, editClicked: false });
  };

  fileChange = (event) => {
    this.setState({ images: event.target.files },()=>{
      if(this.state.images.length<5){
        this.setState({
          imageExceeded:false
        })
      }
      if(this.state.images.length>5){
        this.setState({
          imageExceeded:true
        })
      }
      for(let i=0;i<this.state.images.length;i++){
        if(this.state.images[i].size<1048576){
          this.setState({
            sizeExceeded:false
          })
        }else{
          this.setState({
          sizeExceeded:true
          })
        }
        }
    });
  };

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (this.state.description !== "" && this.state.buzzCategory !== "") {
          this.setState({
            submitDisabled: false,
            descEmpty: false,
            categoryEmpty: false,
          });
        }
        if (this.state.description === "") {
          this.setState({ descEmpty: true });
        }
        if (this.state.buzzCategory === "") {
          this.setState({ categoryEmpty: true });
        }
      }
    );
  };

  submitHandler = (event) => {
    event.preventDefault();
    let formData = new FormData();
    if (this.state.images.length > 0) {
      for (let i = 0; i < this.state.images.length; i++) {
        formData.append(
          "images",
          this.state.images[i],
          this.state.images[i]["name"]
        );
      }
    }
    formData.append("description", this.state.description);
    formData.append("category", this.state.buzzCategory);
    this.setState({ spinner: true });
    authorizedRequestsHandler()
      .patch(buzzUpdateEndpoint + `/${this.state.id}`, formData)
      .then((res) => {
        const array = this.state.buzz;
        const index = array.findIndex((ele) => ele._id === this.state.id);
        array[index].description = res.data.description;
        array[index].category = res.data.category;
        if (res.data.images.length > 0) {
          array[index].images = res.data.images;
        }
        this.setState({
          buzz: array,
          description: "",
          buzzCategory: "",
          formSubmitted: true,
          submitDisabled: true,
          spinner: false,
          editClicked: false,
        });
        setTimeout(() => {
          this.setState({ formSubmitted: false });
        }, 1000);
      })
      .catch((err) => {
        this.setState({ spinner: false });
        this.errorHandler(err);
      });
  };

  editPost = (id) => {
    const filter = {};
    if (id) {
      filter["_id"] = id;
    }
    this.buzzEndpointToGetBuzz(0, filter)
      .then((res) => {
        this.setState({
          id: res.data[0]._id,
          buzzCategory: res.data[0].category,
          description: res.data[0].description,
          editClicked: true,
        });
      })
      .catch((err) => {
        this.setState({ error: true });
        this.errorHandler(err);
      });
  };

  showDeletePopup = (id) => {
    this.setState({ deletePopupVisible: true, deletionId: id });
  };

  closeDeletePopup = () => {
    this.setState({ deletePopupVisible: false });
  };

  deletePost = () => {
    this.setState({spinner:true})
    authorizedRequestsHandler()
      .delete(buzzEndpoint + `/${this.state.deletionId}`)
      .then((res) => {
        let arr = this.state.buzz;
        for (let i in arr) {
          if (arr[i]._id === this.state.deletionId) {
            arr.splice(i, 1);
            break;
          }
        }
        this.setState({
          buzz: this.state.buzz,
          deletePopupVisible: false,
          spinner: false,
        });
      })
      .catch((err) => {
        this.errorHandler(err);
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
    }else if(this.state.zeroFollowed){
      buzzData=<p>Follow people to look at their buzz...</p>
    }else if (this.state.buzz.length === 0) {
      buzzData = (
        <p>No buzz going around.You need to post something to create one!</p>
      );
    }else {
      let buzz = this.state.buzz;
      buzzData = buzz.map((buzz) => {
        const todayDate = new Date();
        const time = todayDate.getTime();
        let dur = time - buzz.createdOn;
        let date = new Date(buzz.createdOn);
        const dayNum = date.getDate();
        const dayFormat = dayNum < 10 ? "0" + dayNum : dayNum;
        const month = date.getMonth() + 1;
        const monthFormat = month < 10 ? "0" + month : month;
        const year = date.getFullYear();
        let imageData = [];
        let altData = null;
        if (buzz.images && buzz.images.length !== 0) {
          imageData = buzz.images;
        }
        if (buzz.images && buzz.images.length !== 0) {
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
              editClick={() => this.editPost(buzz._id)}
              show={() => this.showDeletePopup(buzz._id)}
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
          <i className="fa fa-at"></i>
          {this.props.heading}
        </h4>
        <div className={styles.filterBar}>
          {/* <div className={sharedStyles.search}>
            <input
              type="text"
              placeholder="Search any user.."
              name="searchInput"
              // value={this.state.searchInput}
              // onChange={this.handleFilterChange}
            />
          </div> */}
          {!this.props.filters ? (
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
                className={[
                  "fa fa-check",
                  sharedStyles.check,
                  styles.filterButtons,
                ].join(" ")}
                onClick={this.applyFilters}
                title="Apply Filters"
              ></i>
              <i
                className={[
                  "fa fa-undo",
                  sharedStyles.undo,
                  styles.filterButtons,
                ].join(" ")}
                onClick={this.resetFilters}
                title="Reset Filters"
              ></i>
            </div>
          ) : null}
        </div>
        <ul className={styles.List}>
          <InfiniteScroll
            loadMore={() => this.getBuzz(this.state.skip)}
            hasMore={this.state.hasMore}
            loader={<Loader key={1} />}
            useWindow={false}
            initialLoad={false}
          >
            {buzzData || []}
          </InfiniteScroll>
        </ul>
        {this.state.deletePopupVisible ? (
          <DeleteAssurancePopup
            name="Buzz"
            message="Are you sure you want to delete this post?"
            delete={this.deletePost}
            cancel={this.closeDeletePopup}
            class={styles.deletePopup}
            spinner={this.state.spinner}
          />
        ) : null}
        {this.state.editClicked ? (
          <EditBuzzPopup
            description={this.state.description}
            category={this.state.buzzCategory}
            descEmpty={this.state.descEmpty}
            categoryEmpty={this.state.categoryEmpty}
            spinner={this.state.spinner}
            submitDisabled={this.state.submitDisabled}
            images={this.state.images}
            imageExceeded={this.state.imageExceeded}
            sizeExceeded={this.state.sizeExceeded}
            change={this.handleChange}
            fileChange={this.fileChange}
            closePopup={this.closePopup}
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

export default connect(null, mapDispatchToProps)(RecentBuzzData);
