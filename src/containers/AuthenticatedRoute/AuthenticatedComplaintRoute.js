import React, { Component } from "react";
import { connect } from "react-redux";
import RouteConfig from "../Config/RouteConfig/RouteConfig";

class AuthenticatedAdminRoute extends Component {
   
  render() {
    return (
      <RouteConfig
        condition={
          this.props.user.department
        }
        pathname="/buzz"
        data={this.props.children}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

export default connect(mapStateToProps)(AuthenticatedAdminRoute);
