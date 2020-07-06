import React from "react";
import { Route, Redirect } from "react-router-dom";

const RouteComponent = (props) => (
  <Route
    render={() =>
      props.condition ? (
        <div>{props.data}</div>
      ) : (
        <Redirect
          to={{
            pathname: props.pathname
          }}
        />
      )
    }
  />
);

export default RouteComponent;
