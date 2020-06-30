import React, { Component } from "react";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class AuthToken extends Component {
  componentDidMount() {
    this.props.onFetchToken();
  }

  render() {
    const validToken = this.props.data && this.props.data.access_token;
    if (validToken) {
      this.props.getUser();
      return <Redirect to="/buzz" />;
    } else if (this.props.tokenError) {
      let error = this.props.tokenError;
      let errorData = null;
      if (error.response) {
        errorData = {
          ...(error.response.data.errorCode && {
            errorCode: error.response.data.errorCode,
          }),
          ...(error.response.data.message && {
            message: error.response.data.message,
          }),
        };
      }
      return (
        <Redirect
          to={{
            pathname: "/login",
            state: errorData,
          }}
        />
      );
    }
    return <Spinner />;
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.auth.token,
    tokenError: state.auth.tokenError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchToken: () => dispatch(actions.fetchToken()),
    getUser:()=>dispatch(actions.getUserData())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthToken);
