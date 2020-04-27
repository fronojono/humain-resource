import React, { Component } from 'react';
import FileUpload from '../../file-uploader';
import { Button, DialogContainer, TextField, DatePicker, SelectField, Checkbox, CircularProgress } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile } from '../../../libs/api';
import { has } from 'lodash';
import { addToast } from '../../../app/actions';
import { connect } from 'react-redux';

import './style.scss'
@mutate({
	moduleName: 'uploadFile',
	mutations: {
		uploadFile
	}
})
@connect(null, {
	addToast: addToast
})
export default class EditEmployees extends Component {
	constructor(props) {
		super(props);
		const { selectedRowData } = this.props
		this.state = {
			employeeFirstName: selectedRowData && selectedRowData.employeeFirstName,
			employeeLastName: selectedRowData && selectedRowData.employeeLastName,
			employeeEmail: selectedRowData && selectedRowData.employeeEmail,
			employeeNumTel: selectedRowData && selectedRowData.employeeNumTel,
			employeeAddress: selectedRowData && selectedRowData.employeeAddress,
			id: selectedRowData && selectedRowData.id,
			employeeRole: selectedRowData && selectedRowData.employeeRole,
			employeeStartDate: selectedRowData && selectedRowData.employeeStartDate,
			CNSS: selectedRowData && selectedRowData.CNSS,
			ContractType: selectedRowData && selectedRowData.ContractType,
			EmergencyContactTel: selectedRowData && selectedRowData.EmergencyContactTel,
			EmployeeBirthDate: selectedRowData && selectedRowData.EmployeeBirthDate,
			EmployeeDoc: selectedRowData && selectedRowData.EmployeeDoc,
			EmployeeSalary: selectedRowData && selectedRowData.EmployeeSalary,
			IsManager: selectedRowData && selectedRowData.IsManager,
			Manager: selectedRowData && selectedRowData.Manager,
			RIB: selectedRowData && selectedRowData.RIB,
			Role: selectedRowData && selectedRowData.Role,
			ZipCode: selectedRowData && selectedRowData.ZipCode,
			password: selectedRowData && selectedRowData.password,
			BankName: selectedRowData && selectedRowData.BankName,
			DepartmentId: selectedRowData && selectedRowData.DepartmentInfo && selectedRowData && selectedRowData.DepartmentInfo.id,
			department: selectedRowData && selectedRowData.DepartmentInfo && selectedRowData && selectedRowData.DepartmentInfo.Name,
		};
	}
	componentDidUpdate(newProps) {
		if (newProps.uploadFileStatus !== this.props.uploadFileStatus) {
			if (this.props.uploadFileStatus.pending) {
				if (has(this.props, 'uploadFileStatus.data')) {
					const data = this.props.uploadFileStatus.data;
					let docData = data.file_inf.map((item) => {
						return item;
					});
					this.setState({
						EmployeeDoc: docData
					});
				}
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
			employeeFirstName,
			employeeLastName,
			employeeEmail,
			employeeNumTel,
			employeeAddress,
			employeeRole,
			employeeStartDate,
			CNSS,
			ContractType,
			EmergencyContactTel,
			EmployeeBirthDate,
			EmployeeDoc,
			EmployeeSalary,
			IsManager,
			Manager,
			RIB,
			Role,
			ZipCode,
			password,
			BankName,
			// DepartmentId,
			department
		} = this.state;
		const { handleSubmit } = this.props;
		const infoClient = {
			EmployeeFirstName: employeeFirstName,
			EmployeeLastName: employeeLastName,
			CNSS,
			RIB,
			BankName,
			EmployeeSalary,
			IsManager,
			employeeRole,
			Manager,
			ContractType,
			DepartmentInfo: { name: department, id: '5d35865c66c5e10078194aad' },
			employeeStartDate,
			EmergencyContactTel,
			password,
			Role,
			EmployeeNumTel: employeeNumTel,
			EmployeeEmail: employeeEmail,
			EmployeeBirthDate: EmployeeBirthDate,
			ZipCode,
			address: employeeAddress,
			EmployeeDoc
		};
		handleSubmit && handleSubmit(infoClient);
	};
	uploadFiles = (files) => {
		const { mutations: { uploadFile } } = this.props;
		const url = 'http://localhost:8800/upload_list_files';
		uploadFile(url, files);
	};
	render() {
		const { visible, RenderListRole, uploadFileStatus } = this.props;
		let loading = false
		if (uploadFileStatus.pending) {
			loading = true
		} else {
			loading = false
		}
		const {
			employeeFirstName,
			employeeLastName,
			employeeEmail,
			employeeNumTel,
			employeeAddress,
			employeeRole,
			employeeStartDate,
			CNSS,
			ContractType,
			EmergencyContactTel,
			EmployeeBirthDate,
			EmployeeDoc,
			EmployeeSalary,
			IsManager,
			Manager,
			RIB,
			Role,
			ZipCode,
			password,
			BankName,
			department
		} = this.state;
		const { listDepartment, listEmployeeRole, listContractType, listManager } = this.props;
		const actions = [];
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(<Button flat primary onClick={this.handleSubmitClient}>Save</Button>);
		return (

			<DialogContainer
				id="simple-full-page-dialog"
				visible={visible}
				onHide={this.hide}
				actions={actions}
				className="editEmployee"
				title="Edit Employee"
				modal
			>

				<div className="md-grid">
					<TextField
						id="firstName"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="First Name"
						label="First Name"
						type="text"
						value={employeeFirstName}
						onChange={(employeeFirstName) => this.setState({ employeeFirstName })}
					/>
					<TextField
						id="lastName"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Last Name"
						label="Last Name"
						type="text"
						value={employeeLastName}
						onChange={(employeeLastName) => this.setState({ employeeLastName })}
					/>
					<TextField
						id="address"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Address"
						label="Address"
						type="text"
						value={employeeAddress}
						onChange={(employeeAddress) => this.setState({ employeeAddress })}
					/>
					<TextField
						id="zipcode"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Zip code"
						label="Zip code"
						type="number"
						value={ZipCode}
						onChange={(ZipCode) => this.setState({ ZipCode: Number.parseInt(ZipCode, 10) })}
					/>
					<DatePicker
						id="birthday"
						className="md-cell md-cell--4"
						textFieldClassName="editEmployee-textField"
						placeholder="BirthDay"
						label="BirthDay"
						value={EmployeeBirthDate}
						onChange={(EmployeeBirthDate) => this.setState({ EmployeeBirthDate })}
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}
					/>
					<TextField
						id="eamil"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Email address"
						label="Email address"
						type="email"
						value={employeeEmail}
						onChange={(employeeEmail) => this.setState({ employeeEmail })}
					/>
					<TextField
						id="phoneNumber"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Phone number"
						label="Phone number"
						type="number"
						value={employeeNumTel}
						onChange={(employeeNumTel) =>
							this.setState({ employeeNumTel: Number.parseInt(employeeNumTel, 10) })}
					/>
					<TextField
						id="password"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Password"
						label="Password"
						type="password"
						value={password}
						onChange={(password) => this.setState({ password })}
					/>
					<TextField
						id="emergencyTel"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Emergency contact phone"
						label="Emergency contact phone"
						type="number"
						value={EmergencyContactTel}
						onChange={(EmergencyContactTel) =>
							this.setState({ EmergencyContactTel: Number.parseInt(EmergencyContactTel, 10) })}
					/>
					<DatePicker
						id="startDate"
						className="md-cell md-cell--4"
						textFieldClassName="editEmployee-textField"
						placeholder="Start date"
						label="Start date"
						value={employeeStartDate}
						onChange={(employeeStartDate) => this.setState({ employeeStartDate })}
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}
					/>
					<SelectField
						id="department"
						className="editEmployee-selectField md-cell md-cell--4"
						placeholder="Department"
						label="Department"
						menuItems={listDepartment}
						value={department}
						onChange={(department) => this.setState({ department })}
						position={SelectField.Positions.BELOW}
					/>
					<SelectField
						id="contractType"
						className="editEmployee-selectField md-cell md-cell--4"
						placeholder="Contract type"
						label="Contract type"
						menuItems={listContractType}
						value={ContractType}
						onChange={(ContractType) => this.setState({ ContractType })}
						position={SelectField.Positions.BELOW}
					/>
					<SelectField
						id="manager"
						className="editEmployee-selectField md-cell md-cell--4"
						placeholder="Manager"
						label="Manager"
						menuItems={listManager}
						value={Manager}
						onChange={(Manager) => this.setState({ Manager })}
						position={SelectField.Positions.BELOW}
					/>
					<SelectField
						id="employeeRole"
						className="addEmployee-selectField md-cell md-cell--4"
						placeholder="Employee Position"
						label="Employee Position"
						menuItems={listEmployeeRole}
						value={employeeRole}
						onChange={(employeeRole) => this.setState({ employeeRole })}
						position={SelectField.Positions.BELOW}
					/>
					<Checkbox
						id="isManager"
						className="md-cell md-cell--4"
						placeholder="Is manager"
						name="isManager"
						label="is Manager"
						checked={IsManager}
						value={IsManager}
						onChange={(IsManager) => this.setState({ IsManager })}
					/>
					<SelectField
						required
						id="role"
						className="editEmployee-selectField md-cell md-cell--4"
						label="Employee Role"
						value={Role}
						menuItems={RenderListRole}
						itemLabel="name"
						itemValue="value"
						position={SelectField.Positions.BELOW}
						onChange={Role => this.setState({ Role })}
					/>
					<TextField
						id="salary"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Salary"
						label="Salary"
						type="number"
						value={EmployeeSalary}
						onChange={(EmployeeSalary) => this.setState({ EmployeeSalary: Number.parseInt(EmployeeSalary, 10) })}
					/>
					<TextField
						id="bankName"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="Bank Name"
						label="Bank Name"
						type="text"
						value={BankName}
						onChange={(BankName) => this.setState({ BankName })}
					/>
					<TextField
						id="rib"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="RIB"
						label="RIB"
						type="number"
						value={RIB}
						onChange={(RIB) => this.setState({ RIB: Number.parseInt(RIB, 10) })}
					/>
					<TextField
						id="cnss"
						className="editEmployee-textField md-cell md-cell--4"
						placeholder="CNSS"
						label="CNSS"
						type="number"
						value={CNSS}
						onChange={(CNSS) => this.setState({ CNSS: Number.parseInt(CNSS, 10) })}
					/>
				</div>

				<FileUpload className='editEmployee-dropzone' onUpload={this.uploadFiles} multiple={true} value={EmployeeDoc} />
				{loading && <CircularProgress />}

				<div />
			</DialogContainer>

		);
	}
}
