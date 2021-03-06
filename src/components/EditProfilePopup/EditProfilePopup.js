import React from "react";
import buzzStyles from "../../containers/BuzzPage/CreateBuzz/CreateBuzz.module.css";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import styles from "./EditProfilePopup.module.css";

const EditProfile = (props) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <i
          className={["fa fa-times", styles.cross].join(" ")}
          onClick={props.close}
        />
        <h4>Edit User Profile </h4>
        <form className={styles.form}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name.."
            value={props.name}
            onChange={props.handleChange}
          />
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth.."
            value={props.dob}
            onChange={props.handleChange}
          />
          <label>Mobile No:</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone no."
            value={props.phone}
            onChange={props.handleChange}
          />
          <button
            className={buzzStyles.button}
            type="submit"
            value="Submit"
            disabled={props.submitDisabled}
            onClick={props.clicked}
          >
            Submit
          </button>
          {props.spinner ? <SmallSpinner /> : null}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
