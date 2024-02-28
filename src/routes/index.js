import React from "react"
import { Redirect } from "react-router-dom"
// Dashboard
import AdminDashboard from "../pages/Dashboard/Admin"

//Complain
import Complain from "../pages/Complain/index"

//News
import News from "../pages/News/index"
import NewsCreate from "../pages/News/AddNews"

//Gallery
import AddAlbum from "../pages/Gallery/AddAlbum"

//Project
import  Project from "../pages/Projects/index"

//Users
import Officer from "../pages/Users/Officer/index"
import OPosition from "../pages/Users/Officer/Position"
import OSubject from "../pages/Users/Officer/Subject"

import Member from "../pages/Users/Member/index"
import MPosition from "../pages/Users/Member/Position"
import MDivision from "../pages/Users/Member/Division"
import MParty from  "../pages/Users/Member/Party"

import Grama from "../pages/Users/Grama/index"
import GDivision from "../pages/Users/Grama/Division"

//Backup
import Backup from "../pages/Backup/index"

// Profile
import UserProfile from "../pages/Authentication/user-profile"


// Authentication related pages
import Login from "../pages/Authentication/Login"
import Register from "../pages/Authentication/Register"

const authProtectedRoutes = [
 //Dashboard
  { path: "/dashboard", component: AdminDashboard },

  //News
  { path: "/complain", component: Complain },

  //News
  { path: "/news-add", component: NewsCreate },
  { path: "/news", component: News },

  //Gallery
  { path: "/gallery", component: AddAlbum },

  //Project
  { path: "/project", component: Project},

  //Users
  { path: "/officer", component: Officer },
  { path: "/officer-position", component: OPosition },
  { path: "/officer-subject", component: OSubject },

  { path: "/member", component: Member },
  { path: "/member-position", component: MPosition },
  { path: "/member-division", component: MDivision },
  { path: "/member-party", component: MParty },

  { path: "/grama", component: Grama },
  { path: "/grama-division", component: GDivision },

  { path: "/backup", component: Backup },

  // //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
 { path: "/login", component: Login },
 { path: "/register", component: Register },
]

export { authProtectedRoutes, publicRoutes }
