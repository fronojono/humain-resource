import React, { Component } from 'react';
import { Button, DialogContainer, NavigationDrawer, SVGIcon } from 'react-md';
import inboxListItems from './components/constants/inboxListItems';

import menu from './components/icons/menu.svg';
import arrowBack from './components/icons/arrow_back.svg';

import Signin from './components/users/auth/signin';
import Signup from './components/users/auth/signup';
import * as act from './app/actions';
import { Snackbar } from 'react-md';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Employees from './components/employees';
import AdminRequest from './components/adminRequest';
import LeaveRequest from './components/leaveRequest';
import Calender from './components/Calender';
import Profile from './components/employees/profile';
import Events from './components/event';
import Convention from './components/convention';

import { isAuthenticated } from './components/users/auth/auth';

import { Link } from 'react-router-dom';

@connect(
	({ app }) => ({
		toasts: app.toasts
	}),
	{
		dismissToast: act.dismissToast
	}
)
class Dashboard extends Component {
	constructor() {
		super();

		// Update the items so they have an onClick handler to change the current page
		this.navItems = inboxListItems.map((item) => {
			if (item.divider) {
				return item;
			}

			return {
				...item,
				onClick: () => this.setPage(item.key, item.primaryText)
			};
		});

		this.state = {
			renderNode: null,
			visible: false,
			key: inboxListItems[0].key,
			page: inboxListItems[0].primaryText,
			users: []
		};
	}
	setPage = (key, page) => {
		this.navItems = this.navItems.map((item) => {
			if (item.divider) {
				return item;
			}

			return { ...item, active: item.key === key };
		});

		this.setState({ key, page });
	};

	show = () => {
		this.setState({ visible: true });
	};

	hide = () => {
		this.setState({ visible: false, renderNode: null });
	};

	handleShow = () => {
		this.setState({
			renderNode: document.getElementById('navigation-drawer-demo')
		});
	};
	signout = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('users');
			window.location.pathname = '/';
		}
	};
	renderBodyDashboard = () => {
		const employeeInformation = isAuthenticated && isAuthenticated().result;

		const { users, page, renderNode } = this.state;
		const role = employeeInformation && employeeInformation.Role;
		const userName = employeeInformation && employeeInformation.EmployeeFirstName;

		const userId = employeeInformation && employeeInformation.id;
		return (
			<div>
				{page === 'Leave Request' && (
					<div>
						<LeaveRequest role={role} userName={userName} userId={userId} />
					</div>
				)}
				{page === 'Admin Request' && (
					<div>
						<AdminRequest role={role} userName={userName} userId={userId} />
					</div>
				)}
				{page === 'Convention' && (
					<div>
						<Convention role={role} />
					</div>
				)}
				{page === 'Events' && (
					<div>
						<Link to={'/events'} role={role} />
					</div>
				)}
				{page === 'Calender' && (
					<div>
						<Calender />
					</div>
				)}
				{page === 'Signin' && (
					<div>
						<Signin />
					</div>
				)}
				{page === 'Signup' && (
					<div>
						<Signup />
					</div>
				)}
				{page === 'Logout' && this.signout()}
				}
			</div>
		);
	};
	render() {
		const { renderNode } = this.state;

		const { toasts, dismissToast } = this.props;
		return (
			<div>
				<div>
					<Button raised onClick={this.show}>
						Open the Demo
					</Button>
					<DialogContainer
						id="navigation-drawer-demo"
						aria-label="Navigation Drawer Demo"
						visible={true}
						fullPage
						focusOnMount={false}
						onShow={this.handleShow}
						onHide={this.hide}
					>
						<NavigationDrawer
							renderNode={renderNode}
							navItems={this.navItems}
							mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
							tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
							desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
							toolbarTitle="TARGET TUNISIA !"
							toolbarActions={
								<Button icon onClick={this.hide}>
									close
								</Button>
							}
							contentId="main-demo-content"
							temporaryIcon={<SVGIcon use={menu.url} />}
							persistentIcon={<SVGIcon use={arrowBack.url} />}
							contentClassName="md-grid"
						>
							{this.renderBodyDashboard()}

							<section className="md-text-container md-cell md-cell--12" />
						</NavigationDrawer>
					</DialogContainer>
				</div>

				<Snackbar autohide toasts={toasts} onDismiss={dismissToast} />
			</div>
		);
	}
}
export default Dashboard;
