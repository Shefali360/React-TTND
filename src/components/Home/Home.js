import React, { Component } from "react";
import styles from "./Home.module.css";
import TopDiv from "../../components/TopDiv/TopDiv";
import Sidebar from "../../components/Sidebar/SidebarItems/SidebarItems";
import { withRouter } from "react-router-dom";

class Home extends Component {
  state = {
    navbarVisible: false,
  };

  componentDidMount() {
    window.addEventListener("resize", this.navbar);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.navbar);
  }
  navbar = () => {
    if (window.innerWidth > 1024 && this.state.navbarVisible)
      this.setState({ navbarVisible: false });
  };
  toggleNavbar = () => {
    this.setState({ navbarVisible: !this.state.navbarVisible });
  };

  hideNavbar = () => {
    if (this.state.navbarVisible === true) {
      this.setState({ navbarVisible: false });
    }
  };

  render() {
    let text = "";
    const path = this.props.history.location.pathname;
    if (path === "/myprofile") {
      text = "Have a look at your profile...";
    } else if (path === "/profile") {
      text = "Visit anyone's profile on a single click...";
    } else if (path === "/buzz") {
      text = "Creating buzz around you has never been so easy...";
    } else if (path === "/complaint" || path === "/resolved") {
      text = "You can now log complaints on a single click...";
    } else if (path === "/superadmin") {
      text = "You can view all complaints, modify departments and users...";
    } else if (path === "/about") {
      text = "About Us...";
    } else if (path === "/help") {
      text = "Help...";
    } else {
      text = "You seem a little lost...";
    }
    return (
      <div className={styles.home}>
        <header>
          <TopDiv text={text} />
        </header>
        <main className={styles.post}>
          <button className={styles.navigation} onClick={this.toggleNavbar}>
            Navigation
          </button>
          <nav>
            {this.state.navbarVisible ? (
              <div onClick={this.hideNavbar} className={styles.overlay}>
                <Sidebar />
              </div>
            ) : null}
          </nav>
          <nav className={styles.leftDiv}>
            <Sidebar />
          </nav>
          <div className={styles.rightDiv}>{this.props.children}</div>
        </main>
      </div>
    );
  }
}

export default withRouter(Home);
