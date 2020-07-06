import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import sharedStyles from "../Dropdown/Dropdown.module.css";
import buzzStyles from "../../containers/BuzzPage/CreateBuzz/CreateBuzz.module.css";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import styles from "./EditBuzzPopup.module.css";

const EditBuzz = (props) => {
  const array = [
    { value: "", name: "Category" },
    { value: "Activity buzz", name: "Activity" },
    { value: "Lost and Found buzz", name: "Lost and Found" },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <i
          className={["fa fa-times", styles.cross].join(" ")}
          onClick={props.closePopup}
        />
        <h4>Edit Buzz Post </h4>
        <form className={buzzStyles.form}>
          <textarea
            rows="10"
            cols="50"
            name="description"
            value={props.description}
            onChange={props.change}
          ></textarea>
          <div className={buzzStyles.bottombar}>
            <div>
              <div className={sharedStyles.dropdown}>
                <Dropdown
                  name="buzzCategory"
                  value={props.category}
                  change={props.change}
                  array={array}
                />
              </div>
              <div className={buzzStyles.imageUpload}>
                <input
                  files={props.images}
                  type="file"
                  name="images"
                  className={buzzStyles.file}
                  accept="image/x-png,image/jpg,image/jpeg"
                  onChange={props.fileChange}
                  multiple
                />
                <div className={buzzStyles.fakeUpload}>
                  <i className="fa fa-image"></i>
                </div>
              </div>
            </div>
            <div className={buzzStyles.bottombarRight}>
              {props.descEmpty ? (
                <p className={buzzStyles.errormsg}>
                  Please fill in the description.
                </p>
              ) : null}
              {props.categoryEmpty ? (
                <p className={buzzStyles.errormsg}>
                  Please fill in the category.
                </p>
              ) : null}
              {props.spinner ? <SmallSpinner /> : null}
              <button
                className={buzzStyles.button}
                type="submit"
                value="Submit"
                disabled={props.submitDisabled}
                onClick={props.clicked}
              >
                <i className="fa fa-play"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBuzz;
