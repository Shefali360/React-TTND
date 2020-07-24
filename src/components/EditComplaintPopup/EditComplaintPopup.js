import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import sharedStyles from "../../containers/ComplaintPage/ComplaintBox/ComplaintBox.module.css";
import popupStyles from "../EditBuzzPopup/EditBuzzPopup.module.css";
import styles from "./EditComplaintPopup.module.css";

const EditComplaintPopup = (props) => {
  const issueArray = [
    { value: "", name: "Select Issue Title" },
    { value: "Hardware", name: "Hardware" },
    { value: "Infrastructure", name: "Infrastructure" },
    { value: "Others", name: "Others" },
  ];
  return (
    <div className={popupStyles.overlay}>
      <div className={styles.popup}>
        <i
          className={["fa fa-times", popupStyles.cross].join(" ")}
          onClick={props.closePopup}
        />
        <h4>Edit Complaints</h4>
        <form className={styles.complaintForm}>
          <div className={[styles.item, sharedStyles.dropdownMenu].join(" ")}>
            <label>Select Department</label>
            <Dropdown
              class={sharedStyles.select}
              name="editedDept"
              value={props.dept}
              change={props.handleChange}
              array={props.deptArray}
            />
          </div>
          <div className={[styles.item, sharedStyles.dropdownMenu].join(" ")}>
            <label>Issue Title</label>
            <Dropdown
              class={sharedStyles.select}
              name="title"
              value={props.issue}
              change={props.handleChange}
              array={issueArray}
            />
          </div>
          <div className={sharedStyles.textarea}>
            <label>Your Concern</label>
            <textarea
              className={sharedStyles.Textarea}
              name="concern"
              rows="10"
              cols="50"
              value={props.concern}
              onChange={props.handleChange}
            ></textarea>
          </div>
          <div className={sharedStyles.attachment}>
            <div className={sharedStyles.realimage}>
              <input
                type="file"
                name="files"
                onChange={props.fileChange}
                multiple
              />
              <div className={sharedStyles.fakeImage}>
                <i className="fa fa-image"></i>
              </div>
            </div>
          </div>

          <div className={sharedStyles.Button}>
            {props.spinner ? (
              <div className={sharedStyles.spinner}>
                <SmallSpinner />
              </div>
            ) : null}
            {props.departmentEmpty || props.issueEmpty || props.concernEmpty ? (
              <p className={sharedStyles.errormsg}>
                Please fill in all the fields.
              </p>
            ) : null}
             {props.sizeExceeded ? (
                <p className={styles.errormsg}>
                 Image file size exceeded.
                </p>
              ) : null}
            <button
              className={sharedStyles.button}
              type="submit"
              value="Submit"
              disabled={props.submitDisabled}
              onClick={props.clicked}
            >
              Submit
            </button>
          </div>
          <div className={sharedStyles.message}>
    {(props.formSubmitted)?<p>Successful!</p>:null}
  </div>
        </form>
      </div>
    </div>
  );
};

export default EditComplaintPopup;
