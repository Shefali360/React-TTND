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
            // const buzzdata= {
            //     buzz:buzz
            // };
            console.log(buzzdata);
            authorizedRequestsHandler()
            .patch(buzzLikeEndpoint+`/${buzzdata.buzz._id}`, null)
            .then((res) => {
                dispatch(liked());
            })
            .catch((err) => {
                dispatch(unliked());
            // const errorCode=err.response.data.errorCode;
            // if(errorCode==="INVALID_TOKEN"){
            //    this.props.errorOccurred();
            // }
            // if(err.response.status===500){
            //    this.setState({networkErr:true});
            // }
          });
};
}