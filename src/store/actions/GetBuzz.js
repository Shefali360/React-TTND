import * as actionTypes from "./actionTypes";
import {authorizedRequestsHandler} from '../../APIs/APIs';
import {buzzLikeEndpoint} from '../../APIs/APIEndpoints'
import {adminEndpoint} from '../../APIs/APIEndpoints';

export const liked = (data) => {
  return {
    type: actionTypes.LIKED
  };
};

export const unliked = (err) => {
  return {
    type: actionTypes.UNLIKED
  };
}; 

export const userID = (id) => {
        return (dispatch) => {
            console.log(buzzdata);
            authorizedRequestsHandler()
            .patch(buzzLikeEndpoint+`/${buzzdata.buzz._id}`, null)
            .then((res) => {
                dispatch(liked());
            })
            .catch((err) => {
                dispatch(unliked());
          });
};
}