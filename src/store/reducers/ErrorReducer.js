import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  redirectError: false
};

const redirectError = (state, action) => {
  return updateObject(state, {
    redirectError:action.error
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REDIRECT_ERROR:
      return redirectError(state, action);
    default:
      return state;
  }
};
export default reducer;
