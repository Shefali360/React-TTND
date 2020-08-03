import React, { Component } from "react";
import styles from "./MyDescription.module.css";
import {
  serverURI,
  pictureURI,
  updateProfileEndpoint,
  updateProfilePictureEndpoint,
} from "../../../APIs/APIEndpoints";
import EditProfile from "../../../components/EditProfilePopup/EditProfilePopup";
import Spinner from "../../../components/Spinner/Spinner";
import SmallSpinner from "../../../components/SmallSpinner/SmallSpinner";
import { authorizedRequestsHandler } from "../../../APIs/APIs";
import {
  userEndpoint,
  followOrUnfollowUserEndpoint
} from "../../../APIs/APIEndpoints";
import { getUserData } from "../../../store/actions/index";
import { connect } from "react-redux";
import buzzStyles from "../../BuzzPage/CreateBuzz/CreateBuzz.module.css";
import { stringify } from "querystring";

class MyDescription extends Component {
  state = {
    popupVisible: false,
    name: "",
    dob: "",
    phone: "",
    picture: "",
    followed:[],
    followedArr:[],
    followText: "Follow",
    follow: 0,
    updateAction: false,
    followedCount:0
  };

  followedCounting=async()=>{
    const filter = {};
    filter["email"] = this.props.user.email;
    await authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=1&` + stringify(filter))
      .then((res) => {
        this.setState({
          // userId: res.data[0],
          followedArr:res.data[0].followed
        });
      })
      .catch((err) => {
        this.errorHandler(err);
      });
      console.log(this.state.followedArr);
    this.setState({followedCount:this.state.followedArr.length})
  }


  componentDidMount=()=>{
    this.followedCounting();
  }
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

  patchDescriptionEndpoint = (endpoint, data) => {
    return authorizedRequestsHandler().patch(endpoint, data);
  };

  updateDesc = (endpoint, formData, profile) => {
    this.patchDescriptionEndpoint(endpoint, formData)
      .then((res) => {
        const token = JSON.parse(localStorage.getItem("token"));
        token["id_token"] = res.data;
        localStorage.setItem("token", JSON.stringify(token));
        this.props.getUserData();
        this.props.getUser();
        if (profile === 1) {
          this.setState({ popupVisible: false });
        }
        this.setState({ spinner: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ spinner: false });
        this.errorHandler(err);
      });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  closePopup = () => {
    this.setState({ popupVisible: false });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const formData = {
      name: this.state.name,
      dob: this.state.dob && this.state.dob,
      phone: this.state.phone && this.state.phone,
    };
    this.setState({ spinner: true });
    this.updateDesc(updateProfileEndpoint, formData, 1);
  };

  editProfile = () => {
    this.setState({
      popupVisible: true,
      name: this.props.name,
      dob: this.props.dob && this.props.dob,
      phone: this.props.phone && this.props.phone,
    });
  };

  fileChange = (event) => {
    this.setState({ picture: event.target.files });
  };

  uploadPicture = () => {
    let formData = new FormData();
    console.log(this.state.picture);
    if (this.state.picture) {
      formData.append(
        "picture",
        this.state.picture[0],
        this.state.picture[0]["name"]
      );
      this.setState({ spinner: true });
      formData && this.updateDesc(updateProfilePictureEndpoint, formData);
    }
  };

  followOrUnfollowUser = async () => {
    this.setState({ updateAction: true });
    const filter = {};
    filter["email"] = this.props.user.email;
    await authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=1&` + stringify(filter))
      .then((res) => {
        this.setState({
          // userId: res.data[0],
          followed:res.data[0].followed
        });
      })
      .catch((err) => {
        this.errorHandler(err);
      });
    const arr = this.state.followed.filter(
      (name) => name === this.props.name
    );
    if (arr.length === 1) {
      this.setState({ follow: 1, followText: "Unfollow" });
    }
    if (this.state.follow === 0) {
      authorizedRequestsHandler()
        .patch(followOrUnfollowUserEndpoint + `/${this.props.name}`, null)
        .then((res) => {
          console.log(res);
          this.setState({
            follow: 1,
            followText: "Unfollow",
            updateAction: false,
          });
        })
        .catch((err) => {
          this.errorHandler(err);
        });
    } else if (this.state.follow === 1) {
      authorizedRequestsHandler()
        .patch(followOrUnfollowUserEndpoint + `/${this.props.name}?reverse=1`, null)
        .then((res) => {
          this.setState({
            follow: 0,
            followText: "Follow",
            updateAction: false,
          });
        })
        .catch((err) => {
          this.errorHandler(err);
        });
    }
  };

  render() {
    let description = null;
    if (this.props.spinner) {
      description = <Spinner />;
    } else {
      description = (
        <div className={styles.descBox}>
          {this.props.email === this.props.user.email ? (
            <i
              className={["fa fa-edit", styles.edit].join(" ")}
              onClick={this.editProfile}
              title="Edit Profile"
            />
          ) : null}
          <div className={styles.picture}>
            <img
              className={styles.profilePic}
              src={
                serverURI +
                pictureURI +
                "/" +
                encodeURIComponent(this.props.picture)
              }
              alt="Profile Pic"
            />
            <div className={buzzStyles.imageUpload}>
              <input
                files={this.state.picture}
                type="file"
                name="picture"
                className={buzzStyles.file}
                accept="image/x-png,image/jpg,image/jpeg"
                onChange={this.fileChange}
              />
              <div className={buzzStyles.fakeUpload}>
                {this.props.email === this.props.user.email ? (
                  <i
                    className={["fa fa-plus-circle", styles.editPic].join(" ")}
                    title="Edit Profile Picture"
                  />
                ) : null}
              </div>
            </div>
            {this.props.email === this.props.user.email ? (
              <i
                className={["fa fa-check", styles.check].join(" ")}
                onClick={this.uploadPicture}
                title="Upload Profile Picture"
              />
            ) : null}
            {this.state.spinner ? <SmallSpinner /> : null}
          </div>
          <div className={styles.description}>
            <h2>{this.props.name}</h2>
            <h3>{this.props.role}</h3>
            <ul>
              <li>
                <i className="fa fa-envelope" />
                {this.props.email}
              </li>
              {this.props.department ? (
                <li>
                  <i className="fa fa-building-o" />
                  {this.props.department}
                </li>
              ) : null}
              {this.props.dob ? (
                <li>
                  <i className="fa fa-birthday-cake" />
                  {this.props.dob}
                </li>
              ) : null}
              {this.props.phone ? (
                <li>
                  <i className="fa fa-phone" />
                  {this.props.phone}
                </li>
              ) : null}
            </ul>
            {this.props.email !== this.props.user.email ? (
              <button
                className={
                  styles.follow +
                  " " +
                  (this.state.updateAction ? styles.disableClick : null)
                }
                onClick={this.followOrUnfollowUser}
              >
                {this.state.followText}
              </button>
            ) : <button className={styles.following+" "+styles.follow}>Following ({this.state.followedCount})</button>}
            {this.state.updateAction ? <SmallSpinner /> : null}
          </div>
          {this.state.popupVisible ? (
            <EditProfile
              close={this.closePopup}
              name={this.state.name}
              dob={this.state.dob}
              phone={this.state.phone}
              handleChange={this.handleChange}
              spinner={this.state.spinner}
              clicked={(event) => this.submitHandler(event)}
            />
          ) : null}
        </div>
      );
    }
    return (
      <div className={styles.profile}>
        <h4>{this.props.heading}</h4>
        {description}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: () => dispatch(getUserData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDescription);
