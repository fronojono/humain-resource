import React, { Component, Fragment } from 'react';
import { Button, Paper } from 'react-md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import query from 'react-hoc-query';
import { has, sortBy } from 'lodash';
import image from '../../image/client.png';

import { ListConvention, DeleteConvention, newConvention, ListEmployees, EditConventions } from '../../libs/api';

import DataTable from '../../data-table';
import ConfigColumn from './configureTable';
import DialogDelete from '../dialog-delete';
import mutate from '../../libs/hoc/mutate';
import { addToast } from '../../app/actions';
import AddConvention from './add-convention';
import EditConvention from './edit-convention';
import ToastMsg from '../toast-msg';
import moment from 'moment';

import './style.scss';

@mutate({
	moduleName: 'DeleteEmployee',
	mutations: {
		DeleteConvention,
		newConvention,
		EditConventions
	}
})
@query({
	key: 'ListConvention',
	name: 'ListConvention',
	op: ListConvention
})
@query({
	key: 'employeeRole',
	name: 'employeeRole',
	op: ListEmployees
})
@connect(
	({ query }) => ({
		ListEmployee: query.DEFAULT
	}),
	{ addToast }
)
@withRouter
class Convention extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOfClient: [],
			visible: false,
			selectedRowIndex: null,
			getIdSelected: '',
			changeView: 'grid',
			pageX: null,
			pageY: null,
			visibleDeleteDialogue: false,
			visibleUpdateDialogue: false
		};
	}

	componentDidUpdate(newProps) {
		const { addToast } = this.props;
		if (newProps.newConventionStatus !== this.props.newConventionStatus) {
			if (this.props.newConventionStatus.pending) {
				if (has(this.props, 'newConventionStatus.data') && this.props.newConventionStatus.data.error === null) {
					addToast(<ToastMsg text={'Convention added successfully'} type="success" />);

					this.hideDialogClient();
					this.props.ListConvention.refetch();
				}
			}
		}
		if (newProps.EditConventionsStatus !== this.props.EditConventionsStatus) {
			if (this.props.EditConventionsStatus.pending) {
				if (
					has(this.props, 'EditConventionsStatus.data') &&
					this.props.EditConventionsStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Edit successfully'} type="success" />);

					this.hideEditDialogue();
					this.props.ListConvention.refetch();
				}
			}
		}
		if (newProps.DeleteConventionStatus !== this.props.DeleteConventionStatus) {
			if (this.props.DeleteConventionStatus.pending) {
				if (
					has(this.props, 'DeleteConventionStatus.data') &&
					this.props.DeleteConventionStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Convention deleted'} type="success" />);

					this.hideDeleteDialogue();
					this.props.ListConvention.refetch();
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
	handleSubmitEditConvention = (obj) => {
		const { getIdSelected } = this.state;
		const { mutations: { EditConventions } } = this.props;
		EditConventions(getIdSelected, obj);
	};
	handleSubmit = (objClient) => {
		const { mutations: { newConvention } } = this.props;
		newConvention(objClient);
	};
	showDialogClient = (e) => {
		// provide a pageX/pageY to the dialog when making visible to make the
		// dialog "appear" from that x/y coordinate
		let { pageX, pageY } = e;
		if (e.changedTouches) {
			pageX = e.changedTouches[0].pageX;
			pageY = e.changedTouches[0].pageY;
		}

		this.setState({ visible: true, pageX, pageY });
	};

	hideDialogClient = () => {
		this.setState({ visible: false });
	};


	renderDataTableData = () => {
		const { ListConvention } = this.props;
		let ListConventions = [];
		if (ListConvention && ListConvention && ListConvention.data && ListConvention.data.c) {
			const sortedList = sortBy(ListConvention && ListConvention.data && ListConvention.data.c, (li) => moment(li.ApplicationDate)).reverse()
			ListConventions = sortedList.map((c) => {
				return {
					ConventionName: c.ConventionName,
					ConventionDescription: c.ConventionDescription,
					ApplicationDate: c.ApplicationDate,
					id: c.id,
					ConventionDoc: c.ConventionDoc
				};
			});
		}
		return ListConventions;
	};

	openDetails = () => {
		const { history } = this.props;
		const { getIdSelected } = this.state;
		history.push(`/employees/${getIdSelected}`);
	};
	showEditConvention = () => {
		const { getIdSelected } = this.state;
		this.setState({
			visibleUpdateDialogue: true
		});
	};
	hideEditDialogue = () => {
		this.setState({
			visibleUpdateDialogue: false
		});
	};
	DeleteConvention = () => {
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
		const { mutations: { DeleteConvention } } = this.props;
		const { getIdSelected } = this.state;
		DeleteConvention(getIdSelected);
	};
	renderListOfClient = () => {
		const { ListEmployee } = this.props;
		let listClient = [];
		if (
			ListEmployee &&
			ListEmployee.ListConvention &&
			ListEmployee.ListConvention.data &&
			ListEmployee.ListConvention.data.c
		) {
			const sortedList = sortBy(ListEmployee.ListConvention.data.c, (li) => moment(li.ApplicationDate)).reverse();
			listClient = sortedList.map((c, i) => {
				return (
					<Paper key={i} zDepth={0} className="client-card md-cell md-cell--3" >
						<div className="client-card-header" onMouseEnter={this.handleHover}>
							<div className="client-card-avatar">
								<img alt="" src={image} />
							</div>
							<div className="client-card-info">
								<div className="firstname">{c.ConventionName}</div>
								<div>{c.ConventionDescription}</div>
							</div>

						</div>
						<div className="client-card-create_date"><span className="mdi mdi-calendar" />{c.ApplicationDate}</div>
					</Paper>

				);
			});
		}
		return listClient;
	};

	render() {
		const {
			visible,
			getIdSelected,
			changeView,
			pageX,
			pageY,
			visibleDeleteDialogue,
			visibleUpdateDialogue,
			selectedRowData
		} = this.state;
		const { role } = this.props;
		return (
			<div className="employeeWrapper">
				<div className="employeeWrapper-header">
					{(role === 3 || role === 4) && (
						<div>
							<Button primary raised className="action-btn" onClick={this.showDialogClient}>
								Create Convention
							</Button>

							{changeView === 'grid' &&
								getIdSelected && (
									<Fragment>
										<Button secondary raised className="action-btn" disabled={!getIdSelected} iconChildren="delete" onClick={() => this.DeleteConvention()}>
											Delete Convention
							        </Button>
										<Button
											primary
											raised className="action-btn"
											disabled={!getIdSelected}
											iconChildren="edit"
											onClick={() => this.showEditConvention()}
										>
											Edit Convention
							        </Button>
									</Fragment>
								)}
						</div>
					)}
					<div className='changeViewButtons'>
						<Button icon className={`viewButton ${changeView === 'grid' ? 'selected' : ''}`} onClick={() => this.setState({ changeView: 'grid' })}>view_stream</Button>
						<Button icon className={`viewButton ${changeView === 'card' ? 'selected' : ''}`} onClick={() => this.setState({ changeView: 'card' })}>view_module</Button>
					</div>
				</div>


				{visible && (
					<AddConvention
						handleSubmit={this.handleSubmit}
						show={this.showDialogClient}
						hide={this.hideDialogClient}
						visible={visible}
						pageX={pageX}
						pageY={pageY}
					/>
				)}
				{visibleUpdateDialogue && (
					<EditConvention
						show={this.showEditConvention}
						hide={this.hideEditDialogue}
						visibleEditAdminRequest={visibleUpdateDialogue}
						selectedRowData={selectedRowData}
						handleSubmitEditConvention={this.handleSubmitEditConvention}
					/>
				)}

				{changeView === 'card' && <div className='md-grid clientCardWrapper'>{this.renderListOfClient()}</div>}
				{changeView === 'grid' && (
					<DataTable
						title="List Of Conventions"
						columnConfig={ConfigColumn}
						data={this.renderDataTableData()}
						showControls
						withPadding
						onRowSelect={this.handleRowSelect}
						selectedRowIndex={this.state.selectedRowIndex}
					/>
				)}
				<DialogDelete
					handelCancelRow={this.handelCancelRow}
					hideDeleteDialogue={this.hideDeleteDialogue}
					visibleDeleteDialogue={visibleDeleteDialogue}
				/>
			</div>
		);
	}
}
export default Convention;
