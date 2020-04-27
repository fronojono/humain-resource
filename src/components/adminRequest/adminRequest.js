import React, { Component } from 'react';
import { Button } from 'react-md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { has, sortBy } from 'lodash';

import './style.scss';
import {
	ListAdminRequest,
	AdminRequestById,
	DeleteAdminRequest,
	ListAdminRequestType,
	AddNewAdminRequest,
	EditAdminRequests,
	AcceptedAdminRequests,
	RejectAdminRequests
} from '../../libs/api';
import query from 'react-hoc-query';
import mutate from '../../libs/hoc/mutate';

import DataTable from '../../data-table';
import ConfigColumn from './configTable';
import CreateAdminRequest from './create-adminRequest';
import DialogDelete from '../dialog-delete';
import { addToast } from '../../app/actions';
import EditAdminRequest from './edit-admin-request';
import ToastMsg from '../toast-msg';
import { isAuthenticated } from '../../components/users/auth/auth';
import moment from 'moment';

@query({
	key: 'adminRequest',
	name: 'adminRequest',
	op: ListAdminRequest
})
@query({
	key: 'adminRequestsById',
	name: 'AdminRequestsById',
	op: () => AdminRequestById(isAuthenticated().result.id)
})
@query({
	key: 'adminRequestType',
	name: 'adminRequestType',
	op: ListAdminRequestType
})
@connect(
	({ query }) => ({
		ListAdminRequest: query.DEFAULT
	}),
	{ addToast }
)
@mutate({
	moduleName: 'DeleteAdminRequest',
	mutations: {
		deleteAdminRequest: DeleteAdminRequest,
		addNewAdminRequest: AddNewAdminRequest,
		editAdminRequest: EditAdminRequests,
		AcceptedAdminRequests,
		RejectAdminRequests
	}
})
@withRouter
class AdminRequest extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOfClient: [],
			visible: false,
			selectedRowIndex: null,
			selectedRowIndexMe: null,
			getIdSelected: '',
			getIdSelectedMe: '',
			visibleDeleteDialogue: false,
			visibleAdmin: false,
			pageX: null,
			pageY: null,
			visibleEditAdminRequest: false,
			selectedRowData: {},
			selectedRowDataMe: {}
		};
	}
	componentDidUpdate(newProps) {
		const { addToast } = this.props;
		if (newProps.deleteAdminRequestStatus !== this.props.deleteAdminRequestStatus) {
			if (this.props.deleteAdminRequestStatus.pending) {
				if (
					has(this.props, 'deleteAdminRequestStatus.data') &&
					this.props.deleteAdminRequestStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Deleted successfully'} type="success" />);

					this.hideDeleteDialogue();
					this.props.adminRequest.refetch();
					this.props.AdminRequestsById.refetch();
				}
			}
		}
		if (newProps.addNewAdminRequestStatus !== this.props.addNewAdminRequestStatus) {
			if (this.props.addNewAdminRequestStatus.pending) {
				if (
					has(this.props, 'addNewAdminRequestStatus.data') &&
					this.props.addNewAdminRequestStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Added successfully'} type="success" />);

					this.hideDialogClient();
					this.props.adminRequest.refetch();
					this.props.AdminRequestsById.refetch();
				}
			}
		}
		if (newProps.editAdminRequestStatus !== this.props.editAdminRequestStatus) {
			if (this.props.editAdminRequestStatus.pending) {
				if (
					has(this.props, 'editAdminRequestStatus.data') &&
					this.props.editAdminRequestStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Edit successfully'} type="success" />);

					this.hideDialogEditAdminRequest();
					this.props.adminRequest.refetch();
					this.props.AdminRequestsById.refetch();
				}
			}
		}
		if (newProps.AcceptedAdminRequestsStatus !== this.props.AcceptedAdminRequestsStatus) {
			if (this.props.AcceptedAdminRequestsStatus.pending) {
				if (
					has(this.props, 'AcceptedAdminRequestsStatus.data') &&
					this.props.AcceptedAdminRequestsStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Request Ready'} type="success" />);
					this.props.adminRequest.refetch();
					this.props.AdminRequestsById.refetch();
				}
			}
		}
		if (newProps.RejectAdminRequestsStatus !== this.props.RejectAdminRequestsStatus) {
			if (this.props.RejectAdminRequestsStatus.pending) {
				if (
					has(this.props, 'RejectAdminRequestsStatus.data') &&
					this.props.RejectAdminRequestsStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Request In Process'} type="success" />);
					this.props.adminRequest.refetch();
					this.props.AdminRequestsById.refetch();
				}
			}
		}
	}
	handleRowSelect = (selectedRowData, selectedRowIndex) => {
		if (selectedRowData && selectedRowData.id) {
			const getIdSelected = selectedRowData.id;
			this.setState({ getIdSelected, selectedRowIndex, selectedRowData });
		}
	};
	handleRowSelectMe = (selectedRowDataMe, selectedRowIndexMe) => {
		if (selectedRowDataMe && selectedRowDataMe.id) {
			const getIdSelectedMe = selectedRowDataMe.id;
			this.setState({ getIdSelectedMe, selectedRowIndexMe, selectedRowDataMe });
		}
	};
	handleSubmit = (objClient) => {
		const { mutations: { addNewAdminRequest } } = this.props;
		addNewAdminRequest(objClient);
	};
	showDialogClient = () => {
		this.setState({ visible: true });
	};

	hideDialogClient = () => {
		this.setState({ visible: false });
	};
	renderDataTableData = () => {
		const { ListAdminRequest } = this.props;
		let listClient = [];
		if (
			ListAdminRequest &&
			ListAdminRequest.adminRequest &&
			ListAdminRequest.adminRequest.data &&
			ListAdminRequest.adminRequest.data.a
		) {
			const sortedList = sortBy(ListAdminRequest.adminRequest.data.a, (li) =>
				moment(li.ApplicationDate)
			).reverse();
			listClient = sortedList.map((c) => {
				let requestType;
				let requestid;
				if (c && c.RequestType) {
					requestType = c.RequestType.RequestTypeName;
					requestid = c.RequestType.id;
				}
				return {
					NumberOfPaper: c.NumberOfPaper,
					ApplicationDate: c.ApplicationDate,
					RequestStatus: c.RequestStatus,
					AdminRequestStatus: c.AdminRequestStatus,
					RequestType: requestType,
					requestid: requestid,
					AppliedByName: c.AppliedByName,
					id: c.id,
					AppliedById: c.AppliedById,

				};
			});
		}
		return listClient;
	};
	renderDataTableDataMe = () => {
		const { AdminRequestsById } = this.props;
		let listClient = [];
		if (AdminRequestsById && AdminRequestsById.data && AdminRequestsById.data.a) {
			const sortedList = sortBy(AdminRequestsById.data.a, (li) => moment(li.ApplicationDate)).reverse();
			listClient = sortedList.map((c) => {
				let requestType;
				let requestid;
				if (c && c.RequestType) {
					requestType = c.RequestType.RequestTypeName;
					requestid = c.RequestType.id;
				}
				return {
					NumberOfPaper: c.NumberOfPaper,
					ApplicationDate: c.ApplicationDate,
					RequestStatus: c.RequestStatus,
					AdminRequestStatus: c.AdminRequestStatus,
					RequestType: requestType,
					requestid: requestid,
					AppliedByName: c.AppliedByName,
					id: c.id,
					AppliedById: c.AppliedById,

				};
			});
		}
		return listClient;
	};
	AcceptAdminRequest() {
		const { getIdSelected, selectedRowData } = this.state;
		const { mutations: { AcceptedAdminRequests } } = this.props;
		const NumberOfPaper = selectedRowData && selectedRowData.NumberOfPaper
		const ApplicationDate = selectedRowData && selectedRowData.ApplicationDate
		const RequestType = { RequestTypeName: selectedRowData.RequestType, id: selectedRowData.requestid }
		const AppliedByName = selectedRowData && selectedRowData.AppliedByName
		const AppliedById = selectedRowData && selectedRowData.AppliedById
		const obj = {
			NumberOfPaper,
			ApplicationDate,
			RequestType,
			AdminRequestStatus: 'READY',
			AppliedByName,
			AppliedById
		};
		AcceptedAdminRequests(getIdSelected, obj);
	}
	AdminRequestInProcess() {
		const { getIdSelected, selectedRowData } = this.state;
		const { mutations: { RejectAdminRequests } } = this.props;
		const NumberOfPaper = selectedRowData && selectedRowData.NumberOfPaper;
		const ApplicationDate = selectedRowData && selectedRowData.ApplicationDate;
		const RequestType = { RequestTypeName: selectedRowData.RequestType, id: selectedRowData.requestid };
		const AppliedByName = selectedRowData && selectedRowData.AppliedByName;
		const AppliedById = selectedRowData && selectedRowData.AppliedById

		const obj = {
			NumberOfPaper,
			ApplicationDate,
			RequestType,
			AdminRequestStatus: 'In Process',
			AppliedByName,
			AppliedById
		};
		RejectAdminRequests(getIdSelected, obj);
	}
	EditAdminRequest = () => {
		this.setState({ visibleEditAdminRequest: true });
	};
	DeleteAdminRequest = () => {
		this.setState({
			visibleDeleteDialogue: true
		});
	};
	EditAdminRequestMe = () => {
		this.setState({ visibleEditAdminRequest: true });
	};
	DeleteAdminRequestMe = () => {
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
		const { mutations: { deleteAdminRequest } } = this.props;
		const { getIdSelectedMe } = this.state;

		deleteAdminRequest(getIdSelectedMe);
	};
	renderListAdminRequestType = () => {
		const { adminRequestType } = this.props;
		let listAdminRequestType = [];
		if (adminRequestType && adminRequestType.data && adminRequestType.data.a) {
			listAdminRequestType = adminRequestType.data.a.map((c) => {
				return { label: c.RequestName, value: c.id };
			});
		}
		return listAdminRequestType;
	};
	showDialogAdminR = (e) => {
		// provide a pageX/pageY to the dialog when making visible to make the
		// dialog "appear" from that x/y coordinate
		let { pageX, pageY } = e;
		if (e.changedTouches) {
			pageX = e.changedTouches[0].pageX;
			pageY = e.changedTouches[0].pageY;
		}

		this.setState({ visibleAdmin: true, pageX, pageY });
	};

	hideDialogAdminR = () => {
		this.setState({ visibleAdmin: false });
	};
	showDialogEditAdminRequest = () => {
		this.setState({ visibleEditAdminRequest: true });
	};
	hideDialogEditAdminRequest = () => {
		this.setState({ visibleEditAdminRequest: false });
	};
	handleSubmitEditRequest = (obj) => {
		const { getIdSelectedMe } = this.state;
		const { mutations: { editAdminRequest } } = this.props;
		editAdminRequest(getIdSelectedMe, obj);
	};
	render() {

		const {
			visibleAdmin,
			getIdSelected,
			getIdSelectedMe,
			visibleDeleteDialogue,
			pageX,
			pageY,
			visibleEditAdminRequest,
			selectedRowDataMe
		} = this.state;
		const { userId, userName, role } = this.props;
		const visible = selectedRowDataMe && selectedRowDataMe.AdminRequestStatus;

		return (
			<div className="DataCard">
				<div className="leave-admin-button">

					{getIdSelected && (
						<Button primary raised className="create-btn" disabled={!getIdSelected} onClick={() => this.AcceptAdminRequest()}>
							request Ready
					</Button>
					)}
					{getIdSelected && (
						<Button primary raised className="create-btn" disabled={!getIdSelected} onClick={() => this.AdminRequestInProcess()}>
							request InProcess
					</Button>
					)}
				</div>

				{visibleAdmin && (
					<CreateAdminRequest
						handleSubmit={this.handleSubmit}
						show={this.showDialogAdminR}
						hide={this.hideDialogAdminR}
						visible={visibleAdmin}
						ListAdminRequestType={this.renderListAdminRequestType()}
						pageX={pageX}
						pageY={pageY}
						userId={userId}
						userName={userName}
					/>
				)}
				{visibleEditAdminRequest && (
					<EditAdminRequest
						show={this.showDialogEditAdminRequest}
						hide={this.hideDialogEditAdminRequest}
						visibleEditAdminRequest={visibleEditAdminRequest}
						selectedRowData={selectedRowDataMe}
						RequestType={this.renderListAdminRequestType()}
						handleSubmitEditRequest={this.handleSubmitEditRequest}
					/>
				)}
				{(role === 3 || role === 2) && (
					<DataTable
						showControls
						withPadding
						onRowSelect={this.handleRowSelect}
						selectedRowIndex={this.state.selectedRowIndex}
						title="List Of Admin Request"
						columnConfig={ConfigColumn}
						data={this.renderDataTableData()}
					/>
				)}
				<div className="leave-admin-button">

					{
						<Button primary raised className="create-btn" onClick={this.showDialogAdminR}>
							Create Admin Request
					</Button>
					}
					{getIdSelectedMe && (
						<Button secondary raised className="create-btn" disabled={visible !== 'Pending'} iconChildren="delete" onClick={() => this.DeleteAdminRequest()}>
							Delete my admin request
					</Button>
					)}
					{getIdSelectedMe && (
						<Button primary raised className="create-btn" disabled={visible !== 'Pending'} iconChildren="edit" onClick={this.EditAdminRequestMe}>
							Edit my admin request
					</Button>
					)}
				</div>
				<DataTable
					showControls
					withPadding
					onRowSelect={this.handleRowSelectMe}
					selectedRowIndex={this.state.selectedRowIndexMe}
					title="List Of My Admin Request"
					columnConfig={ConfigColumn}
					data={this.renderDataTableDataMe()}
				/>
				<DialogDelete
					handelCancelRow={this.handelCancelRow}
					hideDeleteDialogue={this.hideDeleteDialogue}
					visibleDeleteDialogue={visibleDeleteDialogue}
				/>
			</div>
		);
	}
}
export default AdminRequest;
