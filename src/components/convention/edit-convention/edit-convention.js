import React, { Component } from 'react'
import { Button, DialogContainer, TextField, DatePicker, CircularProgress } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile } from '../../../libs/api';
import FileUpload from '../../file-uploader';

@mutate({
    moduleName: 'uploadFile',
    mutations: {
        uploadFile
    }
})
export default class EditConvention extends Component {
    constructor(props) {
        super(props)
        const { selectedRowData } = this.props
        this.state = {
            ConventionName: selectedRowData && selectedRowData.ConventionName,
            ConventionDescription: selectedRowData && selectedRowData.ConventionDescription,
            ApplicationDate: selectedRowData && selectedRowData.ApplicationDate,
            ConventionDoc: selectedRowData && selectedRowData.ConventionDoc
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

    show = () => {
        const { show } = this.props
        show && show()

    };

    hide = () => {
        const { hide } = this.props
        hide && hide()
    };
    handleSubmitEditConvention = () => {

        const { ConventionName, ConventionDescription, ApplicationDate, ConventionDoc, } = this.state

        const objTy = { ConventionName, ApplicationDate, ConventionDescription, ConventionDoc }
        const { handleSubmitEditConvention } = this.props
        handleSubmitEditConvention && handleSubmitEditConvention(objTy)
    }
    uploadFiles = (files) => {
        const { mutations: { uploadFile } } = this.props;
        const url = 'http://localhost:8800/upload_list_files';
        uploadFile(url, files);
    };
    render() {
        const { ConventionName, ApplicationDate, ConventionDescription, ConventionDoc } = this.state
        const { visibleEditAdminRequest, uploadFileStatus } = this.props

        let loading = false
        if (uploadFileStatus.pending) {
            loading = true
        } else {
            loading = false
        }

        const actions = [];
        actions.push({ children: 'Cancel', onClick: this.hide });
        actions.push(<Button flat primary onClick={this.handleSubmitEditConvention} disabled={loading} >Confirm</Button>);

        return (

            <DialogContainer
                id="simple-action-dialog"
                className="addConvention"
                visible={visibleEditAdminRequest}
                onHide={this.hide}
                actions={actions}
                title="Edit Convention"
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
                    label="Select Convention Date"
                    name="ConventionDate"
                    selected={ApplicationDate}
                    locales="en-US"
                    value={ApplicationDate}
                    onChange={(ApplicationDate) => this.setState({ ApplicationDate })}
                    textFieldClassName="addConvention-textField"
                    portal={true}
                    lastChild={true}
                    disableScrollLocking={true}
                    renderNode={document.body}

                />

                <FileUpload onUpload={this.uploadFiles} multiple={true} value={ConventionDoc} />
                {loading && <CircularProgress />}


            </DialogContainer>

        );
    }
}
