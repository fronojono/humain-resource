import React, { Component } from 'react';
import FileUpload from '../../file-uploader';
import { Button, DialogContainer, TextField, DatePicker, CircularProgress } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile } from '../../../libs/api';
import { addToast } from '../../../app/actions';
import { connect } from 'react-redux';
import moment from 'moment'

@mutate({
    moduleName: 'uploadFile',
    mutations: {
        uploadFile
    }
})
@connect(() => null, { addToast })
export default class AddConvention extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ConventionName: '',
            ConventionDescription: '',
            ConventionDate: moment(Date(new Date())).format('MM/DD/YYYY'),
            ConventionDoc: []
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
                    ConventionDoc: attachments
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
            ConventionName,
            ConventionDescription,
            ConventionDate,
            ConventionDoc,
        } = this.state;
        const { handleSubmit } = this.props;
        const conventionInfo = {
            ApplicationDate: ConventionDate,
            ConventionDescription,
            ConventionDoc: ConventionDoc,

            ConventionName,
        };
        handleSubmit && handleSubmit(conventionInfo);
    };
    uploadFiles = (files) => {
        const { mutations: { uploadFile } } = this.props;
        const url = 'http://localhost:8800/upload_list_files';
        uploadFile(url, files);
    };
    validDialog = () => {
        const { ConventionName, ConventionDescription } = this.state
        if (!ConventionName || !ConventionDescription) {
            return true
        } else return false
    };

    render() {
        const { visible, uploadFileStatus } = this.props;
        const {
            ConventionName,
            ConventionDescription,
            ConventionDate,
        } = this.state;
        let loading = false
        if (uploadFileStatus.pending) {
            loading = true
        } else {
            loading = false
        }

        const actions = [];
        actions.push({ children: 'Cancel', onClick: this.hide });
        actions.push(<Button flat primary onClick={this.handleSubmitClient} disabled={this.validDialog() || loading}>Save</Button>);
        return (

            <DialogContainer
                id="simple-full-page-dialog"
                visible={visible}
                onHide={this.hide}
                actions={actions}
                className="addConvention"
                title="New Convention"
                modal
            >
                <TextField
                    id="EventName"
                    name="Convention Name"
                    label="Convention Name"
                    value={ConventionName}
                    className="addConvention-textField"
                    onChange={v => {
                        this.setState({ ConventionName: v })
                    }}
                />
                <TextField
                    id="EventDescription"
                    name="Convention Description"
                    label="Convention Description"
                    value={ConventionDescription}
                    className="addConvention-textField"
                    onChange={v => {
                        this.setState({ ConventionDescription: v })
                    }}
                />
                <DatePicker
                    id="inline-date-picker-portait"
                    label="Select Event Date"
                    name="ConventionDate"
                    selected={ConventionDate}
                    value={ConventionDate}
                    disableOuterDates
                    locales="en-US"
                    textFieldClassName="addConvention-textField"
                    onChange={v => {
                        this.setState({ ConventionDate: v })
                    }}
                    portal={true}
                    lastChild={true}
                    disableScrollLocking={true}
                    renderNode={document.body}
                />
                <FileUpload onUpload={this.uploadFiles} multiple={true} />
                {loading && <CircularProgress />}
            </DialogContainer>
        );
    }
}
