import React, { Component } from "react";
import { connect } from "react-redux";
import Spinner from '../../../components/Spinner/Spinner';
import Loader from '../../../components/Loader/Loader';
import RecentBuzz from './RecentBuzzFile/RecentBuzz';
import styles from './RecentBuzz.module.css';
import InfiniteScroll from 'react-infinite-scroller';
import {authorizedRequestsHandler} from '../../../APIs/APIs';
import {buzzEndpoint} from '../../../APIs/APIEndpoints';
import { errorOccurred } from "../../../store/actions";

class RecentBuzzData extends Component {
  state={
    buzz:[],
    error:false,
    skip:0,
    hasMore:false,
    spinner:true,
    networkErr:false
  }

  limit= 5;

  getBuzz=(skip)=>{

 authorizedRequestsHandler()
      .get(
        buzzEndpoint+`?skip=${skip}&limit=${this.limit}`
      ).then((res)=>{
        const buzz = Array.from(this.state.buzz);
        buzz.push(...res.data);
       this.setState({
          buzz: buzz,
          skip:skip + 5,
          hasMore:!(res.data.length<this.limit),
          spinner:false})
      }).catch((err)=>{
       this.setState({error:true,spinner:false})
       const errorCode=err.response.data.errorCode;
       if(errorCode==="INVALID_TOKEN"){
          this.props.errorOccurred();
       }
        if(err.response.status===500){
         this.setState({networkErr:true});
        }
       
      })
  }
  
  componentDidMount() {
    this.getBuzz(this.state.skip);
   
  }

  componentDidUpdate(prevProps){
    if(this.props.submitted.submitted>prevProps.submitted.submitted){
     this.setState({buzz:[],spinner:true,hasMore:false});
     this.getBuzz(0);
  }
  }

  render() {
    let buzzData=null;
    if(this.state.spinner){
      buzzData=<Spinner/>
    }else if(this.state.error){
      buzzData=<div className={styles.errorContainer}>
        <i className={["fa fa-exclamation-triangle",styles.error].join(' ')}>
          <span>Buzz data can't be loaded!</span>
          </i>
          </div>
    }
     else if (this.state.buzz.length===0)
    {
       buzzData=<p>No buzz going around.You need to post something to create one!</p>
     }else{
      let count = this.state.buzz;
      buzzData = count.map((buzz) => {
      const todayDate = new Date();
      const time = todayDate.getTime();
      let dur =time-buzz.createdOn;
      let d=new Date(buzz.createdOn);
      const dayNum=d.getDate();
      const dayFormat = dayNum < 10 ? "0" + dayNum : dayNum;
      const month=d.getMonth()+1;   
      const monthFormat = month < 10 ? "0" + month : month;
      const year=d.getFullYear();
      let imageData=[];
      let altData=null;
      if(buzz.images.length!==0){
        imageData=buzz.images;
      }
      if(buzz.images.length!==0){
        altData= buzz.images;
      }
            return (
              <li key={buzz._id} >
                <RecentBuzz 
                email={buzz.userId} description={buzz.description} likeCount={buzz.likes} dislikeCount={buzz.dislikes}
                dayFormat={dayFormat} monthFormat={monthFormat}
                 duration={dur} images={imageData} alt={altData} id={buzz._id} liked={buzz.liked}
                 disliked={buzz.disliked} yearFormat={year}
                 />
              </li>
            );
       });
  }
 return (
      <div className={styles.mainDiv}>
      {(this.state.networkErr)?alert("Please check your internet connection"):null}
      <h4 className={styles.heading}><i className="fa fa-at"></i>Recent Buzz</h4>
      <ul className={styles.List}>
      <InfiniteScroll
              loadMore={()=>this.getBuzz(this.state.skip)}
              hasMore={this.state.hasMore}
              loader={<Loader key={1}/>}
              useWindow={false}
              initialLoad={false}
        >
      {buzzData}
      </InfiniteScroll>
       </ul>
      </div>
    );
}
 }


const mapDispatchToProps=(dispatch)=>{
  return{
    errorOccurred:()=>dispatch(errorOccurred())
  }
  }

export default connect(null,mapDispatchToProps)(RecentBuzzData);