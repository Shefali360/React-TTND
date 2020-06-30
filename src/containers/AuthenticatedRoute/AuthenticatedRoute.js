import React from 'react';
import { connect } from "react-redux";
import {Route,Redirect} from 'react-router-dom';
const AuthenticatedRoute = (props) => (
 
    <Route {...props.routeProps} render={() => (
   
   (props.user&&(props.user.role==="Admin"||props.user.role==="SuperAdmin"))? (
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
        user:state.user.data
    };
};


export default connect(mapStateToProps)(AuthenticatedRoute);
  