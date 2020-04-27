import React from "react";
import { FontIcon } from "react-md";

export default [
  {
    key: "Employee",
    primaryText: "Employee",
    leftIcon: <FontIcon className="mdi mdi-account-multiple-outline"></FontIcon>,
    active: true,
    path:'/employees'
  },
  {
    key: "LeaveRequest",
    primaryText: "Leave Request",
    leftIcon: <FontIcon>star</FontIcon>
  },
  {
    key: "Admin Request",
    primaryText: "Admin Request",
    leftIcon: <FontIcon>send</FontIcon>
  },
  // {
  //   key: "drafts",
  //   primaryText: "Drafts",
  //   leftIcon: <FontIcon>drafts</FontIcon>
  // },
  { key: "divider", divider: true },
  {
    key: "Convention",
    primaryText: "Convention",
    leftIcon: <FontIcon className="mdi mdi-eventbrite"></FontIcon>
  },
  {
    key: "Events",
    primaryText: "Events",
    leftIcon: <FontIcon>delete</FontIcon>
  },
  {
    key: "Calender",
    primaryText: "Calender",
    leftIcon: <FontIcon className="mdi mdi-calendar"></FontIcon>
  },
 {
     key: "Signin",
     primaryText: "Signin",
    leftIcon:<FontIcon className="mdi mdi-login"></FontIcon>
   },
   {
       key: "Signup",
       primaryText: "Signup",
      leftIcon: <FontIcon className="mdi mdi-account-plus"></FontIcon>
     },
     {
         key: "Logout",
         primaryText: "Logout",
        leftIcon: <FontIcon className="mdi mdi-logout"></FontIcon>
       }

];
