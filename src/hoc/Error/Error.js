import React,{Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

class Error extends Component{
    render(){
        if(this.props.error){
            alert("Timed out!Please login again.");
        return(
            <Redirect to='/login'/>
        )
    }else {
        return this.props.children;
    }
}
}
const mapStateToProps=(state)=>{
    return{
    error:state.redirect.redirectError
    }
}

export default connect(mapStateToProps)(Error);