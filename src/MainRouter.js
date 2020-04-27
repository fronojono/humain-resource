import React from "react";
import { Route, Switch } from "react-router-dom";


import Dashboard from "./dashboard"
import Convention from './components/convention'
import Events from './components/event'
import Calender from './components/Calender';
import LeaveRequest from './components/leaveRequest';
import AdminRequest from './components/adminRequest';
import Employees from './components/employees';
import Signin from './components/users/auth/signin';
import Signup from './components/users/auth/signup';

const MainRouter = () => (
    <div>

        <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/conventions" component={Convention} />
            <Route exact path="/events" component={Events} />
            <Route exact path="/calender" component={Calender} />
            <Route exact path="/leaverequests" component={LeaveRequest} />
            <Route exact path="/adminrequests" component={AdminRequest} />
            <Route exact path="/employees" component={Employees} />
            <Route exact path="/sign-in" component={Signin} />
            <Route exact path="/sign-up" component={Signup} />

        </Switch>
    </div>
);

export default MainRouter;
