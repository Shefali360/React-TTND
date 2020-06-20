import React from 'react';
import NavbarItem from '../SidebarItem';
import styles from './SidebarItems.module.css';
import Footer from '../../Footer/Footer';
import { connect } from "react-redux";
const Navbar=(props)=>{
    return (
        <div className={styles.sidebar}>
        <ul className={styles.list}>
            <NavbarItem link="/buzz" >BUZZ</NavbarItem>
            <NavbarItem link="/complaint">COMPLAINTS</NavbarItem>
            {(props.admin)?<NavbarItem link="/resolved">RESOLVED</NavbarItem>:null}
        </ul>
        <Footer/>
        </div>
    );

}

const mapStateToProps = (state) => {
    return {
        admin:state.adminCheck.adminPrivilege
    }
};

export default connect(mapStateToProps)(Navbar);