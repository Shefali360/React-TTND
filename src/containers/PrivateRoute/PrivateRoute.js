import React from "react";
import { connect } from "react-redux";
import RouteConfig from "../Config/RouteConfig/RouteConfig";

const PrivateRouteComponent = (props) => {
  return (
    <RouteConfig
      condition={props.token && props.token.access_token}
      pathname="/login"
      data={props.children}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(PrivateRouteComponent);
