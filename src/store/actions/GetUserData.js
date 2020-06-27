import * as actionTypes from "./actionTypes";
import * as jwt from 'jsonwebtoken';

export const userDataReceived = (userData) => {
    return {
      type: actionTypes.USER_DATA_RECEIVED,
      userData:userData
    };
  };

export const getUserData = () => {
    const token=JSON.parse(localStorage.getItem("token"));
    const data = jwt.verify(token.id_token, "mQ9YVhVftPSJD6tus58WQDyX");
    localStorage.setItem("userData",JSON.stringify(data));
    return (dispatch) => {
      dispatch(userDataReceived(data));
  }
};
