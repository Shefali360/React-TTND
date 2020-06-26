import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

// const isadmin=localStorage.getItem("adminPrivilege")?JSON.parse(localStorage.getItem("adminPrivilege")):false;
const initialState={
    review:false
}

const liked=(state,action)=>{
    return(updateObject(state,{
        review:true
     }))
    
}

const unliked=(state,action)=>{
    return(updateObject(state,{
        review:false
     }))
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case actionTypes.LIKED:return liked(state,action);
        case actionTypes.UNLIKED:return unliked(state,action);
        default:return state;
    }
}
export default reducer;