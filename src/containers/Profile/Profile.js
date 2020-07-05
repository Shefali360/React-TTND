import React, { Component } from "react";
import Description from "../../containers/MyProfile/MyDescription/MyDescription";
import RecentBuzz from "../../containers/BuzzPage/RecentBuzz/RecentBuzz";
import { withRouter } from "react-router-dom";
import { userEndpoint } from "../../APIs/APIEndpoints";
import { authorizedRequestsHandler } from "../../APIs/APIs";
import { stringify } from "querystring";

class Profile extends Component {
  state = {
    user: {},
    email:this.props.location.state.email,
    spinner: true,
  };

  getUser = () => {
    const filter = {};
    filter["email"] = this.state.email;
    authorizedRequestsHandler()
      .get(userEndpoint + `?skip=0&limit=1&` + stringify(filter))
      .then((res) => {
        this.setState({
          user: res.data[0],
          spinner: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getUser();
  }

  render() {
    let userdata = null;
    let mymail = null;
    userdata=this.state.user;
    const user = JSON.parse(localStorage.getItem("userData"));
    if (userdata.email === user && user.email) {
      mymail = user.email;
    }
    return (
      <>
        <Description
          name={userdata.name}
          picture={userdata.picture}
          email={userdata.email}
          role={userdata.role}
          department={userdata.department&& userdata.department.department}
          dob={userdata.dob}
          phone={userdata.phone}
          spinner={this.state.spinner}
          getUser={() => this.getUser(mymail)}
        />
        <RecentBuzz heading="Buzz" filters={this.state.email} />
      </>
    );
  }
}

export default withRouter(Profile);
