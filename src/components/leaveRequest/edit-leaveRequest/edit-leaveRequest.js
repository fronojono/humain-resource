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
import '../create-leaveRequest/style.scss'

@mutate({
    moduleName: 'uploadFile',
    mutations: {
        uploadFile,
    }
})
@query({
    key: 'request_type',
    op: request_type,
    name: 'request_type'
})
@connect(() => null, { addToast })
export default class EditLeaveRequest extends Component {
    static defaultProps = { numberOfMonths: 2 }

    constructor(props) {
        super(props)
        this.handleDayClick = this.handleDayClick.bind(this)
        this.handleResetClick = this.handleResetClick.bind(this)
        this.state = this.getInitialState()
        const { selectedRowData } = this.props
        this.state = {
            AppliedById: selectedRowData.AppliedById,
            ApprovedBy: selectedRowData.ApprouvedById,
            ApplicationDate: selectedRowData.ApplicationDate,
            LeaveStartDate: selectedRowData.LeaveStartDate,
            LeaveEndDate: selectedRowData.LeaveEndDate,
            RequestStatus: selectedRowData.RequestStatus,
            LeaveReason: selectedRowData.LeaveReason,
            LeaveDays: selectedRowData.LeaveDays,
            startTime: selectedRowData.startTime,
            endTime: selectedRowData.endTime,
            AppliedByName: selectedRowData.AppliedByName,
            pictures: [],
            empleaveBalance: selectedRowData.LeaveBalance
        }
    }
    // componentDidUpdate(newProps) {
    // 	const { addToast } = this.props;
    // 	if (newProps.uploadFileStatus !== this.props.uploadFileStatus) {
    // 		if (!this.props.uploadFileStatus.pending) {
    // 			if (has(this.props, 'uploadFileStatus.data') && this.props.uploadFileStatus.data.error === null) {
    // 				addToast('Deleted successfully');
    // 			}
    // 		}
    // 	}
    // }

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
                .format('MM/DD/YYYY'),


            LeaveEndDate: moment(range.to)
                .format('MM/DD/YYYY'),


            LeaveDays: differenceInCalendarDays(
                moment(range.to).format('MM/DD/YYYY'),
                moment(range.from).format('MM/DD/YYYY')
            )
        })
    }
    getInitialState() {
        return {
            from: '',
            to: ''
        }
    }
    handleResetClick() {
        this.setState(this.getInitialState())
    }
    renderRequestType = () => {
        const { request_type } = this.props
        let listTypeRequest = []
        if (request_type && request_type.data) {
            listTypeRequest = request_type.data.r.map((lop, i) => {
                return { 'RequestName': lop.RequestTypeName }
            })
        }
        return listTypeRequest
    }
    handleEditLeaveRequest = () => {
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
            empleaveBalance
        } = this.state;
        const { handleSubmitEditLeaveRequest } = this.props;
        const leaveRequestInfo = {
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
            LeaveBalance: empleaveBalance
        };
        handleSubmitEditLeaveRequest && handleSubmitEditLeaveRequest(leaveRequestInfo);
    };
    // uploadFiles = (files) => {
    // 	const { mutations: { uploadFile } } = this.props;
    // 	const url = 'http://localhost:8800/upload_list_files';
    // 	uploadFile(url, files);
    // };
    render() {
        const { visible } = this.props;
        const { from, to, LeaveReason } = this.state
        const modifiers = { start: from, end: to }

        const actions = [];
        actions.push({ children: 'Cancel', onClick: this.hide });
        actions.push(<Button flat primary disabled={!from || !to} onClick={this.handleResetClick}>Reset</Button>);
        actions.push(<Button flat primary onClick={this.handleEditLeaveRequest}>Save</Button>);

        return (
            <div>
                <DialogContainer
                    id="simple-full-page-dialog"
                    visible={visible}
                    onHide={this.hide}
                    modal
                    title="Edit Leave Request"
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
                            position={SelectField.Positions.BELOW}
                            itemLabel="RequestName"
                            itemValue="RequestName"
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
                    <DayPicker
                        className="Selectable"
                        numberOfMonths={this.props.numberOfMonths}
                        selectedDays={[from, { from, to }]}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
                    />

                </DialogContainer>
            </div>
        );
    }
}
