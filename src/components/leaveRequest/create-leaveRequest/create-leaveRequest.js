import React, { Component } from 'react';
import { Button, DialogContainer, SelectField, } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile, request_type } from '../../../libs/api';
import { addToast } from '../../../app/actions';
import { connect } from 'react-redux';
import moment from 'moment'
import { differenceInCalendarDays } from 'date-fns'
import DayPicker, { DateUtils } from 'react-day-picker'
import query from 'react-hoc-query'
import 'react-day-picker/lib/style.css';
import './style.scss'

@mutate({
	moduleName: 'uploadFile',
	mutations: {
		uploadFile,
	}
})
@query({
	name: 'request_type',
	key: 'request_type',
	op: request_type,

})
@connect(() => null, { addToast })
export default class AddLeaveRequest extends Component {
	static defaultProps = { numberOfMonths: 2 }

	constructor(props) {
		super(props)
		this.handleDayClick = this.handleDayClick.bind(this)
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
			LeaveReason: '',
			LeaveDays: '',
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
	handleDayClick(day) {
		const range = DateUtils.addDayToRange(day, this.state)
		this.setState(range)
		this.setState({
			LeaveStartDate: moment(range.from)
				.format('MM/DD/YYYY')
				.concat(' ')
				.concat(this.state.startTime),
			LeaveEndDate: moment(range.to)
				.format('MM/DD/YYYY')
				.concat(' ')
				.concat(this.state.endTime),
			LeaveDays: differenceInCalendarDays(
				moment(range.to).format('MM/DD/YYYY'),
				moment(range.from).format('MM/DD/YYYY')
			)
		})
	}
	getInitialState() {
		return {
			from: moment().format('MM/DD/YYYY'),
			to: undefined
		}
	}
	handleResetClick() {
		this.setState(this.getInitialState())
	}
	renderRequestType = () => {
		const { request_type } = this.props
		let listTypeRequest = []
		if (request_type && request_type.data&&request_type.data.r) {
			listTypeRequest = request_type.data.r.map((lop, i) => {
				return { 'RequestName': lop.RequestTypeName }
			})
		}
		return listTypeRequest
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
			AdminRequestStatus
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
			startTime,
			endTime,
			AppliedByName,
			pictures,
			empleaveBalance,
			AdminRequestStatus
		};
		handleSubmit && handleSubmit(infoClient);
	};
	validDialog = () => {
		const { LeaveReason, LeaveDays } = this.state
		if (!LeaveReason || !LeaveDays) {
			return true
		} else return false
	};
	render() {
		const { visible } = this.props;
		const { from, to, LeaveReason } = this.state
		const modifiers = { start: from, end: to }
		const actions = [];
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(<Button flat primary disabled={!from || !to} onClick={this.handleResetClick}>Reset</Button>);
		actions.push(<Button flat primary onClick={this.handleSubmitLeave} disabled={this.validDialog()}>Save</Button>);


		return (

			<DialogContainer
				id="simple-full-page-dialog"
				visible={visible}
				onHide={this.hide}
				title="New Leave Request"
				modal
				className="addLeaveRequest"
				actions={actions}
			>

				<div className="RangeExample">
					<SelectField
						id="LeaveType"
						name="LeaveType"
						label="Reason"
						fullWidth
						menuItems={this.renderRequestType()}
						value={LeaveReason}
						onChange={v => {
							this.setState({ LeaveReason: v })
						}}
						itemLabel="RequestName"
						itemValue="RequestName"
						position={SelectField.Positions.BELOW}
						className='RangeExample-selectField'
					/>
					<p className="dayPicker-header">
						{!from && !to && <span>Please select the <strong>first</strong> day.</span>}
						{from && !to && <span>Please select the <strong>last</strong> day.</span>}
						{from &&
							to &&
							<span>Selected from <strong>{from.toLocaleDateString()}</strong> to {' '}
								<strong>{to.toLocaleDateString()}</strong></span>}
					</p>

				</div>

				<div className="dayPicker-contain">
					<DayPicker
						className="Selectable"
						numberOfMonths={this.props.numberOfMonths}
						selectedDays={[from, { from, to }]}
						modifiers={modifiers}
						onDayClick={this.handleDayClick}
					/>
				</div>
			</DialogContainer>
		);
	}
}
