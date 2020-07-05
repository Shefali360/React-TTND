import React,{Component} from "react";
import MyDescription from "./MyDescription/MyDescription";
import MyBuzz from "./MyBuzz/MyBuzz";
import {authorizedRequestsHandler} from "../../APIs/APIs";
import {userEndpoint} from "../../APIs/APIEndpoints";
import {connect} from "react-redux";
import {stringify} from "querystring";

class MyProfile extends Component{

    state={
        user:{},
        spinner:true
    }

    getUser = () => {
        const filter={};
        filter["email"]=this.props.userdata.email;
        authorizedRequestsHandler()
          .get(
            userEndpoint +
              `?skip=0&limit=1&` +
              stringify(filter)
          )
          .then((res) => {
            this.setState({
                user:res.data[0],
                spinner:false
            });
          })
          .catch((err) => {
            console.log(err);
          });
      };

      componentDidMount(){
          this.getUser();
      }
    
    render(){
        const userdata=this.state.user;
        return(
            <>
            
            <MyDescription name={userdata.name}picture={userdata.picture} email={userdata.email} role={userdata.role}
            department={userdata.department&&userdata.department.department} dob={userdata.dob&&userdata.dob}
            phone={userdata.phone&&userdata.phone} spinner={this.state.spinner} getUser={this.getUser}/>
            <MyBuzz/>
            </>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        userdata:state.user.data
    }
}

export default connect(mapStateToProps)(MyProfile);