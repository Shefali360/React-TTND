import React from "react";
import styles from "./DeleteAssurance.module.css";
import SmallSpinner from "../SmallSpinner/SmallSpinner";

const DeleteAssurance = (props) => {
  return (
    <div className={styles.overlay}>
      <div className={[styles.popup, props.class].join(" ")}>
        <h5>Delete {props.name}</h5>
        <p>{props.message}</p>
        <button
          className={styles.delete}
          type="button"
          value="submit"
          onClick={props.delete}
        >
          Delete
        </button>
        <button type="button" className={styles.cancel} onClick={props.cancel}>
          Cancel
        </button>
        {props.spinner ? <SmallSpinner /> : null}
      </div>
    </div>
  );
};

export default DeleteAssurance;
