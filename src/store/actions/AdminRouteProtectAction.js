import * as actionTypes from "./actionTypes";
import {authorizedRequestsHandler} from '../../APIs/APIs';
import {adminEndpoint} from '../../APIs/APIEndpoints';

export const isAdmin = (data) => {
  return {
    type: actionTypes.IS_ADMIN,
    data: data,
  };
};

export const isNotAdmin = (err) => {
  return {
    type: actionTypes.IS_NOT_ADMIN,
    error: err,
  };
}; 

export const checkAdmin = () => {
  return (dispatch) => {
       authorizedRequestsHandler().get(adminEndpoint)
      .then((response) => {
        localStorage.setItem("adminPrivilege",response.data);
        dispatch(isAdmin(response.data));
      })
      .catch((error) => {
        dispatch(isNotAdmin(error));
      });
  };
};


