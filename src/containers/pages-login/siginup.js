import React, { Component } from 'react';
import { TextField, Paper, Button } from 'react-md';
import l from '../../langs/keys';
import i18n from 'i18n-js';
import mutate from '../../libs/hoc/mutate';
import { signup } from '../../libs/api/';

@mutate({
	moduleName: 'signup',
	mutations: {
		signup: signup
	}
})
export default class SiginUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			email: ''
		};
	}

	handleUsernameInput = (value) => {
		this.setState(() => ({ username: value }));
	};

	handlePasswordInput = (value) => {
		this.setState(() => ({ password: value }));
	};
	handleEmailInput = (value) => {
		this.setState(() => ({ email: value }));
	};
	handleSubmit = () => {
		const { username, password, email } = this.state;
		const { mutations: { signup } } = this.props;
		signup(username, email, password);
	};
	render() {
		return (
			<div className="place-login-page">
				<Paper zDepth={2} className="place-login-paper">
					<h1 className="place-login-paper-title">{i18n.t(l.loginTitle)}</h1>
					<TextField
						id="username"
						className="place-login-textfield"
						label={i18n.t(l.loginUserName)}
						onChange={this.handleUsernameInput}
					/>
					<TextField
						id="email"
						className="place-login-textfield"
						label={i18n.t(l.email)}
						type="email"
						onChange={this.handleEmailInput}
					/>
					<TextField
						id="password"
						className="place-login-textfield"
						label={i18n.t(l.loginPassword)}
						type="password"
						onChange={this.handlePasswordInput}
					/>
					<Button primary raised className="place-login-loginbtn" onClick={this.handleSubmit}>
						{i18n.t(l.loginBtn)}
					</Button>
					<div className="place-login-deco" />
				</Paper>
			</div>
		);
	}
}
