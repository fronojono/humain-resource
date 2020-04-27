import React, { Component } from 'react'
import { has } from 'lodash';
import { connect } from 'react-redux';
import { Button, DialogContainer, TextField, DatePicker } from 'react-md';
import FileUpload from '../../file-uploader';
import { isAuthenticated } from '../../users/auth/auth';
import mutate from '../../../libs/hoc/mutate';
import { uploadFile, EditEmployee } from '../../../libs/api';
import ToastMsg from '../../toast-msg';
import { addToast } from '../../../app/actions';

@mutate({
	moduleName: 'uploadFile',
	mutations: {
		uploadFile,
		EditEmployee
	}
})
@connect(
	() => null,
	{ addToast }
)
export default class EditProfile extends Component {
	constructor(props) {
		const { employeeByID } = props
		let employeeFirstName
		let employeeLastName
		let employeeAddress
		let ZipCode
		let EmployeeBirthDate
		let employeeEmail
		let employeeNumTel
		let password
		let EmergencyContactTel
		let employeeStartDate
		if (employeeByID) {
			employeeFirstName = employeeByID.EmployeeFirstName
			employeeLastName = employeeByID.EmployeeLastName
			employeeAddress = employeeByID.Address
			ZipCode = employeeByID.ZipCode
			EmployeeBirthDate = employeeByID.EmployeeBirthDate
			employeeEmail = employeeByID.EmployeeEmail
			employeeNumTel = employeeByID.EmployeeNumTel
			password = employeeByID.password
			EmergencyContactTel = employeeByID.EmergencyContactTel
			employeeStartDate = employeeByID.EmployeeStartDate
		}
		super(props)
		this.state = {
			employeeFirstName,
			employeeLastName,
			employeeAddress,
			ZipCode,
			EmployeeBirthDate,
			employeeEmail,
			employeeNumTel,
			password,
			EmergencyContactTel,
			employeeStartDate
		}
	}
	componentDidUpdate(newProps) {
		const { addToast } = this.props;
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
		if (newProps.EditEmployeeStatus !== this.props.EditEmployeeStatus) {
			if (this.props.EditEmployeeStatus.pending) {
				if (
					has(this.props, 'EditEmployeeStatus.data') &&
					this.props.EditEmployeeStatus.data.error === null
				) {
					addToast(<ToastMsg text={'employee updated successfully'} type="success" />);

					this.hide();
					window && window.location.reload()
				}
			}
		}

	}
	hide = () => {
		const { hideEditProfile } = this.props
		hideEditProfile && hideEditProfile()
	}
	handleEditProfile = () => {
		const { employeeFirstName, employeeLastName,
			ZipCode, EmployeeBirthDate, employeeEmail,
			employeeNumTel, password, EmergencyContactTel,
			employeeStartDate, employeeAddress
		} = this.state
		const { mutations: { EditEmployee } } = this.props
		const obj = {
			employeeFirstName, employeeLastName, employeeAddress,
			ZipCode, EmployeeBirthDate, employeeEmail, employeeNumTel, password,
			EmergencyContactTel, employeeStartDate
		}
		const id = isAuthenticated() && isAuthenticated().result && isAuthenticated().result.id
		EditEmployee(id, obj);
		//handleEditProfile&&handleEditProfile(id,obj)

	}
	RenderDownloadFile = (doc) => {
		const { RenderDownloadFile } = this.props
		RenderDownloadFile && RenderDownloadFile(doc)
	}
	uploadFiles = (files) => {
		const { mutations: { uploadFile } } = this.props;
		const url = 'http://localhost:8800/upload_list_files';
		uploadFile(url, files);
	};
	render() {
		const { visibleEditProfile } = this.props
		const { employeeFirstName, employeeLastName,
			employeeAddress, ZipCode, EmployeeBirthDate,
			employeeEmail, employeeNumTel, password,
			EmergencyContactTel
		} = this.state
		const actions = []
		actions.push({ children: 'Cancel', onClick: this.hide });
		actions.push(<Button flat primary onClick={this.handleEditProfile}>save</Button>);
		return (
			<DialogContainer
				id="simple-full-page-dialog"
				visible={visibleEditProfile}
				onHide={this.hide}
				actions={actions}
				className="editEmployee"
				title="Edit Profile"
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
				</div>
				<FileUpload className='addEmployee-dropzone' onUpload={this.uploadFiles} multiple={true} />
				{this.RenderDownloadFile()}
			</DialogContainer>
		)
	}
}
