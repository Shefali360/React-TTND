import React from "react";
import NavbarItem from "../SidebarItem";
import styles from "./SidebarItems.module.css";
import Footer from "../../Footer/Footer";
import { connect } from "react-redux";

const Navbar = (props) => {
  return (

    <div className={styles.sidebar}>
      <ul className={styles.list}>
        <NavbarItem link="/myprofile">MY PROFILE</NavbarItem>
        <NavbarItem link="/profile"> PROFILE</NavbarItem>
        <NavbarItem link="/friendsbuzz">FRIENDS BUZZ</NavbarItem>
        <NavbarItem link="/buzz">BUZZ</NavbarItem>
        <NavbarItem link="/chats">CHATS</NavbarItem>
        <NavbarItem link="/complaint">COMPLAINTS</NavbarItem>
        {props.user &&
        (props.user.role === "Admin" || props.user.role === "SuperAdmin") ? (
          <NavbarItem link="/resolved">RESOLVED</NavbarItem>
        ) : null}
        {props.user && props.user.role === "SuperAdmin" ? (
          <NavbarItem link="/superadmin">SUPERADMIN</NavbarItem>
        ) : null}
      </ul>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

export default connect(mapStateToProps)(Navbar);
