import React from 'react';
import {NavLink} from 'react-router-dom';
import styles from './SidebarItem.module.css';


const NavbarItem=(props)=>{
    return(<><li className={styles.listItem}>
        <NavLink className={styles.element} to={props.link} exact={props.exact}
        activeClassName={styles.active}
       >{props.children}
        </NavLink></li></>);
}

export default NavbarItem;
