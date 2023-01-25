import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const ref = useRef();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li>			
			  <Link to="/blog" >
				<i className="bx bx-home-circle"></i>
				<span>{props.t("Home")}</span>
			  </Link>          
			</li>

            <li>
              <Link to="/news-create" >
                <i className="bx bx-news"></i>
                <span>{props.t("News")}</span>
              </Link>
            </li>

            <li>
              <Link to="/gallery-add" >
                <i className="bx bx-images"></i>
                <span>{props.t("Gallery")}</span>
              </Link>
            </li>
        
			<li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-briefcase-alt-2"></i>
                <span>{props.t("Projects")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/projects-list">{props.t("Projects List")}</Link>
                </li>
                <li>
                  <Link to="/projects-create">{props.t("Add New")}</Link>
                </li>
              </ul>
            </li>
			
			<li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-user"></i>
                <span>{props.t("Officer")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="">{props.t("Position")}</Link>
                </li>
				<li>
                  <Link to="">{props.t("Subject")}</Link>
                </li>
                <li>
                  <Link to="/user-officer">{props.t("Officer List")}</Link>
                </li>
              </ul>
            </li>
			
			<li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-user"></i>
                <span>{props.t("Member")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/member-division">{props.t("Division")}</Link>
                </li>
				<li>
                  <Link to="/member-party">{props.t("Party")}</Link>
                </li>
				<li>
                  <Link to="/member-position">{props.t("Position")}</Link>
                </li>
                <li>
                  <Link to="/user-member">{props.t("Member List")}</Link>
                </li>
              </ul>
            </li>
			
			<li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-user"></i>
                <span>{props.t("Grama Niladari")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/user-grama-div">{props.t("Division")}</Link>
                </li>
                <li>
                  <Link to="/user-grama">{props.t("Grama Niladari List")}</Link>
                </li>
              </ul>
            </li>

			<li>
              <Link to="/apps-filemanager" >
                <i className="bx bx-data"></i>
                <span>{props.t("Backup")}</span>
              </Link>
            </li>
			
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
