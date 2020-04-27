import React, { Component, Fragment } from 'react';
import { Button } from 'react-md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { has, sortBy } from 'lodash';

import './style.scss';
import {
	ListLeaveRequest,
	DeleteLeaveRequest,
	newLeave_request,
	EditLeaveRequests,
	AcceptLeaveRequests,
	RejectLeaveRequests,
	leaveRequestsById,
	ListEmployees,
	leaveRequestsByManager
} from '../../libs/api';
import query from 'react-hoc-query';
import mutate from '../../libs/hoc/mutate';

import DataTable from '../../data-table';
import DialogDelete from '../dialog-delete';
import { ConfigColumnLeave, ConfigColumnAutorisation, ConfigColumnAuthorization } from './configTable';
import CreateLeaveRequest from './create-leaveRequest';
import EditLeaveRequest from './edit-leaveRequest';
import { addToast } from '../../app/actions';
import ToastMsg from '../toast-msg';
import { isAuthenticated } from '../../components/users/auth/auth';
import moment from 'moment';
import AddAuthorization from './create-authorization';
import EditAuthorization from './edit-authorization';
//leaveRequestsById(isAuthenticated().result.id)
@query({
	key: 'listLeaveRequest',
	name: 'listLeaveRequest',
	op: ListLeaveRequest
})
@query({
	key: 'leaveRequestsByManager',
	name: 'leaveRequestsByManager',
	op: () => leaveRequestsByManager(isAuthenticated().result.EmployeeFirstName)
})
@query({
	key: 'ListEmployees',
	name: 'ListEmployees',
	op: ListEmployees
})
@connect(
	({ query }) => ({
		ListLeaveRequest: query.DEFAULT
	}),
	{ addToast }
)
@mutate({
	moduleName: 'DeleteLeaveRequest',
	mutations: {
		deleteLeaveRequest: DeleteLeaveRequest,
		newLeave_request,
		EditLeaveRequests,
		AcceptLeaveRequests,
		RejectLeaveRequests
	}
})
@withRouter
@query({
	key: 'leaveRequestsById',
	name: 'leaveRequestsById',
	op: (props) => leaveRequestsById(props.userId ? props.userId : isAuthenticated().result.id)
})
class LeaveRequest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOfClient: [],
			changeView: 'card',
			visible: false,
			visibleA: false,
			visibleAuth: false,
			selectedRowIndex: null,
			getIdSelected: '',
			selectedRowIndexA: null,
			selectedRowIndexAuth: null,
			getIdSelectedAuth: '',
			getIdSelectedA: '',
			getIdSelectedAutho: '',
			selectedRowIndexAutho: null,
			pageX: null,
			pageY: null,
			visibleDeleteDialogue: false,
			visibleUpdateDialogue: false,
			visibleAuthorization: false,
			visibleAuthorizationDialogue: false
		};
	}
	componentDidUpdate(newProps) {
		const { addToast } = this.props;
		if (newProps.deleteLeaveRequestStatus !== this.props.deleteLeaveRequestStatus) {
			if (this.props.deleteLeaveRequestStatus.pending) {
				if (
					has(this.props, 'deleteLeaveRequestStatus.data') &&
					this.props.deleteLeaveRequestStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Deleted successfully'} type="success" />);
					this.hideDeleteDialogue();
					this.props.listLeaveRequest.refetch();
					this.props.leaveRequestsById.refetch();

					if (this.props.listLeaveRequest.length !== 0) {
						this.setState({
							getIdSelected: this.props.listLeaveRequest[this.state.selectedRowIndex + 1]
						});
					}
				}
			}
		}
		if (newProps.newLeave_requestStatus !== this.props.newLeave_requestStatus) {
			if (this.props.newLeave_requestStatus.pending) {
				if (
					has(this.props, 'newLeave_requestStatus.data') &&
					this.props.newLeave_requestStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Leave Added successfully'} type="success" />);
					this.props.listLeaveRequest.refetch();
					this.props.leaveRequestsById.refetch();
					this.hideDialogClient();
				}
			}
		}
		if (newProps.AcceptLeaveRequestsStatus !== this.props.AcceptLeaveRequestsStatus) {
			if (this.props.AcceptLeaveRequestsStatus.pending) {
				if (
					has(this.props, 'AcceptLeaveRequestsStatus.data') &&
					this.props.AcceptLeaveRequestsStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Leave Approved'} type="success" />);
					this.props.listLeaveRequest.refetch();
					this.props.leaveRequestsById.refetch();
					this.props.leaveRequestsByManager.refetch();

					this.hideUpdateDialogue();
				}
			}
		}
		if (newProps.RejectLeaveRequestsStatus !== this.props.RejectLeaveRequestsStatus) {
			if (this.props.RejectLeaveRequestsStatus.pending) {
				if (
					has(this.props, 'RejectLeaveRequestsStatus.data') &&
					this.props.RejectLeaveRequestsStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Leave Rejected'} type="success" />);
					this.props.listLeaveRequest.refetch();
					this.props.leaveRequestsById.refetch();
					this.props.leaveRequestsByManager.refetch();

					this.hideUpdateDialogue();
				}
			}
		}
		if (newProps.EditLeaveRequestsStatus !== this.props.EditLeaveRequestsStatus) {
			if (this.props.EditLeaveRequestsStatus.pending) {
				if (
					has(this.props, 'EditLeaveRequestsStatus.data') &&
					this.props.EditLeaveRequestsStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Leave Updated'} type="success" />);
					this.props.listLeaveRequest.refetch();
					this.props.leaveRequestsById.refetch();

					this.hideUpdateDialogue();
				}
			}
		}
		this.props.listLeaveRequest && this.props.listLeaveRequest.refetch();
	}
	showDialogClient = (e) => {
		let { pageX, pageY } = e;
		if (e.changedTouches) {
			pageX = e.changedTouches[0].pageX;
			pageY = e.changedTouches[0].pageY;
		}

		this.setState({ dialogVisibleUpdate: true, pageX, pageY });
	};
	handleChangeView = () => {
		const { changeView } = this.state;
		this.setState({ changeView: !changeView });
	};

	handleRowSelect = (selectedRowData, selectedRowIndex) => {
		if (selectedRowData && selectedRowData.id) {
			const getIdSelected = selectedRowData.id;
			this.setState({ getIdSelected, selectedRowIndex, selectedRowData });
		}
	};
	handleRowSelectById = (selectedRowDataMe, selectedRowIndexA) => {
		if (selectedRowDataMe && selectedRowDataMe.id) {
			const getIdSelectedA = selectedRowDataMe.id;
			this.setState({ getIdSelectedA, selectedRowIndexA, selectedRowDataMe });
		}
	};
	handleRowSelectAuthorization = (selectedRowDataAutho, selectedRowIndexAutho) => {
		if (selectedRowDataAutho && selectedRowDataAutho.id) {
			const getIdSelectedAutho = selectedRowDataAutho.id;
			this.setState({ getIdSelectedAutho, selectedRowIndexAutho, selectedRowDataAutho });
		}
	};
	handleRowSelectAuthorizationById = (selectedRowDataAuth, selectedRowIndexAuth) => {
		if (selectedRowDataAuth && selectedRowDataAuth.id) {
			const getIdSelectedAuth = selectedRowDataAuth.id;
			this.setState({ getIdSelectedAuth, selectedRowIndexAuth, selectedRowDataAuth });
		}
	};
	isEmpty = (obj) => {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}

		return JSON.stringify(obj) === JSON.stringify({});
	};
	handleSubmit = (objClient) => {
		const { mutations: { newLeave_request }, employee } = this.props;
		if (employee && typeof employee === 'object') {
			let check = this.isEmpty(employee);
			if (!check) {
				objClient.AppliedByName = employee.AppliedByName;
				objClient.AppliedById = employee.AppliedById;
			}
		}

		newLeave_request(objClient);
	};
	handleSubmitEditLeaveRequest = (obj) => {
		const { getIdSelected } = this.state;
		const { mutations: { EditLeaveRequests } } = this.props;
		EditLeaveRequests(getIdSelected, obj);
	};
	handleSubmitEditAuthorization = (obj) => {
		const { getIdSelectedAuth } = this.state;
		const { mutations: { EditLeaveRequests } } = this.props;
		EditLeaveRequests(getIdSelectedAuth, obj);
	};
	showDialogClient = () => {
		this.setState({ visible: true });
	};
	showDialogAuthorization = () => {
		this.setState({ visibleAuthorization: true });
	};
	showDialogClientA = () => {
		this.setState({ visibleA: true });
	};
	hideDialogClient = () => {
		this.setState({ visible: false });
	};
	hideDialogClientA = () => {
		this.setState({ visibleA: false });
	};
	hideDialogAuthorization = () => {
		this.setState({ visibleAuthorization: false });
	};
	renderDataTableDataLeave = () => {
		const { ListLeaveRequest } = this.props;
		let listLeave = [];
		if (
			ListLeaveRequest &&
			ListLeaveRequest.listLeaveRequest &&
			ListLeaveRequest.listLeaveRequest.data &&
			ListLeaveRequest.listLeaveRequest.data.l
		) {
			const sortedList = sortBy(ListLeaveRequest.listLeaveRequest.data.l, (li) =>
				moment(li.ApplicationDate)
			).reverse();
			listLeave = sortedList.filter((item) => item.LeaveType === '').map((c) => {
				return {
					LeaveReason: c.LeaveReason,
					LeaveStartDate: c.LeaveStartDate,
					LeaveEndDate: c.LeaveEndDate,
					ApplicationDate: c.ApplicationDate,
					AppliedByName: c.AppliedByName,
					LeaveBalance: c.LeaveBalance,
					id: c.id,
					RequestStatus: c.RequestStatus,
					LeaveDays: c.LeaveDays,
					ApprouvedByName: c.ApprouvedByName,
					ApprouvedById: c.ApprouvedById,
					AppliedById: c.AppliedById,
					AdminRequestStatus: c.AdminRequestStatus
				};
			});
		}

		return listLeave;
	};
	renderDataTableDataAuthorization = () => {
		const { ListLeaveRequest } = this.props;
		let listLeave = [];
		if (
			ListLeaveRequest &&
			ListLeaveRequest.listLeaveRequest &&
			ListLeaveRequest.listLeaveRequest.data &&
			ListLeaveRequest.listLeaveRequest.data.l
		) {
			const sortedList = sortBy(ListLeaveRequest.listLeaveRequest.data.l, (li) =>
				moment(li.ApplicationDate)
			).reverse();
			listLeave = sortedList.filter((item) => item.LeaveType === 'authorization').map((c) => {
				return {
					LeaveReason: c.LeaveReason,
					LeaveStartDate: c.LeaveStartDate,
					LeaveEndDate: c.LeaveEndDate,
					ApplicationDate: c.ApplicationDate,
					AppliedByName: c.AppliedByName,
					LeaveBalance: c.LeaveBalance,
					id: c.id,
					RequestStatus: c.RequestStatus,
					LeaveDays: c.LeaveDays,
					ApprouvedByName: c.ApprouvedByName,
					ApprouvedById: c.ApprouvedById,
					AppliedById: c.AppliedById,
					AdminRequestStatus: c.AdminRequestStatus,
					StartTime: c.LeaveStartTime,
					EndTime: c.LeaveEndTime,
					LeaveType: c.LeaveType
				};
			});
		}

		return listLeave;
	};
	renderDataTableLeaveByManager = () => {
		const { leaveRequestsByManager } = this.props;
		let listLeave = [];
		if (leaveRequestsByManager && leaveRequestsByManager.data && leaveRequestsByManager.data.data) {
			const sortedList = sortBy(leaveRequestsByManager.data.data, (li) => moment(li.ApplicationDate)).reverse();
			listLeave = sortedList.map((c) => {
				return {
					LeaveReason: c.LeaveReason,
					LeaveStartDate: c.LeaveStartDate,
					LeaveEndDate: c.LeaveEndDate,
					ApplicationDate: c.ApplicationDate,
					AppliedByName: c.AppliedByName,
					LeaveBalance: c.LeaveBalance,
					id: c.id,
					RequestStatus: c.RequestStatus,
					LeaveDays: c.LeaveDays,
					ApprouvedByName: c.ApprouvedByName,
					ApprouvedById: c.ApprouvedById,
					AppliedById: c.AppliedById,
					AdminRequestStatus: c.AdminRequestStatus
				};
			});
		}

		return listLeave;
	};
	renderDataTableDataById = () => {
		/* window && window.location.reload(); */
		const { leaveRequestsById } = this.props;
		let listLeaveById = [];
		if (leaveRequestsById && leaveRequestsById.data && leaveRequestsById.data.l) {
			const sortedList = sortBy(leaveRequestsById.data.l, (li) => moment(li.ApplicationDate)).reverse();
			listLeaveById = sortedList.filter((item) => item.LeaveType === '').map((c) => {
				return {
					LeaveReason: c.LeaveReason,
					LeaveStartDate: c.LeaveStartDate,
					LeaveEndDate: c.LeaveEndDate,
					ApplicationDate: c.ApplicationDate,
					AppliedByName: c.AppliedByName,
					LeaveBalance: c.LeaveBalance,
					id: c.id,
					RequestStatus: c.RequestStatus,
					LeaveDays: c.LeaveDays,
					ApprouvedByName: c.ApprouvedByName,
					ApprouvedById: c.ApprouvedById,
					AppliedById: c.AppliedById,
					AdminRequestStatus: c.AdminRequestStatus
					// leaveMealone: this.renderLeaveRequest()
				};
			});
		}

		return listLeaveById;
	};
	renderDataTableAuthorizationById = () => {
		const { leaveRequestsById } = this.props;
		let listLeaveById = [];
		if (leaveRequestsById && leaveRequestsById.data && leaveRequestsById.data.l) {
			const sortedList = sortBy(leaveRequestsById.data.l, (li) => moment(li.ApplicationDate)).reverse();
			listLeaveById = sortedList.filter((item) => item.LeaveType === 'authorization').map((c) => {
				return {
					LeaveReason: c.LeaveReason,

					ApplicationDate: c.ApplicationDate,
					AppliedByName: c.AppliedByName,
					id: c.id,
					RequestStatus: c.RequestStatus,
					ApprouvedByName: c.ApprouvedByName,
					ApprouvedById: c.ApprouvedById,
					AppliedById: c.AppliedById,
					AdminRequestStatus: c.AdminRequestStatus,
					StartTime: c.LeaveStartTime,
					EndTime: c.LeaveEndTime,
					LeaveType: c.LeaveType
					// leaveMealone: this.renderLeaveRequest()
				};
			});
		}

		return listLeaveById;
	};
	AcceptLeaveRequest() {
		const { getIdSelected, selectedRowData } = this.state;
		const { mutations: { AcceptLeaveRequests }, userName, userId } = this.props;
		const AppliedByName = selectedRowData && selectedRowData.AppliedByName;
		const LeaveBalance = selectedRowData && selectedRowData.LeaveBalance;
		const LeaveEndDate = selectedRowData && selectedRowData.LeaveEndDate;
		const LeaveReason = selectedRowData && selectedRowData.LeaveReason;
		const LeaveStartDate = selectedRowData && selectedRowData.LeaveStartDate;
		const LeaveDays = selectedRowData && selectedRowData.LeaveDays;
		const ApplicationDate = selectedRowData && selectedRowData.ApplicationDate;
		const AppliedById = selectedRowData && selectedRowData.AppliedById;
		const obj = {
			AppliedByName,
			LeaveBalance,
			LeaveEndDate,
			LeaveReason,
			LeaveStartDate,
			AdminRequestStatus: 'Accepted',
			LeaveDays,
			ApplicationDate,
			AppliedById,
			ApprouvedByName: userName,
			ApprouvedById: userId
		};
		AcceptLeaveRequests(getIdSelected, obj);
	}
	AcceptAuthorizationRequest() {
		const { getIdSelectedAutho, selectedRowDataAutho } = this.state;
		const { mutations: { AcceptLeaveRequests }, userName, userId } = this.props;
		const AppliedByName = selectedRowDataAutho && selectedRowDataAutho.AppliedByName;
		const LeaveBalance = selectedRowDataAutho && selectedRowDataAutho.LeaveBalance;
		const LeaveEndDate = selectedRowDataAutho && selectedRowDataAutho.LeaveEndDate;
		const LeaveReason = selectedRowDataAutho && selectedRowDataAutho.LeaveReason;
		const LeaveStartDate = selectedRowDataAutho && selectedRowDataAutho.LeaveStartDate;
		const LeaveDays = selectedRowDataAutho && selectedRowDataAutho.LeaveDays;
		const ApplicationDate = selectedRowDataAutho && selectedRowDataAutho.ApplicationDate;
		const AppliedById = selectedRowDataAutho && selectedRowDataAutho.AppliedById;
		const LeaveType = selectedRowDataAutho && selectedRowDataAutho.LeaveType;
		const StartTime = selectedRowDataAutho && selectedRowDataAutho.StartTime;
		const EndTime = selectedRowDataAutho && selectedRowDataAutho.EndTime;
		const obj = {
			AppliedByName,
			LeaveBalance,
			LeaveEndDate,
			LeaveReason,
			LeaveStartDate,
			AdminRequestStatus: 'Accepted',
			LeaveDays,
			ApplicationDate,
			AppliedById,
			ApprouvedByName: userName,
			ApprouvedById: userId,
			LeaveType,
			LeaveStartTime: StartTime,
			LeaveEndTime: EndTime
		};
		AcceptLeaveRequests(getIdSelectedAutho, obj);
	}
	FinalAcceptAuthorizationRequest() {
		const { getIdSelectedAutho, selectedRowDataAutho } = this.state;
		const { mutations: { AcceptLeaveRequests }, userName, userId } = this.props;
		const AppliedByName = selectedRowDataAutho && selectedRowDataAutho.AppliedByName;
		const LeaveBalance = selectedRowDataAutho && selectedRowDataAutho.LeaveBalance;
		const LeaveEndDate = selectedRowDataAutho && selectedRowDataAutho.LeaveEndDate;
		const LeaveReason = selectedRowDataAutho && selectedRowDataAutho.LeaveReason;
		const LeaveStartDate = selectedRowDataAutho && selectedRowDataAutho.LeaveStartDate;
		const LeaveDays = selectedRowDataAutho && selectedRowDataAutho.LeaveDays;
		const ApplicationDate = selectedRowDataAutho && selectedRowDataAutho.ApplicationDate;
		const AppliedById = selectedRowDataAutho && selectedRowDataAutho.AppliedById;
		const LeaveType = selectedRowDataAutho && selectedRowDataAutho.LeaveType;
		const StartTime = selectedRowDataAutho && selectedRowDataAutho.StartTime;
		const EndTime = selectedRowDataAutho && selectedRowDataAutho.EndTime;
		const obj = {
			AppliedByName,
			LeaveBalance,
			LeaveEndDate,
			LeaveReason,
			LeaveStartDate,
			AdminRequestStatus: 'Approved',
			LeaveDays,
			ApplicationDate,
			AppliedById,
			ApprouvedByName: userName,
			ApprouvedById: userId,
			LeaveType,
			LeaveStartTime: StartTime,
			LeaveEndTime: EndTime
		};
		AcceptLeaveRequests(getIdSelectedAutho, obj);
	}
	RejectAuthorizationRequest() {
		const { getIdSelectedAutho, selectedRowDataAutho } = this.state;
		const { mutations: { RejectLeaveRequests }, userName, userId } = this.props;
		const AppliedByName = selectedRowDataAutho && selectedRowDataAutho.AppliedByName;
		const LeaveBalance = selectedRowDataAutho && selectedRowDataAutho.LeaveBalance;
		const LeaveEndDate = selectedRowDataAutho && selectedRowDataAutho.LeaveEndDate;
		const LeaveReason = selectedRowDataAutho && selectedRowDataAutho.LeaveReason;
		const LeaveStartDate = selectedRowDataAutho && selectedRowDataAutho.LeaveStartDate;
		const LeaveDays = selectedRowDataAutho && selectedRowDataAutho.LeaveDays;
		const ApplicationDate = selectedRowDataAutho && selectedRowDataAutho.ApplicationDate;
		const AppliedById = selectedRowDataAutho && selectedRowDataAutho.AppliedById;
		const LeaveType = selectedRowDataAutho && selectedRowDataAutho.LeaveType;
		const StartTime = selectedRowDataAutho && selectedRowDataAutho.StartTime;
		const EndTime = selectedRowDataAutho && selectedRowDataAutho.EndTime;
		const obj = {
			AppliedByName,
			LeaveBalance,
			LeaveEndDate,
			LeaveReason,
			LeaveStartDate,
			AdminRequestStatus: 'Rejected',
			LeaveDays,
			ApplicationDate,
			AppliedById,
			ApprouvedByName: userName,
			ApprouvedById: userId,
			LeaveType,
			LeaveStartTime: StartTime,
			LeaveEndTime: EndTime
		};
		RejectLeaveRequests(getIdSelectedAutho, obj);
	}
	FinalAcceptLeaveRequest() {
		const { getIdSelected, selectedRowData } = this.state;
		const { mutations: { AcceptLeaveRequests }, userName, userId } = this.props;
		const AppliedByName = selectedRowData && selectedRowData.AppliedByName;
		const LeaveBalance = selectedRowData && selectedRowData.LeaveBalance;
		const LeaveEndDate = selectedRowData && selectedRowData.LeaveEndDate;
		const LeaveReason = selectedRowData && selectedRowData.LeaveReason;
		const LeaveStartDate = selectedRowData && selectedRowData.LeaveStartDate;
		const LeaveDays = selectedRowData && selectedRowData.LeaveDays;
		const ApplicationDate = selectedRowData && selectedRowData.ApplicationDate;
		const AppliedById = selectedRowData && selectedRowData.AppliedById;

		const obj = {
			AppliedByName,
			LeaveBalance,
			LeaveEndDate,
			LeaveReason,
			LeaveStartDate,
			AdminRequestStatus: 'Approved',
			LeaveDays,
			ApplicationDate,
			AppliedById,
			ApprouvedByName: userName,
			ApprouvedById: userId
		};
		AcceptLeaveRequests(getIdSelected, obj);
	}
	RefuseLeaveRequest() {
		const { getIdSelected, selectedRowData } = this.state;
		const { mutations: { RejectLeaveRequests } } = this.props;
		const AppliedByName = selectedRowData && selectedRowData.AppliedByName;
		const LeaveBalance = selectedRowData && selectedRowData.LeaveBalance;
		const LeaveEndDate = selectedRowData && selectedRowData.LeaveEndDate;
		const LeaveReason = selectedRowData && selectedRowData.LeaveReason;
		const LeaveStartDate = selectedRowData && selectedRowData.LeaveStartDate;
		const LeaveDays = selectedRowData && selectedRowData.LeaveDays;
		const ApprouvedByName = selectedRowData && selectedRowData.ApprouvedByName;
		const ApprouvedById = selectedRowData && selectedRowData.ApprouvedById;
		const ApplicationDate = selectedRowData && selectedRowData.ApplicationDate;
		const AppliedById = selectedRowData && selectedRowData.AppliedById;

		const obj = {
			AppliedByName,
			LeaveBalance,
			LeaveEndDate,
			LeaveReason,
			LeaveStartDate,
			AdminRequestStatus: 'Rejected',
			LeaveDays,
			ApprouvedByName,
			ApprouvedById,
			ApplicationDate,
			AppliedById
		};
		RejectLeaveRequests(getIdSelected, obj);
	}
	openDetailsA() {
		const { history } = this.props;
		const { getIdSelectedA } = this.state;
		history.push(`/leaveRequest/${getIdSelectedA}`);
	}
	EditLeaveRequestMe = () => {
		this.setState({
			visibleUpdateDialogue: true
		});
	};
	hideUpdateDialogue = () => {
		this.setState({
			visibleUpdateDialogue: false
		});
	};
	hideUpdateAuthorizationDialogue = () => {
		this.setState({
			visibleAuthorizationDialogue: false
		});
	};
	EditLeaveRequestA = () => {
		this.setState({
			visibleUpdateDialogue: true
		});
	};
	EditAuthorization = () => {
		this.setState({
			visibleAuthorizationDialogue: true
		});
	};
	DeleteLeaveRequest = () => {
		this.setState({
			visibleDeleteDialogue: true
		});
	};
	hideDeleteDialogue = () => {
		this.setState({
			visibleDeleteDialogue: false
		});
	};
	handelCancelRow = () => {
		const { mutations: { deleteLeaveRequest } } = this.props;
		const { getIdSelectedA } = this.state;
		deleteLeaveRequest(getIdSelectedA);
	};
	handelCancelRowAuthorization = () => {
		const { mutations: { deleteLeaveRequest } } = this.props;
		const { getIdSelectedAuth } = this.state;
		deleteLeaveRequest(getIdSelectedAuth);
	};
	DeleteLeaveRequestA = () => {
		this.setState({
			visibleDeleteDialogue: true
		});
	};
	hideDeleteDialogueA = () => {
		this.setState({
			visibleDeleteDialogue: false
		});
	};

	render() {
		const {
			visible,
			getIdSelected,
			visibleAuthorization,
			visibleA,
			visibleDeleteDialogue,
			visibleUpdateDialogue,
			visibleAuthorizationDialogue,
			getIdSelectedA,
			selectedRowDataMe,
			selectedRowDataAuth,
			getIdSelectedAuth,
			changeView,
			selectedRowDataAutho
		} = this.state;
		const visibleEdit = selectedRowDataMe && selectedRowDataMe.AdminRequestStatus;
		const visibleEditAuth = selectedRowDataAuth && selectedRowDataAuth.AdminRequestStatus;
		const { role, userName, userId } = this.props;

		return (
			<div className="leaveRequest">
				<div className="leaveRequest-header md-paper--1">
					{changeView === 'grid' ? (
						(role === 3 || role === 0) &&
						getIdSelected && (
							<div className="leaveRequest-header-buttonWrapper">
								<Button
									flat
									className="accept-btn"
									disabled={!getIdSelected}
									iconChildren="check_circle"
									onClick={() =>
										role === 0 ? this.AcceptLeaveRequest() : this.FinalAcceptLeaveRequest()}
								>
									Approve Leave
								</Button>
								<Button
									flat
									className="reject-btn"
									disabled={!getIdSelected}
									iconChildren="cancel"
									onClick={() => this.RefuseLeaveRequest()}
								>
									Reject Leave
								</Button>
							</div>
						)
					) : (
						<div className="leaveRequest-header-buttonWrapper">
							<Button primary flat swapTheming onClick={this.showDialogClient}>
								Create Leave Request
							</Button>
							{getIdSelectedA && (
								<Fragment>
									<Button
										flat
										className="reject-btn"
										disabled={visibleEdit !== 'Pending'}
										iconChildren="delete"
										onClick={() => this.DeleteLeaveRequest()}
									>
										Delete leave Request
									</Button>
									<Button
										primary
										flat
										swapTheming={visibleEdit === 'Pending'}
										className="create-btn"
										iconChildren="edit"
										disabled={visibleEdit !== 'Pending'}
										onClick={() => this.EditLeaveRequestA()}
									>
										Edit LEAVE REQUEST
									</Button>
								</Fragment>
							)}
						</div>
					)}
					{(role === 3 || role === 0) && (
						<div className="changeViewButtons">
							<Button
								icon
								className={`viewButton ${changeView === 'grid' ? 'selected' : ''}`}
								onClick={() => this.setState({ changeView: 'grid' })}
							>
								view_stream
							</Button>
							<Button
								icon
								className={`viewButton ${changeView === 'card' ? 'selected' : ''}`}
								onClick={() => this.setState({ changeView: 'card' })}
							>
								view_module
							</Button>
						</div>
					)}
				</div>

				<div className="leaveRequest-body">
					{changeView === 'grid' ? (
						(role === 3 || role === 0) && (
							<Fragment>
								<DataTable
									withPadding
									showControls
									columnConfig={ConfigColumnLeave}
									data={
										role === 3 ? (
											this.renderDataTableDataLeave()
										) : (
											this.renderDataTableLeaveByManager()
										)
									}
									title="List Of Leave Request"
									onRowSelect={this.handleRowSelect}
									Leave={this.state.Leave}
									selectedRowIndex={this.state.selectedRowIndex}
								/>
								<div className="leave-admin-button md-paper--1">
									{selectedRowDataAutho && (
										<Fragment>
											<Button
												flat
												className="accept-btn"
												iconChildren="check_circle"
												disabled={!selectedRowDataAutho}
												onClick={() =>
													role === 0
														? this.AcceptAuthorizationRequest()
														: this.FinalAcceptAuthorizationRequest()}
											>
												Approve Authorization
											</Button>
											<Button
												flat
												className="reject-btn"
												iconChildren="cancel"
												disabled={!selectedRowDataAutho}
												onClick={() => this.RejectAuthorizationRequest()}
											>
												Reject Authorization
											</Button>
										</Fragment>
									)}
								</div>
								<DataTable
									withPadding
									showControls
									columnConfig={ConfigColumnAuthorization}
									data={this.renderDataTableDataAuthorization()}
									title="List Of Authorization Request"
									onRowSelect={this.handleRowSelectAuthorization}
									Leave={this.state.Leave}
									selectedRowIndex={this.state.selectedRowIndexAutho}
								/>
							</Fragment>
						)
					) : (
						<Fragment>
							<DataTable
								withPadding
								showControls
								columnConfig={ConfigColumnAutorisation}
								title="List Of My Leave Request"
								data={this.renderDataTableDataById()}
								onRowSelect={this.handleRowSelectById}
								selectedRowIndex={this.state.selectedRowIndexA}
							/>
							<div className="leave-admin-button">
								<Button
									primary
									flat
									swapTheming
									className="create-btn"
									onClick={this.showDialogAuthorization}
								>
									Create Authorization Request
								</Button>
								{getIdSelectedAuth && (
									<Fragment>
										<Button
											flat
											className="reject-btn"
											disabled={visibleEditAuth !== 'Pending'}
											iconChildren="delete"
											onClick={() => this.DeleteLeaveRequest()}
										>
											Delete Authorization Request
										</Button>
										<Button
											primary
											flat
											swapTheming={visibleEditAuth === 'Pending'}
											className="create-btn"
											iconChildren="edit"
											disabled={visibleEditAuth !== 'Pending'}
											onClick={() => this.EditAuthorization()}
										>
											Edit Authorization REQUEST
										</Button>
									</Fragment>
								)}
							</div>
							<DataTable
								withPadding
								showControls
								columnConfig={ConfigColumnAuthorization}
								title="List Of My Authorization  Request"
								data={this.renderDataTableAuthorizationById()}
								onRowSelect={this.handleRowSelectAuthorizationById}
								selectedRowIndex={this.state.selectedRowIndexAuth}
							/>
						</Fragment>
					)}
				</div>

				{visible && (
					<CreateLeaveRequest
						handleSubmit={this.handleSubmit}
						show={this.showDialogClient}
						hide={this.hideDialogClient}
						visible={visible}
						userId={userId}
						userName={userName}
					/>
				)}

				{visibleA && (
					<CreateLeaveRequest
						handleSubmitA={this.handleSubmitA}
						show={this.showDialogClientA}
						hide={this.hideDialogClientA}
						visible={visibleA}
						ListLeaveRequest={ListLeaveRequest}
					/>
				)}
				{visibleAuthorization && (
					<AddAuthorization
						handleSubmit={this.handleSubmit}
						show={this.showDialogClient}
						hide={this.hideDialogAuthorization}
						visible={visibleAuthorization}
						userId={userId}
						userName={userName}
					/>
				)}

				{visibleUpdateDialogue && (
					<EditLeaveRequest
						show={this.showDialogClientA}
						hide={this.hideUpdateDialogue}
						visible={visibleUpdateDialogue}
						ListLeaveRequest={ListLeaveRequest}
						selectedRowData={selectedRowDataMe}
						handleSubmitEditLeaveRequest={this.handleSubmitEditLeaveRequest}
					/>
				)}
				{visibleAuthorizationDialogue && (
					<EditAuthorization
						show={this.showDialogAuthorization}
						hide={this.hideUpdateAuthorizationDialogue}
						visible={visibleAuthorizationDialogue}
						ListLeaveRequest={ListLeaveRequest}
						selectedRowData={selectedRowDataAuth}
						handleEditAuthorization={this.handleSubmitEditAuthorization}
					/>
				)}

				<DialogDelete
					handelCancelRow={getIdSelectedA ? this.handelCancelRow : this.handelCancelRowAuthorization}
					hideDeleteDialogue={this.hideDeleteDialogue}
					visibleDeleteDialogue={visibleDeleteDialogue}
				/>
			</div>
		);
	}
}
export default LeaveRequest;
