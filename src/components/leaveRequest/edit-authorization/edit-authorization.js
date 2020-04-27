import React, { Component } from 'react';
import { Button, DialogContainer, TextField } from 'react-md';
import { addToast } from '../../../app/actions';
import { connect } from 'react-redux';
import moment from 'moment'
import { TimePicker } from 'react-md/lib/Pickers';

import '../create-authorization/style.scss'


@connect(() => null, { addToast })
export default class EditAuthorization extends Component {
    static defaultProps = { numberOfMonths: 2 }

    constructor(props) {
        super(props)
        const { selectedRowData } = this.props

        this.state = {
            AppliedById: selectedRowData.AppliedById,
            ApplicationDate: selectedRowData.ApplicationDate,
            LeaveStartDate: moment(Date(new Date())).format('MM/DD/YYYY'),
            LeaveEndDate: moment(Date(new Date())).format('MM/DD/YYYY'),
            RequestStatus: selectedRowData.RequestStatus,
            AdminRequestStatus: selectedRowData.AdminRequestStatus,
            LeaveType: selectedRowData.LeaveType,
            LeaveReason: selectedRowData.LeaveReason,
            LeaveDays: 0,
            startTime: selectedRowData.StartTime,
            endTime: selectedRowData.EndTime,
            AppliedByName: selectedRowData.AppliedByName,
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


    handleEditAuthorization = () => {
        const {
            AppliedById,
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
        const { handleEditAuthorization } = this.props;
        const infoClient = {
            AppliedById,
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
        handleEditAuthorization && handleEditAuthorization(infoClient);
    };

    render() {
        const { visible } = this.props;
        const { LeaveReason, StartTime, EndTime } = this.state

        const actions = [];
        actions.push({ children: 'Cancel', onClick: this.hide });
        actions.push(<Button flat primary onClick={this.handleEditAuthorization}>Save</Button>);

        return (

            <DialogContainer
                id="simple-full-page-dialog"
                visible={visible}
                onHide={this.hide}
                title="Edit Leave authorization"
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
                        defaultValue={StartTime}
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
                        className="md-cell md-cell--12"
                        defaultValue={EndTime}
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
                        className="addLeaveAuthorization-textFiled md-cell md-cell--6"
                        value={LeaveReason}
                        onChange={(LeaveReason) => this.setState({ LeaveReason })}
                    />
                </div>
            </DialogContainer>
        );
    }
}
