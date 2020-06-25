import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';


const token=localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null;

const initialState={
    token:token,
    tokenError:null,
    
}

const tokenReceived=(state,action)=>{
return(updateObject(state,{
       token:action.data
}
))
}

const tokenReceiveFailed=(state,action)=>{
    return(updateObject(state,{tokenError:action.error}))
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case actionTypes.TOKEN_RECEIVED:return tokenReceived(state,action);
        case actionTypes.TOKEN_RECEIVE_FAILED:return tokenReceiveFailed(state,action);
        default:return state;
    }
}
export default reducer;