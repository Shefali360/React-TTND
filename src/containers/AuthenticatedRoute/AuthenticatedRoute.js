import React from 'react';
import { connect } from "react-redux";
import {Route,Redirect} from 'react-router-dom';
const AuthenticatedRoute = (props) => (
 
    <Route {...props.routeProps} render={() => (
   
   (props.admin)? (
        <div>{props.children}</div>
        ) : (
        <Redirect to={{
            pathname: '/buzz',
            state: { from: props.location }
        }} /> )
    )} />
);


const mapStateToProps = (state, ownProps) => {
    
    return {
        admin:state.adminCheck.adminPrivilege,
        location: ownProps.path,
        routeProps: {
            exact: ownProps.exact,
            path: ownProps.path
        }
    };
};


export default connect(mapStateToProps)(AuthenticatedRoute);
  