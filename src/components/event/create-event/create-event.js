import React, { Component } from 'react';
import FileUpload from '../../file-uploader';
import { Button, DialogContainer, TextField, DatePicker, CircularProgress } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile } from '../../../libs/api';
import { addToast } from '../../../app/actions';
import { connect } from 'react-redux';
import moment from 'moment'

import './style.scss'
@mutate({
    moduleName: 'uploadFile',
    mutations: {
        uploadFile
    }
})
@connect(() => null, { addToast })
export default class AddEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EventName: '',
            EventDescription: '',
            EventStartDate: moment(Date(new Date())).format('MM/DD/YYYY'),
            EventDoc: []
        }
    }

    componentDidUpdate(prevProps) {
        const { uploadFileStatus } = this.props

        if (uploadFileStatus !== prevProps.uploadFileStatus) {
            if (!uploadFileStatus.pending && uploadFileStatus.data) {
                const attachments = uploadFileStatus.data.file_inf.map(file => {
                    return file
                })
                this.setState({
                    EventDoc: attachments
                })
            }
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
    handleSubmitClient = () => {
        const {
            EventName,
            EventDescription,
            EventStartDate,
            EventDoc,
        } = this.state;
        const { handleSubmit } = this.props;
        const eventInfo = {
            EventName,
            EventDescription,
            EventStartDate,
            EventDoc,
        };
        handleSubmit && handleSubmit(eventInfo);
    };
    uploadFiles = (files) => {
        const { mutations: { uploadFile } } = this.props;
        const url = 'http://localhost:8800/upload_list_files';
        uploadFile(url, files);
    };
    validDialog = () => {
        const { EventName, EventDescription, EventStartDate } = this.state
        if (!EventName || !EventDescription || !EventStartDate) {
            return true
        } else return false
    };
    render() {
        const { visible, uploadFileStatus } = this.props;
        const {
            EventName,
            EventDescription,
            EventStartDate,
        } = this.state;
        let loading = false
        if (uploadFileStatus.pending) {
            loading = true
        } else {
            loading = false
        }
        const actions = [];
        actions.push({ children: 'Cancel', onClick: this.hide });
        actions.push(<Button flat primary onClick={this.handleSubmitClient}>Save</Button>);
        return (
            <DialogContainer
                id="simple-full-page-dialog"
                visible={visible}
                onHide={this.hide}
                actions={actions}
                className="newEvent"
                title="New Event"
                modal
            >
                <div className="md-grid">
                    <TextField
                        id="EventName"
                        name="EventName"
                        label="EventName"
                        value={EventName}
                        className="newEvent-textField md-cell md-cell--6"
                        onChange={v => {
                            this.setState({ EventName: v })
                        }}
                    />
                    <DatePicker
                        id="inline-date-picker-portait"
                        label="Select Event Date"
                        name="EventStartDate"
                        selected={EventStartDate}
                        value={EventStartDate}
                        disableOuterDates
                        locales="en-US"
                        onChange={v => {
                            this.setState({ EventStartDate: v })
                        }}
                        portal={true}
                        lastChild={true}
                        disableScrollLocking={true}
                        renderNode={document.body}
                        className="md-cell md-cell--6"
                        textFieldClassName='newEvent-textField'
                    />

                    <TextField
                        id="EventDescription"
                        name="EventDescription"
                        label="EventDescription"
                        value={EventDescription}
                        className="newEvent-textField md-cell md-cell--12"
                        rows={3}
                        onChange={v => {
                            this.setState({ EventDescription: v })
                        }}
                    />
                    <FileUpload className="md-cell md-cell--12" onUpload={this.uploadFiles} multiple={true} />

                </div>


                {loading && <CircularProgress />}
            </DialogContainer>
        );
    }
}
