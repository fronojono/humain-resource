import React, { Component } from 'react';
import { Button, TextField, DatePicker, SelectField, DialogContainer } from 'react-md';
// import PropTypes from 'prop-types';

export default class CreateAdminRequest extends Component {
	constructor(props) {
		super(props);
		const { userId, userName } = this.props

		this.state = {
			numberOfPaper: '',
			requestReason: '',
			applicationDate: '',
			RequestStatus: 'WAITING',
			AdminRequestStatus: '',
			requestType: "",
			appliedById: userId,
			appliedByName: userName
		};
	}

	show = () => {
		const { show } = this.props;
		show && show();
	};

	hide = () => {
		const { hide } = this.props;
		hide && hide();
	};
	handleSubmitClient = () => {
		const { numberOfPaper, applicationDate, RequestStatus, requestType, AdminRequestStatus, appliedById, appliedByName } = this.state;
		const { handleSubmit, ListAdminRequestType } = this.props;
		let obTypeRequest = ListAdminRequestType.filter((item) => {
			return item.value === requestType;
		});
		let obj = {};
		if (typeof obTypeRequest === 'object' && obTypeRequest.lenght !== 0) {
			obj = { id: obTypeRequest[0].value, RequestTypeName: obTypeRequest[0].label };
		}
		const infoClient = {
			numberOfPaper,
			applicationDate,
			appliedById,
			appliedByName,
			RequestStatus,
			AdminRequestStatus,
			requestType: obj
		};
		handleSubmit && handleSubmit(infoClient);
		this.hide();
	};
	validDialog = () => {
		const { numberOfPaper, requestType, applicationDate } = this.state
		if (!numberOfPaper || !requestType || !applicationDate) {
			return true
		} else return false
	};
	render() {
		const { numberOfPaper, applicationDate, requestType } = this.state;
		const { ListAdminRequestType, visible } = this.props;
		const actions = [];
		actions.push({ secondary: true, children: 'Cancel', onClick: this.hide });
		actions.push(
			<Button raised primary onClick={this.handleSubmitClient}>
				Confirm
			</Button>
		);
		const actionsAdminRe = [];
		actionsAdminRe.push({ children: 'Cancel', onClick: this.hide });
		actionsAdminRe.push(<Button flat primary onClick={this.handleSubmitClient} disabled={this.validDialog()}>Confirm</Button>);

		return (
			<DialogContainer
				id="simple-action-dialog"
				className="adminRequestDialog"
				visible={visible}
				onHide={this.hide}
				actions={actionsAdminRe}
				title="Create Admin Request "
			>
				<TextField
					id="numberOfPaper"
					className="adminRequestDialog-textField"
					placeholder="numberOfPaper"
					label="numberOfPaper"
					type="number"
					value={numberOfPaper}
					onChange={(numberOfPaper) =>
						this.setState({ numberOfPaper: Number.parseInt(numberOfPaper, 10) })}
				/>
				<DatePicker
					id="applicationDate"
					textFieldClassName="adminRequestDialog-textField"
					placeholder="applicationDate"
					label="applicationDate"
					value={applicationDate}
					onChange={(applicationDate) => this.setState({ applicationDate })}
					portal={true}
					lastChild={true}
					disableScrollLocking={true}
					renderNode={document.body}
				/>
				<SelectField
					id="requestType"
					className="adminRequestDialog-selectField"
					placeholder="requestType"
					label="requestType"
					menuItems={ListAdminRequestType}
					value={requestType}
					onChange={(requestType) => this.setState({ requestType })}
					position={SelectField.Positions.BELOW}
					fullWidth
				/>


			</DialogContainer>
		);
	}
}
