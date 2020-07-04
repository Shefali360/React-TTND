import React, { Component } from 'react';
import CreateBuzz from './CreateBuzz/CreateBuzz';
import RecentBuzz from './RecentBuzz/RecentBuzz';

class BuzzPage extends Component{    

    state={
        buzzSubmitted:{submitted:0}
    }
    

    buzzSubmitted=(event)=>{
        this.setState({buzzSubmitted:event});
       
      }
    render(){
    return(
        <div> 
            <CreateBuzz submitted={this.buzzSubmitted}/>
            <RecentBuzz submitted={this.state.buzzSubmitted} heading="Recent Buzz"/>
        </div>
    );
}
}
export default BuzzPage;