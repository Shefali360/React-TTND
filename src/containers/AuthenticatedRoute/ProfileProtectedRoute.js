import React from "react";
import RouteConfig from "../Config/RouteConfig/RouteConfig";

const AuthenticatedAdminRoute = (props) => {
  return (
    <RouteConfig
      condition={
        props.location.state&&props.location.state.email
      }
      pathname="/buzz"
      data={props.children}
    />
  );
};

export default AuthenticatedAdminRoute;

