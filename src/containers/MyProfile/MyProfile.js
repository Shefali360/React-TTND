import React, { Component } from "react";
import MyDescription from "./MyDescription/MyDescription";
import MyBuzz from "./MyBuzz/MyBuzz";
import { authorizedRequestsHandler } from "../../APIs/APIs";
import { userEndpoint } from "../../APIs/APIEndpoints";
import { connect } from "react-redux";
import { stringify } from "querystring";
import { getUserData,errorOccurred } from "../../store/actions/index";

class MyProfile extends Component {
  state = {
    user: {},
    spinner: true,
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

  getUser = () => {
    const filter = {};
    filter["email"] = this.props.userdata.email;
    authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=1&` + stringify(filter))
      .then((res) => {
        this.setState({
          user: res.data[0],
          spinner: false,
        });
      })
      .catch((err) => {
        this.errorHandler(err);
      });
  };

  componentDidMount() {
    this.getUser();
  }

  render() {
    const userdata = this.state.user;
    return (
      <>
        <MyDescription
        heading="My Profile"
          name={userdata.name}
          picture={userdata.picture}
          email={userdata.email}
          role={userdata.role}
          department={userdata.department && userdata.department.department}
          dob={userdata.dob && userdata.dob}
          phone={userdata.phone && userdata.phone}
          spinner={this.state.spinner}
          getUser={this.getUser}
        />
        <MyBuzz />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userdata: state.user.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserData: () => dispatch(getUserData()),
    errorOccurred: () => dispatch(errorOccurred()),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(MyProfile);
