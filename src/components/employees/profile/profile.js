import React, { Component, Fragment } from 'react'
import { Avatar, FontIcon, List, ListItem, Button } from 'react-md'
import query from "react-hoc-query"
import mutate from '../../../libs/hoc/mutate';
import Chart from 'react-google-charts';
import { withRouter } from "react-router"
import { connect } from "react-redux"
import moment from 'moment-business-days'
import { bytesToSize } from '../../../libs/utils/converter-byte-to-any-format'
import { CurrentUser, leaveRequestsById } from "../../../libs/api"
import defaultBackground from "../../../image/background_01.jpg"
import Image from "../../../image/client.png"
// import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import "./styles.scss"
import { isAuthenticated } from '../../users/auth/auth';
import LeaveRequest from "../../leaveRequest"
import EditProfile from "./edit-profile"
@withRouter
/* @query({
    key: 'CurrentUser',
    name: 'CurrentUser',
    op: () => CurrentUser(isAuthenticated().result.id)
}) */
@query({
    key: 'leaveRequestsById',
    name: 'leaveRequestsById',
    op: () => leaveRequestsById(isAuthenticated().result.id)
})

@connect(
    ({ query }) => ({
        CurrentUser: query.DEFAULT,
    })
)
@mutate({
	moduleName: 'CurrentUser',
	mutations: {
		CurrentUser
	}
})

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            option: null,
            visibleEditProfile: false
        }
    }

    renderChart = () => {
        const { CurrentUser } = this.props
        if (CurrentUser && CurrentUser.CurrentUser && CurrentUser.CurrentUser.data && CurrentUser.CurrentUser.data.e) {
            const EmployeeStartDate = CurrentUser.CurrentUser.data.e.EmployeeStartDate
            const today = moment(Date(new Date())).format('MM/DD/YYYY')
            const a = moment(today)
            const b = moment(EmployeeStartDate)
            const dayWorked = moment(b, 'MM-DD-YYYY').businessDiff(
                moment(a, 'MM-DD-YYYY')
            )
            const monthWorked = dayWorked / 22
            const leaveDays = (monthWorked * 1.8).toFixed(2)

            const employeeLeaveDays = leaveDays - this.sumLeaveDays()
            return (
                <div className='profileInfoBox' style={{ marginTop: 0 }}>
                    <div className="profileInfoBox-header">Leave Days</div>
                    <div className="chartWrapper">
                        <Chart
                            width={'300px'}
                            height={'300px'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}
                            data={[
                                ['Leaves', 'rang'],
                                ['leave Days', this.sumLeaveDays()],
                                ['Leave Days left', employeeLeaveDays],
                            ]}
                            options={{
                                // title: 'none',
                                legend: 'none',
                                slices: {
                                    0: { color: '#99CCCC' },
                                    1: { color: '#0D47A1' },
                                },
                            }}
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </div>

                </div>
            )
        }
    }
    componentDidMount(){
        const { mutations: { CurrentUser } } = this.props;
        CurrentUser(isAuthenticated().result.id) 
    }
    renderData = () => {
        const { CurrentUserStatus } = this.props
        if (CurrentUserStatus && CurrentUserStatus.data && CurrentUserStatus.data.e) {
            const EmployeeFirstName = CurrentUserStatus.data.e.EmployeeFirstName
            const EmployeeLastName = CurrentUserStatus.data.e.EmployeeLastName
            const EmployeeRole = CurrentUserStatus.data.e.EmployeeRole
            const EmployeeEmail = CurrentUserStatus.data.e.EmployeeEmail
            const EmployeeBirthDate = CurrentUserStatus.data.e.EmployeeBirthDate
            const EmployeeNumTel = CurrentUserStatus.data.e.EmployeeNumTel
            const EmergencyContactTel = CurrentUserStatus.data.e.EmergencyContactTel
            const Address = CurrentUserStatus.data.e.Address
            const ZipCode = CurrentUserStatus.data.e.ZipCode
            const EmployeeStartDate = CurrentUserStatus.data.e.EmployeeStartDate
            // const LisDoc = CurrentUser.CurrentUserStatus.data.e.EmployeeDoc && CurrentUser.CurrentUserStatus.data.e.EmployeeDoc
            const EmpSalary = CurrentUserStatus.data.e.EmployeeSalary
            const Cnss = CurrentUserStatus.data.e.CNSS
            const bankName = CurrentUserStatus.data.e.BankName
            const ContractType = CurrentUserStatus.data.e.ContractType
            const managerName = CurrentUserStatus.data.e.Manager
            const RIB = CurrentUserStatus.data.e.RIB
            const departmentName = CurrentUserStatus.data.e.DepartmentInfo.Name

            return (
                <Fragment>
                    <div className="personalInfo md-paper--1">
                        <Avatar className="personalInfo-avatar" src={Image} />
                        <Button className="personalInfo-editButton" primary icon onClick={this.showEditProfile}>edit</Button>
                        <div className="personalInfo-name">{EmployeeFirstName}  {EmployeeLastName}</div>
                        <div className="personalInfo-position">{EmployeeRole || ''}</div>
                        <List className="personalInfo-info">
                            <ListItem primaryText={EmployeeEmail || <span>test@test.com</span>} leftIcon={<FontIcon>email</FontIcon>} />
                            <ListItem primaryText={EmployeeNumTel || <span>+216 ** *** ***</span>} leftIcon={<FontIcon>phone</FontIcon>} />
                            <ListItem primaryText={EmployeeBirthDate || <span>Date of birth</span>} leftIcon={<FontIcon>cake</FontIcon>} />
                            <ListItem primaryText={Address || ZipCode || <span>Address</span>} leftIcon={<FontIcon>room</FontIcon>} />
                            <ListItem primaryText={EmergencyContactTel || <span>Emergency Contact Tel</span>} leftIcon={<FontIcon>contact_phone</FontIcon>} />
                        </List>
                    </div>

                    <div className='profileInfoBox'>
                        <div className="profileInfoBox-header">Professional information</div>
                        <div className="profileInfoBox-content">
                            <div className="profileInfoBox-item">
                                <div>Contract Type :</div>
                                <div className="profileInfoBox-item-title">{ContractType || '---'}</div>
                            </div>

                            <div className="profileInfoBox-item">
                                <div>Manager Name :</div>
                                <div className="profileInfoBox-item-title">{managerName || '---'}</div>
                            </div>

                            <div className="profileInfoBox-item">
                                <div>Department :</div>
                                <div className="profileInfoBox-item-title">{departmentName || '---'}</div>
                            </div>

                            <div className="profileInfoBox-item">
                                <div>Employee Start Date:</div>
                                <div className="profileInfoBox-item-title">{EmployeeStartDate || '---'}</div>
                            </div>
                        </div>
                    </div>

                    <div className='profileInfoBox'>
                        <div className="profileInfoBox-header">Financial Information</div>
                        <div className="profileInfoBox-content">
                            <div className="profileInfoBox-item">
                                <div>Salary :</div>
                                <div className="profileInfoBox-item-title">{EmpSalary || '---'} {'DT'}</div>
                            </div>

                            <div className="profileInfoBox-item">
                                <div>CNSS :</div>
                                <div className="profileInfoBox-item-title">{Cnss || '---'}</div>
                            </div>

                            <div className="profileInfoBox-item">
                                <div>BankName :</div>
                                <div className="profileInfoBox-item-title">{bankName || '---'}</div>
                            </div>

                            <div className="profileInfoBox-item">
                                <div>RIB :</div>
                                <div className="profileInfoBox-item-title">{RIB || '---'}</div>
                            </div>


                        </div>
                    </div>
                </Fragment>

            )
        }
    }
    sumLeaveDays = () => {
        const { leaveRequestsById } = this.props
        let sum = 0
        let leaveApproved = []
        if (
            leaveRequestsById &&
            leaveRequestsById.data &&
            leaveRequestsById.data.l &&
            leaveRequestsById.data.l.length !== null
        ) {
            leaveApproved = leaveRequestsById &&
                leaveRequestsById.data &&
                leaveRequestsById.data.l
                    .filter(el => el.AdminRequestStatus === 'Approved')
            if (leaveApproved.length !== 0) {
                sum =
                    leaveApproved.map(item => item.LeaveDays)
                        .reduce((a, b) => a + b)
            }

        } else {
            return 0
        }

        return sum
    }
    hideEditProfile = () => {
        this.setState({
            visibleEditProfile: false
        })
    }
    showEditProfile = () => {
        this.setState({
            visibleEditProfile: true
        })
    }
    render() {
        const { name, CurrentUserStatus } = this.props
        const { visibleEditProfile } = this.state
        let LisDoc
        if ( CurrentUserStatus && CurrentUserStatus.data && CurrentUserStatus.data.e) {
            LisDoc = CurrentUserStatus.data.e.EmployeeDoc&&CurrentUserStatus.data.e.EmployeeDoc 
        }
        let user = {}
        if (isAuthenticated() && isAuthenticated().result) {
            user.AppliedByName = isAuthenticated().result && isAuthenticated().result.EmployeeFirstName
            user.AppliedById = isAuthenticated().result && isAuthenticated().result.id
        }
        return (
            <div className="profile-container">
                <div className="profile-banner">
                    <img
                        className="profile-header-background-img"
                        src={defaultBackground}
                        alt={name}
                    />
                </div>


                {visibleEditProfile && <EditProfile RenderDownloadFile={this.RenderDownloadFile}
                    visibleEditProfile={visibleEditProfile} hideEditProfile={this.hideEditProfile}
                    employeeByID={CurrentUser && CurrentUser.CurrentUser && CurrentUser.CurrentUser.data && CurrentUser.CurrentUser.data.e}
                />}
                <div className="md-grid">
                    <div className="md-cell md-cell--3">
                        {this.renderData()}
                    </div>
                    <div className="md-cell md-cell--6">
                        <LeaveRequest employee={user} />
                    </div>
                    <div className="md-cell md-cell--3">
                        {this.renderChart()}
                        <div className='profileInfoBox'>
                            <div className="profileInfoBox-header">Attached Files</div>
                            <div className="profileInfoBox-content">
                                {RenderDownloadFile(LisDoc)}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const renderDocumentIcon = ContentType => {

    if (ContentType === 'application/msword') {
        return (
            <FontIcon
                icon
                iconClassName={`mdi mdi-file-word`}
                className="docs-icon-area blue"
            />
        )
    }
    if (ContentType === 'application/pdf') {
        return (
            <FontIcon
                icon
                iconClassName={`mdi mdi-file-pdf`}
                className="docs-icon-area red"
            />
        )
    }
    if (ContentType === 'application/zip') {
        return (
            <FontIcon
                icon
                iconClassName={`mdi mdi-zip-box`}
                className="docs-icon-area blue"
            />
        )
    }
    if ((ContentType === 'image/jpeg') || (ContentType === 'image/png') || (ContentType === 'image/gif')) {
        return (
            <FontIcon
                icon
                iconClassName={`mdi mdi-file-image`}
                className="docs-icon-area purple"
            />
        )
    }
    if ((ContentType === 'application/vnd.ms-excel') || (ContentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return (
            <FontIcon className="docs-icon-area green" icon iconClassName={`mdi mdi-file-excel`} />
        )
    } else {
        return (
            <FontIcon className="docs-icon-area" icon iconClassName={`mdi mdi-file`} />
        )
    }
}

export const RenderDownloadFile = (ListDoc) => {

    if (typeof ListDoc === "object" && Array.isArray(ListDoc) && ListDoc !== null) {
        return ListDoc.map((item, index) => {

            return (
                <div key={index} className="docs-item">
                    {renderDocumentIcon(item.ContentType)}
                    <div className="docs-text-area">
                        <div className="doc-title">{item.Name}</div>
                        <div>{`${bytesToSize(item.Size)}`}</div>
                    </div>
                    <a href={`http://localhost:8800/${item.URL}`} className='docs-item-downloadButton mdi mdi-arrow-down-bold-circle' />
                </div>
            )
        })
    } else {
        return <div></div>
    }

}
