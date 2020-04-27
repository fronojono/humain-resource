/* RoutingExample.jsx */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { Button, Drawer, Toolbar, Snackbar, ListItem, MenuButton } from 'react-md';
import { connect } from 'react-redux';
import * as act from '../../app/actions';
import NavItemLink from './nav-item';

import Employee from '../employees';
import LeaveRequest from '../leaveRequest';
import Calender from '../Calender';
import Events from '../event';
import AdminRequest from '../adminRequest';
import Convention from '../convention';
import Signin from '../users/auth/signin';
import Signup from '../users/auth/signup';
import { isAuthenticated } from '../../components/users/auth/auth';
import Profile from '../employees/profile';
import ProfileEmp from '../employees/profile/empProfil';

import './style.scss';
const TO_PREFIX = '/';

const employeeInformation = isAuthenticated && isAuthenticated().result;
const userId = employeeInformation && employeeInformation.id;
const navItems = [
	{
		label: 'Employee',
		to: `${TO_PREFIX}employee`,
		exact: true,
		icon: <i class="material-icons">supervisor_account</i>,
		component: { Employee }
	},
	{
		label: 'LeaveRequest',
		to: `${TO_PREFIX}leaveRequest`,
		icon: <i class="material-icons">work_off</i>,
		component: { LeaveRequest }
	},
	{
		label: 'AdminRequest',
		to: `${TO_PREFIX}adminRequest`,
		icon: <i class="material-icons">assignment_ind</i>,
		component: { AdminRequest }
	},

	{
		label: 'Convention',
		to: `${TO_PREFIX}convention`,
		icon: <i class="material-icons">local_library</i>,
		component: { Convention }
	},
	{
		label: 'Events',
		to: `${TO_PREFIX}events`,
		icon: <i class="material-icons">event_available</i>,
		component: { Event }
	},
	{
		label: 'Calender',
		to: `${TO_PREFIX}calender`,
		icon: <i class="material-icons">calendar_today</i>,
		component: { Calender }
	},
	{
		label: 'Profil',
		to: `${TO_PREFIX}employees/${userId}`,
		icon: <i class="material-icons">supervised_user_circle</i>,
		component: { Calender }
	}
];

const authService = {
	isAuthenticated() {
		const tok = localStorage ? localStorage : null;
		if (tok.length !== 0) {
			return true;
		}
		return false;
	}
};

@connect(
	({ app }) => ({
		toasts: app.toasts
	}),
	{
		dismissToast: act.dismissToast
	}
)
class Layout extends PureComponent {
	static propTypes = {
		location: PropTypes.object.isRequired
	};
	state = {
		visible: false,
		changeView: true
	};

	componentDidMount() {
		// Need to set the renderNode since the drawer uses an overlay
		this.dialog = document.getElementById('drawer-routing-example-dialog');
	}

	showDrawer = () => {
		this.setState({ visible: true });
	};

	hideDrawer = () => {
		this.setState({ visible: false });
	};

	handleVisibility = (visible) => {
		this.setState({ visible });
	};
	handleChangeView = () => {
		const { changeView } = this.state;
		this.setState({ changeView: !changeView });
	};
	signOut = () => {
		localStorage.removeItem('users');
		window.location.pathname = '/';
	};
	openProfile = () => {
		const { history } = this.props;
		const employeeInformation = isAuthenticated && isAuthenticated().result;

		const userId = employeeInformation && employeeInformation.id;
		history.replace(`/employees/${userId}`);
	};
	render() {
		const { location, toasts, dismissToast } = this.props;
		const { visible } = this.state;

		const employeeInformation = isAuthenticated && isAuthenticated().result;
		const role = employeeInformation && employeeInformation.Role;
		const userName = employeeInformation && employeeInformation.EmployeeFirstName;

		const userId = employeeInformation && employeeInformation.id;
		const Token = isAuthenticated && isAuthenticated().token;

		// if (window && window !== undefined && Token === undefined) {
		//   window.location.pathname = "/"
		// }

		return (
			<div>
				<Toolbar
					colored
					title="TARGET TUNISIA"
					nav={
						Token && (
							<Button icon onClick={this.showDrawer}>
								menu
							</Button>
						)
					}
					actions={
						Token && (
							<MenuButton
								id="button"
								className="button"
								icon
								menuItems={[
									<ListItem key={1} primaryText="Log Out" onClick={this.signOut} />
									/*  <ListItem key={2} primaryText='Profile' onClick={this.openProfile} />, */
								]}
							>
								more_vert
							</MenuButton>
						)
					}
				/>

				<Switch key={location.pathname}>
					<PrivateRoute path={navItems[0].to} exact component={() => <Employee role={role} />} />
					<PrivateRoute
						path={navItems[1].to}
						exact
						component={() => <LeaveRequest role={role} userName={userName} userId={userId} />}
					/>
					<PrivateRoute
						path={navItems[2].to}
						exact
						component={() => <AdminRequest role={role} userName={userName} userId={userId} />}
					/>
					<PrivateRoute path={navItems[3].to} exact component={() => <Convention role={role} />} />
					<PrivateRoute path={navItems[4].to} exact component={() => <Events role={role} />} />

					<PrivateRoute path={navItems[5].to} exact component={Calender} />
					<PrivateRoute path={navItems[6].to} exact component={Profile} />

					<PrivateRoute path="/employees/:id" exact component={ProfileEmp} />

					<div className="authentication-card">
						{this.state.changeView ? (
							<Signin Token={Token} handleChangeView={this.handleChangeView} />
						) : (
							<Signup handleChangeView={this.handleChangeView} />
						)}
					</div>
				</Switch>
				<Drawer
					type={Drawer.DrawerTypes.TEMPORARY}
					visible={visible}
					onVisibilityChange={this.handleVisibility}
					header={<Toolbar title="TARGET TUNISIA" className="mainNav-header" />}
					renderNode={this.dialog}
					navItems={navItems.map((props) => <NavItemLink {...props} key={props.to} />)}
				/>

				<Snackbar autohide toasts={toasts} onDismiss={dismissToast} />
			</div>
		);
	}
}
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			authService.isAuthenticated() ? (
				<Component {...props} />
			) : (
				<Redirect
					to={{
						pathname: '/',
						state: { target: props.location }
					}}
				/>
			)}
	/>
);
export default withRouter(Layout);
