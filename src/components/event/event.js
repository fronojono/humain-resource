import React, { Component, Fragment } from 'react';
import { Button } from 'react-md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import query from 'react-hoc-query';
import { has, sortBy } from 'lodash';

import { ListEvent, DeleteEvent, newEvent, EditEvent } from '../../libs/api';

import DataTable from '../../data-table';
import ConfigColumn from './configureTable';
import DialogDelete from '../dialog-delete';
import mutate from '../../libs/hoc/mutate';
import { addToast } from '../../app/actions';
import AddEvent from './create-event/create-event';
import ToastMsg from '../toast-msg';
import EditEvents from './edit-event';
import moment from 'moment';
import '../event_card/style.scss';
import EventCard from '../event_card'

// import './style.scss';

@mutate({
	moduleName: 'DeleteEvent',
	mutations: {
		DeleteEvent,
		newEvent,
		EditEvent
	}
})
@query({
	key: 'ListEvent',
	name: 'ListEvent',
	op: ListEvent
})
@connect(() => null, { addToast })
@withRouter
class Events extends Component {
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
		if (newProps.newEventStatus !== this.props.newEventStatus) {
			if (this.props.newEventStatus.pending) {
				if (has(this.props, 'newEventStatus.data') && this.props.newEventStatus.data.error === null) {
					addToast(<ToastMsg text={'Event added successfully'} type="success" />);

					this.hideDialogClient();
					this.props.ListEvent.refetch();
				}
			}
		}
		if (newProps.EditEventStatus !== this.props.EditEventStatus) {
			if (this.props.EditEventStatus.pending) {
				if (has(this.props, 'EditEventStatus.data') && this.props.EditEventStatus.data.error === null) {
					addToast(<ToastMsg text={'Edit successfully'} type="success" />);

					this.hideEditDialogue();
					this.props.ListEvent.refetch();
				}
			}
		}
		if (newProps.DeleteEventStatus !== this.props.DeleteEventStatus) {
			if (this.props.DeleteEventStatus.pending) {
				if (has(this.props, 'DeleteEventStatus.data') && this.props.DeleteEventStatus.data.error === null) {
					addToast(<ToastMsg text={'Event Deleted successfully'} type="success" />);

					this.hideDeleteDialogue();
					this.props.ListEvent.refetch();
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

	handleSubmit = (objClient) => {
		const { mutations: { newEvent } } = this.props;
		newEvent(objClient);
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
	handleClick = (data) => {
		const { history } = this.props;

		history.push(`/employees/${data.id}`);
	};

	renderDataTableData = () => {
		const { ListEvent } = this.props;
		let listEvents = [];
		if (ListEvent && ListEvent && ListEvent.data && ListEvent.data.d) {
			const sortedList = sortBy(ListEvent.data.d, li =>
				moment(li.EventStartDate),
			).reverse()
			listEvents = sortedList.map((c) => {
				return {
					EventName: c.EventName,
					EventStartDate: c.EventStartDate,
					EventDescription: c.EventDescription,
					id: c.id,
					EventDoc: c.EventDoc
				};
			});
		}
		return listEvents;
	};


	DeleteEvent = (id) => {
		if (id!==undefined&&id!==null){
			this.setState({
				visibleDeleteDialogue: true,
				getIdSelected:id
			});
		}else{
		this.setState({
			visibleDeleteDialogue: true
		});
	}
	};
	hideDeleteDialogue = () => {
		this.setState({
			visibleDeleteDialogue: false
		});
	};
	handelCancelRow = () => {
		const { mutations: { DeleteEvent } } = this.props;
		const { getIdSelected } = this.state;
		DeleteEvent(getIdSelected);
	};
	handleSubmitEditEvent = (obj) => {
		const { getIdSelected } = this.state;
		const { mutations: { EditEvent } } = this.props;
		EditEvent(getIdSelected, obj);
	};
	showEditEventDialogue = () => {
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
	renderListOfClient = () => { };

	render() {
		const { role } = this.props;
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
		return (
			<div className="employeeWrapper">
				<div className="employeeWrapper-header">
					{(role === 3 || role === 4) &&
						<div>
							<Button className="action-btn" primary raised onClick={this.showDialogClient}>
								Create Event
						    </Button>
							{changeView === 'grid' && getIdSelected &&
								<Fragment>
									<Button className="action-btn" secondary raised disabled={!getIdSelected} iconChildren="delete" onClick={() => this.DeleteEvent()}>
										Delete Events
							    </Button>
									<Button
										primary className="action-btn"
										raised
										iconChildren="edit"
										disabled={!getIdSelected}
										onClick={() => this.showEditEventDialogue()}
									>
										Edit Event
								</Button>
								</Fragment>
							}
						</div>
					}
					<div className='changeViewButtons'>
						<Button icon className={`viewButton ${changeView === 'grid' ? 'selected' : ''}`} onClick={() => this.setState({ changeView: 'grid' })}>view_stream</Button>
						<Button icon className={`viewButton ${changeView === 'card' ? 'selected' : ''}`} onClick={() => this.setState({ changeView: 'card' })}>view_module</Button>
					</div>
				</div>


				{visible && (
					<AddEvent
						handleSubmit={this.handleSubmit}
						show={this.showDialogClient}
						hide={this.hideDialogClient}
						visible={visible}
						pageX={pageX}
						pageY={pageY}
					/>
				)}
				{visibleUpdateDialogue && (
					<EditEvents
						show={this.showEditEventDialogue}
						hide={this.hideEditDialogue}
						visibleUpdateDialogue={visibleUpdateDialogue}
						handleSubmitEditEvent={this.handleSubmitEditEvent}
						selectedRowData={selectedRowData}
					/>
				)}

				{changeView === 'card' && (
					<EventCard show={this.DeleteEvent}/>

				)}
				{changeView === 'grid' && (
					<DataTable
						title="List Of Events"
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
export default Events;
