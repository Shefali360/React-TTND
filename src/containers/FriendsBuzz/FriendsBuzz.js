import React,{Component} from 'react';
import RecentBuzz from "../BuzzPage/RecentBuzz/RecentBuzz";
import {connect} from "react-redux";

class FriendsBuzz extends Component{


    render(){
        const followedArr=this.props.userdata.followed;
        return(
            <RecentBuzz heading="Friends Buzz" filters={followedArr}/>
        )      
    }
}

const mapStateToProps=(state)=>{
    return{
        userdata:state.user.data
    }
}

export default connect(mapStateToProps)(FriendsBuzz);