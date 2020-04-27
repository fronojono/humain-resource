import React, { Component } from 'react';
import { Button, DialogContainer, TextField } from 'react-md';
import { addToast } from '../../../app/actions';
import { connect } from 'react-redux';
import moment from 'moment'
import { TimePicker } from 'react-md/lib/Pickers';

import './style.scss'

@connect(() => null, { addToast })
export default class AddAuthorization extends Component {
	static defaultProps = { numberOfMonths: 2 }

	constructor(props) {
		super(props)
		this.handleResetClick = this.handleResetClick.bind(this)
		this.state = this.getInitialState()
		const { userId, userName } = this.props

		this.state = {
			AppliedById: userId,
			ApprovedBy: 'Waiting',
			ApplicationDate: moment(Date(new Date())).format('MM/DD/YYYY'),
			LeaveStartDate: moment(Date(new Date())).format('MM/DD/YYYY'),
			LeaveEndDate: moment(Date(new Date())).format('MM/DD/YYYY'),
			RequestStatus: 'On Hold',
			AdminRequestStatus: '',
			LeaveType: 'authorization',
			LeaveReason: '',
			LeaveDays: 0,
			startTime: '',
			endTime: '',
			AppliedByName: userName,
			empleaveBalance: ''
		}
	}

	show = (e) => {
		const { show } = this.props;
		show && show(e);
	};

	hide = () => {
		const { hide } = this.props;
		hide && hide();
	};

	getInitialState() {
		return {
			from: undefined,
			to: undefined
		}
	}
	handleResetClick() {
		this.setState(this.getInitialState())
	}

	handleSubmitLeave = () => {
		const {
			AppliedById,
			ApprovedBy,
			ApplicationDate,
			LeaveStartDate,
			LeaveEndDate,
			RequestStatus,
			LeaveReason,
			LeaveDays,
			startTime,
			endTime,
			AppliedByName,
			pictures,
			empleaveBalance,
			AdminRequestStatus,
			LeaveType
		} = this.state;
		const { handleSubmit } = this.props;
		const infoClient = {
			AppliedById,
			ApprovedBy,
			ApplicationDate,
			LeaveStartDate,
			LeaveEndDate,
			RequestStatus,
			LeaveReason,
			LeaveDays,
			LeaveStartTime: startTime,
			LeaveEndTime: endTime,
			AppliedByName,
			pictures,
			empleaveBalance,
			AdminRequestStatus,
			LeaveType
		};
		handleSubmit && handleSubmit(infoClient);
	};
	validDialog = () => {
		const { LeaveReason, startTime, endTime } = this.state
		if (!LeaveReason || !startTime || !endTime) {
			return true
		} else return false
	};
	render() {
		const { visible } = this.props;
		const { LeaveReason } = this.state
		const actions = [];
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(<Button flat primary onClick={this.handleSubmitLeave} disabled={this.validDialog()}>Save</Button>);

		return (

			<DialogContainer
				id="simple-full-page-dialog"
				visible={visible}
				onHide={this.hide}
				title="New Leave authorization"
				modal
				className="addLeaveAuthorization"
				actions={actions}
			>


				<div className="md-grid">

					<TimePicker
						id="time-picker-en-us-locale"
						label="Select a Start time"
						locales="en-US"
						textFieldClassName='addLeaveAuthorization-textFiled'
						className="md-cell md-cell--6"
						onChange={(startTime) => this.setState({ startTime })}
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}


					/>
					<TimePicker
						id="time-picker-en-us-locale"
						label="Select an End time"
						locales="en-US"
						textFieldClassName='addLeaveAuthorization-textFiled'
						className="md-cell md-cell--6"
						onChange={(endTime) => this.setState({ endTime })}
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}

					/>

					<TextField
						id="floating-center-title"
						label="Reason"
						lineDirection="center"
						placeholder="Reason"
						className="addLeaveAuthorization-textFiled md-cell md-cell--12"
						value={LeaveReason}
						onChange={(LeaveReason) => this.setState({ LeaveReason })}
					/>
				</div>
			</DialogContainer>

		);
	}
}
