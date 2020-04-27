import React, { Component } from 'react';
import FileUpload from '../../file-uploader';
import { Button, DialogContainer, TextField, DatePicker, SelectField, Checkbox, CircularProgress } from 'react-md';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile } from '../../../libs/api';
import { has } from 'lodash';


// import { addToast } from '../../../app/actions';
// import { connect } from 'react-redux';
import './style.scss'
@mutate({
	moduleName: 'uploadFile',
	mutations: {
		uploadFile
	}
})
// @connect(null, {
// 	addToast: addToast,
// })
export default class AddEmployee extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: '',
			lastName: '',
			cnss: "",
			rib: "",
			bankName: '',
			salary: "",
			isManager: false,
			employeeRole: '',
			role: '',
			manager: '',
			contractType: '',
			department: '',
			startDate: '',
			emergencyTel: "",
			password: '',
			phoneNumber: "",
			eamil: '',
			birthday: '',
			zipcode: "",
			address: '',
			EmployeeDoc: []
		};
	}
	componentDidUpdate(newProps) {
		// const { addToast } = this.props;
		if (newProps.uploadFileStatus !== this.props.uploadFileStatus) {
			if (this.props.uploadFileStatus.pending) {
				if (has(this.props, 'uploadFileStatus.data')) {

					const data = this.props.uploadFileStatus.data
					let docData = data.file_inf.map(item => {
						return item
					})
					this.setState({
						EmployeeDoc: docData
					})
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
			firstName,
			lastName,
			cnss,
			rib,
			bankName,
			salary,
			isManager,
			employeeRole,
			manager,
			contractType,
			department,
			startDate,
			emergencyTel,
			password,
			phoneNumber,
			eamil,
			birthday,
			zipcode,
			address,
			EmployeeDoc,
			role
		} = this.state;
		const { handleSubmit } = this.props;
		const infoClient = {
			employeeFirstName: firstName,
			employeeLastName: lastName,
			cnss,
			rib,
			bankName,
			EmployeeSalary: salary,
			isManager,
			employeeRole,
			manager,
			contractType,
			DepartmentInfo: { name: department, id: '5d35865c66c5e10078194aad' },
			EmployeeStartDate: startDate,
			EmergencyContactTel: emergencyTel,
			password,
			EmployeeNumTel: phoneNumber,
			EmployeeEmail: eamil,
			EmployeeBirthDate: birthday,
			zipcode,
			address,
			role,
			EmployeeDoc
		};
		handleSubmit && handleSubmit(infoClient);
	};
	uploadFiles = (files) => {
		const { mutations: { uploadFile } } = this.props;
		const url = 'http://localhost:8800/upload_list_files';
		uploadFile(url, files);
	};
	addRole = () => {
		return [
			{ name: 'EMPLOYE', value: 1 },
			{ name: 'ADMIN', value: 2 },
			{ name: 'SUPERADMIN', value: 3 },
			{ name: 'MANAGER', value: 0 },
			{ name: 'HR', value: 4 }
		]
	}
	isValid = () => {
		const {
			firstName,
			lastName,
			cnss,
			rib,
			bankName,
			salary,
			isManager,
			employeeRole,
			manager,
			contractType,
			department,
			startDate,
			emergencyTel,
			password,
			phoneNumber,
			eamil,
			birthday,
			zipcode,
			address,
			EmployeeDoc,
			role
		} = this.state
		if (!firstName || !lastName || !cnss || !rib || !bankName || !salary || !isManager
			|| !employeeRole || !manager || !contractType || !department || !startDate || !emergencyTel || !password || !phoneNumber
			|| !eamil || !birthday || !zipcode || !address || !EmployeeDoc || !role) {
			return true
		} else return false
	}
	render() {
		const { visible, uploadFileStatus } = this.props;
		let loading = false
		if (uploadFileStatus.pending) {
			loading = true
		} else {
			loading = false
		}
		const {
			firstName,
			lastName,
			cnss,
			rib,
			bankName,
			salary,
			isManager,
			employeeRole,
			manager,
			contractType,
			department,
			startDate,
			emergencyTel,
			password,
			phoneNumber,
			eamil,
			birthday,
			zipcode,
			address,
			role

		} = this.state;
		const { listDepartment, listEmployeeRole, listContractType, listManager } = this.props;
		const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim

		const actions = [];
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(<Button flat primary onClick={this.handleSubmitClient}>Save</Button>);
		return (


			<DialogContainer
				id="simple-full-page-dialog"
				visible={visible}
				title='New Employee'
				onHide={this.hide}
				actions={actions}
				className="addEmployee"
				modal
			>

				<div className="md-grid">
					<TextField
						id="firstName"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="First Name"
						label="First Name"
						type="text"
						value={firstName}
						error={!/^([^0-9]*)$/.test(firstName)}
						errorText="name contains illegal characters"
						onChange={(firstName) => this.setState({ firstName })}
					/>
					<TextField
						id="lastName"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Last Name"
						label="Last Name"
						type="text"
						value={lastName}
						error={!/^([^0-9]*)$/.test(lastName)}
						errorText="name contains illegal characters"
						onChange={(lastName) => this.setState({ lastName })}
					/>
					<TextField
						id="address"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Address"
						label="Address"
						type="text"
						value={address}
						onChange={(address) => this.setState({ address })}
					/>
					<TextField
						id="zipcode"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Zip code"
						label="Zip code"
						type="number"
						value={zipcode}
						onChange={(zipcode) => this.setState({ zipcode: Number.parseInt(zipcode, 10) })}
					/>
					<DatePicker
						id="birthday"
						className="md-cell md-cell--4"
						textFieldClassName='addEmployee-textField'
						placeholder="BirthDay"
						label="BirthDay"
						value={birthday}
						onChange={(birthday) => this.setState({ birthday })}
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}
					/>
					<TextField
						id="eamil"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Email address"
						label="Email address"
						type="email"
						value={eamil}
						error={!mailRegex.test(eamil)}
						errorText="email invalid"
						onChange={(eamil) => this.setState({ eamil })}
					/>
					<TextField
						id="phoneNumber"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Phone number"
						label="Phone number"
						type="number"
						value={phoneNumber}
						onChange={(phoneNumber) =>
							this.setState({ phoneNumber: Number.parseInt(phoneNumber, 10) })}
					/>
					<TextField
						id="password"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Password"
						label="Password"
						type="password"
						value={password}
						onChange={(password) => this.setState({ password })}
					/>
					<TextField
						id="emergencyTel"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Emergency contact phone"
						label="Emergency contact phone"
						type="number"
						value={emergencyTel}
						onChange={(emergencyTel) =>
							this.setState({ emergencyTel: Number.parseInt(emergencyTel, 10) })}
					/>
					<DatePicker
						id="startDate"
						className="md-cell md-cell--4"
						textFieldClassName='addEmployee-textField'
						placeholder="Start date"
						label="Start date"
						value={startDate}
						onChange={(startDate) => this.setState({ startDate })}
						disableWeekEnds
						locales="en-US"
						portal={true}
						lastChild={true}
						disableScrollLocking={true}
						renderNode={document.body}
					/>
					<SelectField
						id="department"
						className="addEmployee-selectField md-cell md-cell--4"
						placeholder="Department"
						label="Department"
						menuItems={listDepartment}
						value={department}
						onChange={(department) => this.setState({ department })}
						position={SelectField.Positions.BELOW}
					/>
					<SelectField
						id="contractType"
						className="addEmployee-selectField md-cell md-cell--4"
						placeholder="Contract type"
						label="Contract type"
						menuItems={listContractType}
						value={contractType}
						onChange={(contractType) => this.setState({ contractType })}
						position={SelectField.Positions.BELOW}
					/>
					<SelectField
						id="manager"
						className="addEmployee-selectField md-cell md-cell--4"
						placeholder="Manager"
						label="Manager"
						menuItems={listManager}
						value={manager}
						onChange={(manager) => this.setState({ manager })}
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
					<SelectField
						required
						id="role"
						className="addEmployee-selectField md-cell md-cell--4"
						label="Employee Role"
						value={role}
						menuItems={this.addRole()}
						itemLabel="name"
						itemValue="value"
						position={SelectField.Positions.BELOW}
						onChange={role => this.setState({ role })}
					/>
					<Checkbox
						id="isManager"
						className="addEmployee-selectField md-cell md-cell--4"
						placeholder="Is manager"
						name="isManager"
						label="is Manager"
						value={isManager}
						onChange={(isManager) => this.setState({ isManager })}
					/>
					{/* <InputLabel htmlFor="select-multiple-chip">employee</InputLabel> */}
					<TextField
						id="salary"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Salary"
						label="Salary"
						type="number"
						value={salary}
						onChange={(salary) => this.setState({ salary: Number.parseInt(salary, 10) })}
					/>
					<TextField
						id="bankName"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="Bank Name"
						label="Bank Name"
						type="text"
						value={bankName}
						onChange={(bankName) => this.setState({ bankName })}
					/>
					<TextField
						id="rib"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="RIB"
						label="RIB"
						type="number"
						value={rib}
						onChange={(rib) => this.setState({ rib: Number.parseInt(rib, 10) })}
					/>
					<TextField
						id="cnss"
						className="addEmployee-textField md-cell md-cell--4"
						placeholder="CNSS"
						label="CNSS"
						type="number"
						value={cnss}
						onChange={(cnss) => this.setState({ cnss: Number.parseInt(cnss, 10) })}
					/>
				</div>

				<FileUpload className='addEmployee-dropzone' onUpload={this.uploadFiles} multiple={true} />
				{loading && <CircularProgress />}

				<div />
			</DialogContainer>

		);
	}
}
