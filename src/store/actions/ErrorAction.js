import * as actionTypes from "./actionTypes";

export const redirectError = () => {
    return {
      type: actionTypes.REDIRECT_ERROR,
      error:true
    };
  };

export const errorOccurred = () => {
  return (dispatch) => {
      dispatch(redirectError());
  }
};
