import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import {withRouter, Link, useHistory} from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = props => {
  const history = useHistory();
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");
  const [userImage, setUserImage] = useState(user1); // Default to current avatar
  const [userRole, setUserRole] = useState("member"); // Default role
  const [userGender, setUserGender] = useState("male"); // Default gender

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.displayName);
        setUserRole(obj.userType || obj.role || "Member");
        setUserGender(obj.gender || "male");
        loadUserImage(obj);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.username);
        setUserRole(obj.userType || obj.role || "Member");
        setUserGender(obj.gender || "male");
        loadUserImage(obj);
      }
    }
  }, [props.success]);

  // Function to load user image
  const loadUserImage = (userObj) => {
    const userId = userObj.id || userObj.userId;
    const userType = userObj.userType || userObj.role || "Member"; // Get specific user type
    const gender = userObj.gender || "male";
    
    // Determine the correct folder based on user type
    let folderPath = "member"; // Default to member
    
    // Check if it's an officer type
    const officerTypes = ["Admin", "Secretary", "Officer", "OfficerWaterBill", "OfficerHallReserve", "OfficerTax", "OfficerTaxAssess", "MeterReader"];
    const memberTypes = ["Member", "President"];
    
    if (officerTypes.includes(userType)) {
      folderPath = "officer";
    } else if (memberTypes.includes(userType)) {
      folderPath = "member";
    }
    
    if (userId) {
      // Try to load user's specific image
      const userImagePath = `http://127.0.0.1:8000/storage/images/${folderPath}/${userId}.jpg`;
      
      // Test if the image exists
      const img = new Image();
      img.onload = () => {
        setUserImage(userImagePath);
      };
      img.onerror = () => {
        // If user image doesn't exist, use default avatar based on gender
        const defaultAvatar = gender === "female" 
          ? "http://127.0.0.1:8000/storage/images/AvatarFemale.jpg"
          : "http://127.0.0.1:8000/storage/images/AvatarMale.jpg";
        
        // Test if default avatar exists
        const defaultImg = new Image();
        defaultImg.onload = () => {
          setUserImage(defaultAvatar);
        };
        defaultImg.onerror = () => {
          // If default avatar doesn't exist, use the imported avatar
          setUserImage(user1);
        };
        defaultImg.src = defaultAvatar;
      };
      img.src = userImagePath;
    } else {
      // No user ID, use default avatar based on gender
      const defaultAvatar = gender === "female" 
        ? "http://127.0.0.1:8000/storage/images/AvatarFemale.jpg"
        : "http://127.0.0.1:8000/storage/images/AvatarMale.jpg";
      
      const defaultImg = new Image();
      defaultImg.onload = () => {
        setUserImage(defaultAvatar);
      };
      defaultImg.onerror = () => {
        setUserImage(user1);
      };
      defaultImg.src = defaultAvatar;
    }
  };
  function logoutPdpd() {

    if (localStorage.getItem('auth-token')) {
    //  history.push("/login")
      localStorage.removeItem('auth-token');

    } else {
      console.log('No user data found. Already logged out?');
    }
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={userImage}
            alt="Header Avatar"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              e.target.src = user1;
            }}
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("Profile")}{" "}
          </DropdownItem>

          <DropdownItem tag="a" href="#">
            <span className="badge bg-success float-end">11</span>
            <i className="bx bx-wrench font-size-16 align-middle me-1" />
            {props.t("Settings")}
          </DropdownItem>
          {/*<DropdownItem tag="a" href="auth-lock-screen">*/}
          {/*  <i className="bx bx-lock-open font-size-16 align-middle me-1" />*/}
          {/*  {props.t("Lock screen")}*/}
          {/*</DropdownItem>*/}
          <div className="dropdown-divider" />
          <Link to="/login" className="dropdown-item" onClick={logoutPdpd}>
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
