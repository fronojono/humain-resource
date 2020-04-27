import React, { Component } from 'react';
import { Redirect } from '@reach/router';
// import queryString from "query-string"
import { withRouter } from 'react-router-dom';
// import * as cookies from "tiny-cookie"
import { connect } from 'react-redux';
import { isAuthenticated } from '../../auth/auth';
import ToastMsg from '../../../toast-msg';

import { login } from '../../../../libs/api';
import { addToast } from '../../../../app/actions';
import IM from '../img/bg-01.jpg';
import '../styles.scss';

@withRouter
@connect(null, {
	addToast: addToast
})
export default class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			error: '',
			redirectToReferer: false,
			loading: false
		};
	}
	authenticate(data) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('token', JSON.stringify(data));
		}
	}
	ProtectedComponent = (authFails) => {
		if (authFails) return <Redirect to="/employees" />;
	};

	signin = (user) => {
		fetch(`http://localhost:8800/auth2`, {
			method: 'POST',
			body: JSON.stringify({ ...user })
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (data.error) {
					this.setState({ error: data.error, loading: false });
				} else {
					// authenticate
					console.log('data,data', data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	handleChange = (name) => (event) => {
		this.setState({ [name]: event.target.value });
	};

	clickSubmit = async (e) => {
		e.preventDefault();
		const { addToast } = this.props;
		this.setState({ loading: true });
		const { email, password } = this.state;
		const user = { EmployeeEmail: email, password };

		try {
			const res = await login(user);

			if (res) {
				if (typeof window !== 'undefined') {
					localStorage.setItem('users', JSON.stringify(res));
				}

				//await this.props.query.refetch()
				this.handleSuccess(() => {
					this.setState({ redirectToReferer: true });
				});
			} else {
			}
		} catch (e) {
			addToast(<ToastMsg text={'Login Invalid'} type="error" />);
		}
	};

	handleSuccess = (next) => {
		const Token = isAuthenticated && isAuthenticated().token;

		// const { url } = queryString.parse(this.props.location.search)
		if (!Token) {
			this.props.history.replace('/').then();
		} else {
			this.props.history.replace('/employee');
		}
	};

	handleChangeViewState = () => {
		const { handleChangeView } = this.props;
		handleChangeView && handleChangeView();
	};

	render() {
		const { redirectToReferer, loading } = this.state;

		return (
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100">
						<div className="login100-form-title" style={{ backgroundImage: `url(${IM} )` }}>
							<span className="login100-form-title-1">Sign In</span>
						</div>

						<form className="login100-form validate-form">
							<div className="wrap-input100 validate-input m-b-26" data-validate="email is required">
								<span className="label-input100">Email</span>
								<input
									className="input100"
									onChange={this.handleChange('email')}
									type="email"
									name="email"
									placeholder="Enter email"
								/>
								<span className="focus-input100" />
							</div>
							<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
								<span className="label-input100">Password</span>
								<input
									className="input100"
									type="password"
									name="pass"
									onChange={this.handleChange('password')}
									placeholder="Enter password"
								/>
								<span className="focus-input100" />
							</div>

							<div className="container-login100-form-btn">
								<button className="login100-form-btn" onClick={this.clickSubmit}>
									Sign In
								</button>{' '}
								OR
								<button className="login100-form-btn" onClick={this.handleChangeViewState}>
									Register Now
								</button>
							</div>
						</form>
					</div>
				</div>
				{loading ? (
					<div className="jumbotron text-center">
						<h2>Loading...</h2>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}
