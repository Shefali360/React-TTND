import React, { Component } from 'react';
import CreateBuzz from './CreateBuzz/CreateBuzz';
import RecentBuzz from './RecentBuzz/RecentBuzz';

class BuzzPage extends Component{    

    state={
        buzzSubmitted:{submitted:0},
        edited:{buzzPost:{}}
    }
    

    buzzSubmitted=(event)=>{
        this.setState({buzzSubmitted:event});
       
      }
    edited=(event)=>{
        this.setState({edited:event});
    }
    render(){
    return(
        <div> 
            <CreateBuzz submitted={this.buzzSubmitted} edited={this.state.edited}/>
            <RecentBuzz submitted={this.state.buzzSubmitted} edited={this.edited}/>
        </div>
    );
}
}
export default BuzzPage;