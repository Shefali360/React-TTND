import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const data=localStorage.getItem("userData")?JSON.parse(localStorage.getItem("userData")):null;
const initialState = {
  data:data
};

const userDataReceived = (state, action) => {
  return updateObject(state, {
   data:action.userData
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_DATA_RECEIVED:
      return userDataReceived(state, action);
    default:
      return state;
  }
};
export default reducer;