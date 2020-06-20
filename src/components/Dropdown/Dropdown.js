import React from 'react';

const Dropdown=(props)=>{
    let options=null;
    options= (props.array).map((arr)=>{
   return <option key={arr.name} value={arr.value}>{arr.name}</option>
        })
    return(
<select
    className={props.class}
    name={props.name}
    value={props.value}
    onChange={props.change}
  >
      {options}
  </select>
    )
}

export default Dropdown;