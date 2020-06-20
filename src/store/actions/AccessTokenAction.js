import * as actionTypes from "./actionTypes";
import * as queryString from "query-string";
import {authenticatedRequestsHandler} from '../../APIs/APIs';
import {authTokenEndpoint} from '../../APIs/APIEndpoints';

export const tokenReceived = (data) => {
  return {
    type: actionTypes.TOKEN_RECEIVED,
    data: data,
  };
};

export const tokenReceiveFailed = (err) => {
  return {
    type: actionTypes.TOKEN_RECEIVE_FAILED,
    error: err,
  };
};

export const fetchToken = () => {
  const urlParams = queryString.parse(window.location.search);
  return (dispatch) => {
    authenticatedRequestsHandler()
      .get(
        authTokenEndpoint+`/${encodeURIComponent(urlParams.code)}`
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


