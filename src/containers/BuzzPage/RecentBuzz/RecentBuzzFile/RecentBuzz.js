import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./RecentBuzz.module.css";
import Corousel from "../../../../components/Corousel/Corousel";
import { connect } from "react-redux";
import { authorizedRequestsHandler } from "../../../../APIs/APIs";
import {
  buzzLikeEndpoint,
  buzzDislikeEndpoint,
} from "../../../../APIs/APIEndpoints";
import { errorOccurred } from "../../../../store/actions";
import { serverURI, pictureURI } from "../../../../APIs/APIEndpoints";

class RecentBuzz extends Component {
  state = {
    likeCount: this.props.buzz.likes || 0,
    dislikeCount: this.props.buzz.dislikes || 0,
    liked: this.props.buzz.liked || false,
    disliked: this.props.buzz.disliked || false,
    updateReview: false,
    networkErr: false,
    deletePopupVisible: false,
  };

  errorHandler = (err) => {
    if (err.response) {
      const errorCode = err.response.data.errorCode;
      if (errorCode === "INVALID_TOKEN") {
        this.props.errorOccurred();
      }
      if (err.response.status === 500) {
        this.setState({ networkErr: true });
      }
    }
  };

  buzzReviewEndpoint = (endpoint, id, reverse) => {
    if (reverse===1) {
      return authorizedRequestsHandler().patch(
        endpoint + `/${id}?reverse=1`,
        null
      );
    } else {
      return authorizedRequestsHandler().patch(endpoint + `/${id}`, null);
    }
  };

  timed = (duration) => {
    const timeType = [60, 3600, 86400, 604800, 2419200, 29030400];
    const unit = ["min", "h", "d", "w", "m", "y"];
    let seconds = duration / 1000;
    let defDuration = "now";
    let durationQuantity = 0;
    if (seconds > 29030400) {
      return `${Math.floor(seconds / 29030400)}y ago`;
    }

    for (let index = 0; index < timeType.length - 1; index++) {
      if (seconds > timeType[index] && seconds < timeType[index + 1]) {
        durationQuantity = seconds / timeType[index];
        defDuration = unit[index];
        break;
      }
    }
    if (defDuration === "now") return defDuration;
    else {
      return `${Math.floor(durationQuantity)}${defDuration} ago`;
    }
  };

  toggleLike = () => {
    this.setState({ updateReview: true });
    const liked = !this.state.liked;
    if (liked) {
      this.setState({
        likeCount: this.state.likeCount + 1,
        liked: liked,
      });
      this.buzzReviewEndpoint(buzzLikeEndpoint, this.props.buzz._id,0)
        .then((res) => {
          this.setState({ updateReview: false });
        })
        .catch((err) => {
          this.setState({ updateReview: false });
          this.errorHandler(err);
        });

      if (this.state.disliked) {
        this.setState({
          dislikeCount: this.state.dislikeCount - 1,
          disliked: false,
        });
        this.buzzReviewEndpoint(buzzDislikeEndpoint, this.props.buzz._id, 1)
          .then((res) => {
            this.setState({ updateReview: false });
          })
          .catch((err) => {
            this.setState({ updateReview: false });
            this.errorHandler(err);
          });
      }
    } else {
      this.setState({
        likeCount: this.state.likeCount - 1,
        liked: liked,
      });
      this.buzzReviewEndpoint(buzzLikeEndpoint, this.props.buzz._id,1)
        .then((res) => {
          this.setState({ updateReview: false });
        })
        .catch((err) => {
          this.setState({ updateReview: false });
          this.errorHandler(err);
        });
    }
  };

  toggleDislike = () => {
    const dislike = !this.state.disliked;
    this.setState({ updateReview: true });
    if (dislike) {
      this.setState({
        dislikeCount: this.state.dislikeCount + 1,
        disliked: dislike,
      });
      this.buzzReviewEndpoint(buzzDislikeEndpoint, this.props.buzz._id, 0)
        .then((res) => {
          this.setState({ updateReview: false });
        })
        .catch((err) => {
          this.setState({ updateReview: false });
          this.errorHandler(err);
        });

      if (this.state.liked) {
        this.setState({
          likeCount: this.state.likeCount - 1,
          liked: false,
        });
        this.buzzReviewEndpoint(buzzLikeEndpoint, this.props.buzz._id, 1)
          .then((res) => {
            this.setState({ updateReview: false });
          })
          .catch((err) => {
            this.setState({ updateReview: false });
            this.errorHandler(err);
          });
      }
    } else {
      this.setState({
        dislikeCount: this.state.dislikeCount - 1,
        disliked: dislike,
      });
      this.buzzReviewEndpoint(buzzLikeEndpoint, this.props.buzz._id,1)
        .then((res) => {
          this.setState({ updateReview: false });
        })
        .catch((err) => {
          this.setState({ updateReview: false });
          this.errorHandler(err);
        });
    }
  };

  render() {
    return (
      <div className={styles.recentBuzz}>
        {this.state.networkErr
          ? alert("Please check your internet connection")
          : null}
        <div className={styles.buzzes}>
          {this.props.user.email === this.props.buzz.user.email ? (
            <span className={styles.editButtonsDiv}>
              <i
                className={["fa fa-edit", styles.editButtons].join(" ")}
                onClick={this.props.editClick}
              ></i>
              <i
                className={["fa fa-trash", styles.editButtons].join(" ")}
                onClick={this.props.show}
              ></i>
            </span>
          ) : null}
          <span className={styles.date}>
            {this.props.dayFormat}/<br />
            {this.props.monthFormat}
          </span>
          <span className={styles.dateMobile}>
            {this.props.dayFormat}/{this.props.monthFormat}/
            {this.props.yearFormat}
          </span>
          <div className={styles.rightDiv}>
            {this.props.images.length > 0 ? (
              <Corousel image={this.props.images} />
            ) : null}
            <img
              className={styles.profilePic}
              src={
                serverURI +
                pictureURI +
                "/" +
                encodeURIComponent(this.props.buzz.user.picture)
              }
              alt="Profile Pic"
            />
            <Link
              className={styles.name}
              to={{
                pathname: "/profile",
                state: { email: this.props.buzz.userId },
              }}
            >
              {this.props.buzz.user.name}
            </Link>
            <span className={styles.duration}>
              {this.timed(this.props.duration)}
            </span>
            <p>{this.props.buzz.description}</p>
            <div
              className={
                styles.reviews +
                " " +
                (this.state.updateReview ? styles.disableClick : null)
              }
            >
              <span className={styles.count}>{this.state.likeCount}</span>
              <button
                onClick={() => this.toggleLike()}
                className={styles.button}
              >
                <i
                  className={
                    "fa fa-thumbs-up" +
                    " " +
                    (this.state.liked ? styles.Active : null)
                  }
                ></i>
              </button>
              <span className={styles.count}>{this.state.dislikeCount}</span>
              <button
                onClick={() => this.toggleDislike()}
                className={styles.button}
              >
                <i
                  className={
                    "fa fa-thumbs-down fa-flip-horizontal" +
                    " " +
                    (this.state.disliked ? styles.Active : null)
                  }
                ></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    errorOccurred: () => dispatch(errorOccurred()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentBuzz);
