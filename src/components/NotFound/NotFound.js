import React from 'react';
import styles from './NotFound.module.css';
import notFound from '../../Images/NotFound.jpg';
import { connect } from "react-redux";
import {Route,Redirect} from 'react-router-dom';

const NotFound = (props) =>(
    <Route {...props.routeProps} render={() => (
        
        (props.token&&props.token.access_token)? (
            <div className={styles.notfound}>
            <img src={notFound} alt="Page Not Found"/>
            <p>You have wandered to the wrong page.</p>
             </div>
            ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} /> )
        )} />
)

const mapStateToProps = (state, ownProps) => {
    return {
        token:state.auth.token,
        location: ownProps.path,
        routeProps: {
            exact: ownProps.exact,
            path: ownProps.path
        }
    };
};

export default connect(mapStateToProps)(NotFound);