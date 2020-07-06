import React from "react";
import { connect } from "react-redux";
import RouteConfig from "../Config/RouteConfig/RouteConfig";

const AuthenticatedAdminRoute = (props) => {
  return (
    <RouteConfig
      condition={
        props.user &&
        ( props.user.role === "SuperAdmin")
      }
      pathname="/buzz"
      data={props.children}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

export default connect(mapStateToProps)(AuthenticatedAdminRoute);
