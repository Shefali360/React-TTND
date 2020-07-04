import React from 'react';
import styles from '../Department.module.css';

const DepartmentPopup=(props)=>{
    return(
        <>
        <h5>
             {props.heading}
          </h5>
          <i className={["fa fa-times",styles.icon].join(' ')} onClick={props.click}></i>
          <form>
          <input
                type="text"
                placeholder="Add Department"
                name={props.name}
                value={props.value}
                onChange={props.change}
              />
          <button
              type="submit"
              value="submit"
              disabled={props.disabled}
              onClick={props.submit}
            >
              Submit
            </button>
          </form>
        </>
    );
}

export default DepartmentPopup;