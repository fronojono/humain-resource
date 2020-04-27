import React, { Component } from 'react';
import { Button, DialogContainer, TextField, DatePicker, CircularProgress } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile } from '../../../libs/api';
import FileUpload from '../../file-uploader';

import '../create-event/style.scss';
@mutate({
	moduleName: 'uploadFile',
	mutations: {
		uploadFile
	}
})
export default class EditEvents extends Component {
	constructor(props) {
		super(props);
		const { selectedRowData } = this.props;
		this.state = {
			EventName: selectedRowData && selectedRowData.EventName,
			EventDescription: selectedRowData && selectedRowData.EventDescription,
			EventStartDate: selectedRowData && selectedRowData.EventStartDate,
			EventDoc: selectedRowData && selectedRowData.EventDoc
		};
	}
	componentDidUpdate(prevProps) {
		const { uploadFileStatus } = this.props;
		if (uploadFileStatus !== prevProps.uploadFileStatus) {
			if (!uploadFileStatus.pending && uploadFileStatus.data) {
				const attachments = uploadFileStatus.data.file_inf.map((file) => {
					return file;
				});
				this.setState({
					EventDoc: attachments
				});
			}
		}
	}
	show = () => {
		const { show } = this.props;
		show && show();
	};

	hide = () => {
		const { hide } = this.props;
		hide && hide();
	};
	handleSubmitEditConvention = () => {
		const { EventName, EventDescription, EventStartDate, EventDoc } = this.state;

		const objTy = { EventName, EventDescription, EventStartDate, EventDoc };
		const { handleSubmitEditEvent } = this.props;
		handleSubmitEditEvent && handleSubmitEditEvent(objTy);
	};
	uploadFiles = (files) => {
		const { mutations: { uploadFile } } = this.props;
		const url = 'http://localhost:8800/upload_list_files';
		uploadFile(url, files);
	};
	render() {
		const { EventName, EventStartDate, EventDescription, EventDoc } = this.state;
		const { visibleUpdateDialogue, uploadFileStatus } = this.props;
		let loading = false;
		if (uploadFileStatus.pending) {
			loading = true;
		} else {
			loading = false;
		}

		const actions = [];
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(
			<Button flat primary onClick={this.handleSubmitEditConvention}>
				Confirm
			</Button>
		);

		return (
			<DialogContainer
				id="simple-action-dialog"
				className="newEvent"
				visible={visibleUpdateDialogue}
				onHide={this.hide}
				actions={actions}
				title="Edit Event"
				modal
			>
				<div className="md-grid">
					<TextField
						id="EventName"
						name="Convention Name"
						label="Event Name"
						value={EventName}
						className="newEvent-textField md-cell md-cell--6"
						onChange={(v) => {
							this.setState({ EventName: v });
						}}
					/>

					<DatePicker
						id="inline-date-picker-portait"
						label="Select Convention Date"
						name="ConventionDate"
						selected={EventStartDate}
						value={EventStartDate}
						onChange={(EventStartDate) => this.setState({ EventStartDate })}
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}
						className="md-cell md-cell--6"
						textFieldClassName="newEvent-textField"
					/>

					<TextField
						id="EventDescription"
						name="Convention Description"
						label="Event Description"
						value={EventDescription}
						className="newEvent-textField md-cell md-cell--12"
						rows={3}
						onChange={(EventDescription) => this.setState({ EventDescription })}
					/>

					<FileUpload
						className="md-cell md-cell--12"
						onUpload={this.uploadFiles}
						multiple={true}
						value={EventDoc}
					/>
					{loading && <CircularProgress />}
				</div>
			</DialogContainer>
		);
	}
}
