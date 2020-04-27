import React, { Component } from 'react';
import { Paper, Button, MenuButton, ListItem, FontIcon } from 'react-md';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import query from 'react-hoc-query';
/* import { graphql } from 'react-apollo';
import findEmployees from '../../libs/queries/employee.gql'; */
import { has, sortBy } from 'lodash';
import moment from 'moment';
import image from '../../image/client.png';
import {
	ListEmployees,
	AddNewEmployee,
	ListDepartment,
	ListEmployeeRole,
	ListContractType,
	ListManager,
	EditEmployee
} from '../../libs/api';

import AddEmployee from './create-employee/add-employee';
import DataTable from '../../data-table';
import ConfigColumn from './configTable';
import DialogDelete from '../dialog-delete';
import mutate from '../../libs/hoc/mutate';
import { DeleteEmployee } from '../../libs/api';
import { addToast } from '../../app/actions';
import ToastMsg from '../toast-msg';
import EditEmployees from './edit-employee';

import './style.scss';
// import { navigate, Router } from '@reach/router';

/* @graphql(findEmployees, {
	props: ({ data = {} }) => {
		return {
			isLoading: data.loading,
			employeeDetails: data.employees,
			reFetch: data.refetch
		};
	}
}) */
@query({
	key: 'employees',
	name: 'employees',
	op: ListEmployees
})
@query({
	key: 'departments',
	name: 'departments',
	op: ListDepartment
})
@query({
	key: 'employeeRole',
	name: 'employeeRole',
	op: ListEmployeeRole
})
@query({
	key: 'contractType',
	name: 'contractType',
	op: ListContractType
})
@query({
	key: 'manager',
	name: 'manager',
	op: ListManager
})
@mutate({
	moduleName: 'DeleteEmployee',
	mutations: {
		deleteEmployee: DeleteEmployee,
		addNewEmployee: AddNewEmployee,
		EditEmployee
	}
})
@connect(
	({ query }) => ({
		ListEmployee: query.DEFAULT,
		ListDepartment: query.DEFAULT,
		ListEmployeeRole: query.DEFAULT,
		ListContractType: query.DEFAULT,
		ListManager: query.DEFAULT
	}),
	{ addToast }
)
@withRouter
class Employees extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listOfClient: [],
			visible: false,
			selectedRowIndex: null,
			getIdSelected: '',
			changeView: 'grid',
			pageX: null,
			pageY: null,
			visibleDeleteDialogue: false,
			visibleEditDialogue: false
		};
	}

	componentDidUpdate(newProps) {
		const { addToast } = this.props;
		if (newProps.deleteEmployeeStatus !== this.props.deleteEmployeeStatus) {
			if (this.props.deleteEmployeeStatus.pending) {
				if (
					has(this.props, 'deleteEmployeeStatus.data') &&
					this.props.deleteEmployeeStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Deleted successfully'} type="success" />);

					this.hideDeleteDialogue();
					this.props.employees.refetch();
					if (this.props.employees.length !== 0) {
						this.setState({
							getIdSelected: this.props.employees[this.state.selectedRowIndex + 1]
						});
					}
				}
			}
		}

		if (newProps.addNewEmployeeStatus !== this.props.addNewEmployeeStatus) {
			if (this.props.addNewEmployeeStatus.pending) {
				if (
					has(this.props, 'addNewEmployeeStatus.data') &&
					this.props.addNewEmployeeStatus.data.error === null
				) {
					addToast(<ToastMsg text={'Added successfully'} type="success" />);

					this.hideDialogClient();
					this.props.employees.refetch();
				}
			}
		}
		if (newProps.EditEmployeeStatus !== this.props.EditEmployeeStatus) {
			if (this.props.EditEmployeeStatus.pending) {
				if (has(this.props, 'EditEmployeeStatus.data') && this.props.EditEmployeeStatus.data.error === null) {
					addToast(<ToastMsg text={'employee updated successfully'} type="success" />);

					this.hideEditEmployee();
					this.props.employees.refetch();
				}
			}
		}
	}

	handleRowSelect = (selectedRowData, selectedRowIndex) => {
		if (selectedRowData && selectedRowData.id) {
			const getIdSelected = selectedRowData.id;
			this.setState({ getIdSelected, selectedRowIndex, selectedRowData });
		}
	};
	handleSubmit = (objClient) => {
		const { mutations: { addNewEmployee } } = this.props;
		addNewEmployee(objClient);
	};
	handleEditEmployee = (obj) => {
		const { getIdSelected } = this.state;
		const { mutations: { EditEmployee } } = this.props;
		EditEmployee(getIdSelected, obj);
	};
	showDialogClient = (e) => {
		// provide a pageX/pageY to the dialog when making visible to make the
		// dialog "appear" from that x/y coordinate

		this.setState({ visible: true });
	};

	hideDialogClient = () => {
		this.setState({ visible: false });
	};
	handleClick = (data) => {
		const { history } = this.props;

		history.push(`/employees/${data.id}`);
	};

	renderListOfClient = () => {
		const { ListEmployee, role } = this.props;
		let listClient = [];
		if (ListEmployee && ListEmployee.employees && ListEmployee.employees.data && ListEmployee.employees.data.e) {
			const sortedList = sortBy(ListEmployee.employees.data.e, (li) => moment(li.EmployeeStartDate)).reverse();
			listClient = sortedList.map((c, i) => {
				return (
					<Paper key={i} zDepth={1} className="client-card md-cell md-cell--3">
						<div className="client-card-header" onMouseEnter={this.handleHover}>
							<div className="client-card-avatar">
								<img alt="" src={image} />
							</div>
							<div className="client-card-info">
								<div className="firstname">
									{c.EmployeeFirstName}
									<span className="position"> - {c.EmployeeRole}</span>
								</div>
								<div className="details">
									<div>
										<span className="mdi mdi-phone" />
										{c.EmployeeNumTel}
									</div>
									<span className="sep" />
									<div>
										<span className="mdi mdi-email-outline" />
										{c.EmployeeEmail}
									</div>
								</div>

								<div>
									<span className="mdi mdi-map-marker-outline" />
									{c.Address}
								</div>
							</div>
							{(role === 3 || role === 2) && (
								<MenuButton
									id="menu-button-2"
									icon
									className="client-card-menuButton"
									menuClassName="client-card-menu"
									menuItems={[
										<ListItem
											key={1}
											primaryText="view profile"
											onClick={() => this.handleClick(c)}
											leftIcon={<FontIcon>visibility</FontIcon>}
										/>,
										<ListItem
											key={2}
											primaryText="delete employee"
											leftIcon={<FontIcon>delete</FontIcon>}
											onClick={() => this.DeleteEmployee(c.id)}
										/>
									]}
									centered
									anchor={{
										x: MenuButton.HorizontalAnchors.CENTER,
										y: MenuButton.VerticalAnchors.CENTER
									}}
								>
									more_vert
								</MenuButton>
							)}
						</div>
					</Paper>
				);
			});
		}
		return listClient;
	};
	renderDataTableData = () => {
		const { ListEmployee } = this.props;
		let listClient = [];
		if (ListEmployee && ListEmployee.employees && ListEmployee.employees.data && ListEmployee.employees.data.e) {
			const sortedList = sortBy(ListEmployee.employees.data.e, (li) => moment(li.EmployeeStartDate)).reverse();
			listClient = sortedList.map((c) => {
				return {
					employeeFirstName: c.EmployeeFirstName,
					employeeLastName: c.EmployeeLastName,
					employeeEmail: c.EmployeeEmail,
					employeeNumTel: c.EmployeeNumTel,
					employeeAddress: c.Address,
					id: c.id,
					employeeRole: c.EmployeeRole,
					employeeStartDate: c.EmployeeStartDate,
					CNSS: c.CNSS,
					ContractType: c.ContractType,
					EmergencyContactTel: c.EmergencyContactTel,
					EmployeeBirthDate: c.EmployeeBirthDate,
					EmployeeDoc: c.EmployeeDoc,
					EmployeeSalary: c.EmployeeSalary,
					IsManager: c.IsManager,
					Manager: c.Manager,
					RIB: c.RIB,
					Role: c.Role,
					ZipCode: c.ZipCode,
					password: c.password,
					BankName: c.BankName,
					DepartmentInfo: c.DepartmentInfo
				};
			});
		}
		return listClient;
	};

	openDetails = () => {
		const { history } = this.props;
		const { getIdSelected } = this.state;
		history.push(`employees/${getIdSelected}`);

		window && window.location.reload();
	};
	EditEmployee = () => {
		this.setState({ visibleEditDialogue: true });
	};
	hideEditEmployee = () => {
		this.setState({ visibleEditDialogue: false });
	};
	DeleteEmployee = (id) => {
		if (id !== null && id !== undefined) {
			this.setState({
				visibleDeleteDialogue: true,
				getIdSelected: id
			});
		} else {
			this.setState({
				visibleDeleteDialogue: true
			});
		}
	};
	hideDeleteDialogue = () => {
		this.setState({
			visibleDeleteDialogue: false
		});
	};
	handelCancelRow = () => {
		const { mutations: { deleteEmployee } } = this.props;
		const { getIdSelected } = this.state;

		deleteEmployee(getIdSelected);
	};
	renderListDepartment = () => {
		const { ListDepartment } = this.props;
		let listDepartment = [];
		if (
			ListDepartment &&
			ListDepartment.departments &&
			ListDepartment.departments.data &&
			ListDepartment.departments.data.d
		) {
			listDepartment = ListDepartment.departments.data.d.map((c) => {
				return c.DepartmentName;
			});
		}
		return listDepartment;
	};
	renderListEmployeeRole = () => {
		const { ListEmployeeRole } = this.props;
		let listEmployeeRole = [];
		if (
			ListEmployeeRole &&
			ListEmployeeRole.employeeRole &&
			ListEmployeeRole.employeeRole.data &&
			ListEmployeeRole.employeeRole.data.r
		) {
			listEmployeeRole = ListEmployeeRole.employeeRole.data.r.map((c) => {
				return c.Role;
			});
		}
		return listEmployeeRole;
	};
	renderListContractType = () => {
		const { ListContractType } = this.props;
		let listContractType = [];
		if (
			ListContractType &&
			ListContractType.contractType &&
			ListContractType.contractType.data &&
			ListContractType.contractType.data.c
		) {
			listContractType = ListContractType.contractType.data.c.map((d) => {
				return d.ContractType;
			});
		}
		return listContractType;
	};
	renderListManager = () => {
		const { ListManager } = this.props;
		let listManager = [];
		if (ListManager && ListManager.manager && ListManager.manager.data && ListManager.manager.data.data) {
			listManager = ListManager.manager.data.data.map((d) => {
				return d.EmployeeFirstName;
			});
		}
		return listManager;
	};
	RenderListRole = () => {
		return [
			{ name: 'EMPLOYE', value: 1 },
			{ name: 'ADMIN', value: 2 },
			{ name: 'SUPERADMIN', value: 3 },
			{ name: 'MANAGER', value: 0 },
			{ name: 'HR', value: 4 }
		];
	};
	render() {
		const {
			visible,
			getIdSelected,
			changeView,
			pageX,
			pageY,
			visibleDeleteDialogue,
			visibleEditDialogue,
			selectedRowData
		} = this.state;
		const { role } = this.props;
		return (
			<div className="employeeWrapper">
				<div className="employeeWrapper-header md-paper--1">
					{role === 3 || role === 2 ? (
						<div>
							<Button
								primary
								raised
								iconChildren="person_add"
								className="action-btn"
								onClick={this.showDialogClient}
							>
								Create Employee
							</Button>

							{changeView === 'grid' &&
							getIdSelected && (
								<Button
									primary
									raised
									className="action-btn"
									iconChildren="visibility"
									disabled={!getIdSelected}
									onClick={() => this.openDetails()}
								>
									View Profile
								</Button>
							)}
							{changeView === 'grid' &&
							getIdSelected && (
								<Button
									secondary
									raised
									className="action-btn"
									iconChildren="delete"
									disabled={!getIdSelected}
									onClick={() => this.DeleteEmployee()}
								>
									Delete Employee
								</Button>
							)}
							{changeView === 'grid' &&
							getIdSelected && (
								<Button
									primary
									raised
									className="action-btn"
									iconChildren="edit"
									disabled={!getIdSelected}
									onClick={() => this.EditEmployee()}
								>
									Edit Employee
								</Button>
							)}
						</div>
					) : (
						''
					)}

					<div className="changeViewButtons">
						<Button
							icon
							className={`viewButton ${changeView === 'grid' ? 'selected' : ''}`}
							onClick={() => this.setState({ changeView: 'grid' })}
						>
							view_stream
						</Button>
						<Button
							icon
							className={`viewButton ${changeView === 'card' ? 'selected' : ''}`}
							onClick={() => this.setState({ changeView: 'card' })}
						>
							view_module
						</Button>
					</div>
				</div>

				<AddEmployee
					handleSubmit={this.handleSubmit}
					show={this.showDialogClient}
					hide={this.hideDialogClient}
					visible={visible}
					pageX={pageX}
					pageY={pageY}
					listDepartment={this.renderListDepartment() || []}
					listEmployeeRole={this.renderListEmployeeRole() || []}
					listContractType={this.renderListContractType() || []}
					listManager={this.renderListManager() || []}
					RenderListRole={this.RenderListRole()}
				/>

				{visibleEditDialogue && (
					<EditEmployees
						show={this.showDialogClient}
						hide={this.hideEditEmployee}
						visible={visibleEditDialogue}
						selectedRowData={selectedRowData}
						listDepartment={this.renderListDepartment() || []}
						listEmployeeRole={this.renderListEmployeeRole() || []}
						listContractType={this.renderListContractType() || []}
						listManager={this.renderListManager() || []}
						handleSubmit={this.handleEditEmployee}
						RenderListRole={this.RenderListRole()}
					/>
				)}

				{changeView === 'card' && <div className="md-grid clientCardWrapper">{this.renderListOfClient()}</div>}
				{changeView === 'grid' && (
					<DataTable
						title="List Of Employees"
						columnConfig={ConfigColumn}
						data={this.renderDataTableData()}
						showControls
						withPadding
						onRowSelect={this.handleRowSelect}
						selectedRowIndex={this.state.selectedRowIndex}
						zDepth={1}
					/>
				)}
				<DialogDelete
					handelCancelRow={this.handelCancelRow}
					hideDeleteDialogue={this.hideDeleteDialogue}
					visibleDeleteDialogue={visibleDeleteDialogue}
				/>
			</div>
		);
	}
}
export default Employees;
