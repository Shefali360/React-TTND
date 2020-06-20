import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../../shared/utility';

const isadmin=localStorage.getItem("adminPrivilege")?JSON.parse(localStorage.getItem("adminPrivilege")):false;
const initialState={
    adminPrivilege:isadmin
}

const isAdmin=(state,action)=>{
    return(updateObject(state,{
        adminPrivilege:action.data
     }))
    
}

const isNotAdmin=(state,action)=>{
   return{
       error:true
   }
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case actionTypes.IS_ADMIN:return isAdmin(state,action);
        case actionTypes.IS_NOT_ADMIN:return isNotAdmin(state,action);
        default:return state;
    }
}
export default reducer;