import React, { Component } from 'react';
import { Button, DialogContainer, TextField, DatePicker, SelectField } from 'react-md';

export default class EditAdminRequest extends Component {
	constructor(props) {
		super(props);
		const { selectedRowData } = this.props;
		this.state = {
			NumberOfPaper: selectedRowData && selectedRowData.NumberOfPaper,
			ApplicationDate: selectedRowData && selectedRowData.ApplicationDate,
			objTypeRe: selectedRowData && selectedRowData.RequestType,
			AppliedById: selectedRowData && selectedRowData.AppliedById,
			AdminRequestStatus: selectedRowData && selectedRowData.AdminRequestStatus,
			AppliedByName: selectedRowData && selectedRowData.AppliedByName
		};
	}

	show = () => {
		const { show } = this.props;
		show && show();
	};

	hide = () => {
		const { hide } = this.props;
		hide && hide();
	};
	handleSubmitEditRequest = () => {
		const {
			NumberOfPaper,
			ApplicationDate,
			objTypeRe,
			AppliedById,
			AdminRequestStatus,
			AppliedByName
		} = this.state;
		const { RequestType } = this.props;
		let objTypeRequest;
		if (typeof RequestType === 'object' && RequestType && RequestType.lenght !== 0 && objTypeRe !== null) {
			objTypeRequest = RequestType.find((item) => item.value === objTypeRe);
		}

		const objTy = {
			NumberOfPaper,
			ApplicationDate,
			RequestType: {
				RequestTypeName: objTypeRequest && objTypeRequest.label,
				id: objTypeRequest && objTypeRequest.value
			},
			AppliedById,
			AdminRequestStatus,
			AppliedByName
		};

		const { handleSubmitEditRequest } = this.props;
		handleSubmitEditRequest && handleSubmitEditRequest(objTy);
	};

	render() {
		const { NumberOfPaper, ApplicationDate, objTypeRe } = this.state;
		const { visibleEditAdminRequest, RequestType } = this.props;
		let objTypeRequest;
		if (RequestType && RequestType.lenght !== 0 && objTypeRe !== null) {
			objTypeRequest = RequestType.find((item) => item.label === objTypeRe);
		}

		const actions = [];
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(
			<Button flat primary onClick={this.handleSubmitEditRequest}>
				Confirm
			</Button>
		);

		return (
			<DialogContainer
				id="simple-action-dialog"
				visible={visibleEditAdminRequest}
				onHide={this.hide}
				actions={actions}
				title="Edit Admin Request "
				className="adminRequestDialog"
			>
				<TextField
					id="numberOfPaper"
					className="adminRequestDialog-textField"
					placeholder="numberOfPaper"
					label="numberOfPaper"
					type="number"
					value={NumberOfPaper}
					onChange={(NumberOfPaper) => {
						this.setState({ NumberOfPaper: Number.parseInt(NumberOfPaper, 10) });
					}}
				/>
				<DatePicker
					id="applicationDate"
					textFieldClassName="adminRequestDialog-textField"
					placeholder="applicationDate"
					label="applicationDate"
					value={ApplicationDate}
					onChange={(ApplicationDate) => {
						this.setState({ ApplicationDate });
					}}
					portal={true}
					lastChild={true}
					disableScrollLocking={true}
					renderNode={document.body}
				/>
				<SelectField
					id="select-field-default-value"
					value={objTypeRequest && objTypeRequest.value}
					className="adminRequestDialog-selectField"
					placeholder="requestType"
					menuItems={RequestType}
					onChange={(objTypeRe) => {
						this.setState({ objTypeRe });
					}}
					position={SelectField.Positions.BELOW}
					fullWidth
				/>
			</DialogContainer>
		);
	}
}
