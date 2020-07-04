import React,{Component} from 'react';
import RecentBuzz from "../../BuzzPage/RecentBuzz/RecentBuzz";
import {connect} from "react-redux";

class MyBuzz extends Component{


    render(){
        return(
            <RecentBuzz heading="My Buzz" filters={this.props.userdata.email}/>
        )      
    }
}

const mapStateToProps=(state)=>{
    return{
        userdata:state.user.data
    }
}

export default connect(mapStateToProps)(MyBuzz);