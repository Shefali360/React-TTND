import * as actionTypes from "./actionTypes";
import * as queryString from "query-string";
import {authenticatedRequestsHandler} from '../../APIs/APIs';
import {signupEndpoint,signinEndpoint} from '../../APIs/APIEndpoints';


export const tokenReceived = (data) => {
  return {
    type: actionTypes.TOKEN_RECEIVED,
    data: data,
  };
};

export const tokenReceiveFailed = (error) => {
  return {
    type: actionTypes.TOKEN_RECEIVE_FAILED,
    error:error
  };
};

export const fetchToken = () => {
  const urlParams = queryString.parse(window.location.search);
  const endpointName=localStorage.getItem("endpoint");
  let route=null;
  if(endpointName==="signup"){
    route=signupEndpoint;
  }else{
    route=signinEndpoint;
  }
  return (dispatch) => {
    authenticatedRequestsHandler()
      .get(
        route +`/${encodeURIComponent(urlParams.code)}`
      )
      .then((response) => {
        localStorage.setItem("token",JSON.stringify(response.data));
        dispatch(tokenReceived(response.data));
      })
      .catch((error) => {
        dispatch(tokenReceiveFailed(error));
      });
  };
}


