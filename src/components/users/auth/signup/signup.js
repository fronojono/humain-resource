import React, { Component } from 'react'
import { Link } from "@reach/router"

import IM from '../img/bg-01.jpg'
import mutate from '../../../../libs/hoc/mutate';
import query from 'react-hoc-query';

import {
  ListEmployees,
  AddNewEmployee,

} from '../../../../libs/api';
import '../styles.scss'

@mutate({
  moduleName: 'addEmployee',
  mutations: {
    addNewEmployee: AddNewEmployee,
  }
})
@query({
  key: 'employees',
  name: 'employees',
  op: ListEmployees
})
export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      error: "",
      open: false
    }
  }
  signup = user => {
    console.log(user)
    fetch(`http://localhost:8800/employees/`, {
      method: "POST",

      body: JSON.stringify({ ...user })
    })
      .then(response => {
        return response.json();
      }).then(data => {
        console.log(data)
        if (data.error) this.setState({ error: data.error });
        else
          this.setState({
            error: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            open: true
          });
      })
      .catch(err => {
        console.log(err);
      });
  };
  addEmployee = () => {
    const { mutations: { addNewEmployee } } = this.props;
    const { email, password, firstName, lastName } = this.state

    const obj = {
      employeeFirstName: firstName,
      employeeLastName: lastName,
      EmployeeEmail: email,
      password

    };
    addNewEmployee(obj);
  };

  clickSubmit = event => {
    event.preventDefault();
    const { email, password, firstName, lastName } = this.state
    this.signup({
      EmployeeFirstName: firstName,
      EmployeeLastName: lastName,
      EmployeeEmail: email,
      password
    });


  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  handleChangeViewState = () => {
    const { handleChangeView } = this.props
    handleChangeView && handleChangeView()
  }
  validDialog = () => {
    const { firstName, lastName, email, password } = this.state
    if (!firstName || !lastName || !email || !password) {
      return true
    } else return false
  };


  render() {
    const { open, password, email, firstName, lastName } = this.state
    const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gim

    return (
      <div className="limiter">
        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          New account is successfully created. Please Sign In <Link to={"/"} />.
      </div>
        <div className="container-login100">

          <div className="wrap-login100">
            <div className="login100-form-title" style={{ backgroundImage: `url(${IM} )` }}>
              <span className="login100-form-title-1">
                Sign Up
            </span>
            </div>

            <form className="login100-form validate-form">
              <div className="wrap-input100 validate-input m-b-26" data-validate="Username is required">
                <span className="label-input100">FirstName</span>
                <input className="input100" type="text" value={firstName} required onChange={this.handleChange("firstName")} name="firstName" placeholder="Enter firstName" />
                <span className="focus-input100"></span>
              </div>
              <div className="wrap-input100 validate-input m-b-26" data-validate="Username is required">
                <span className="label-input100">lastName</span>
                <input className="input100" type="text" value={lastName} required onChange={this.handleChange("lastName")} name="lastName" placeholder="Enter lastName" />
                <span className="focus-input100"></span>
              </div>

              <div className="wrap-input100 validate-input m-b-26" data-validate="Username is required">
                <span className="label-input100">Email</span>
                <input className="input100" value={email} onChange={this.handleChange("email")}
                  error={!mailRegex.test(email)}
                  errorText="email invalid"
                  required type="email" name="email" placeholder="Enter email" />
                <span className="focus-input100"></span>
              </div>

              <div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
                <span className="label-input100">Password</span>
                <input className="input100" value={password} onChange={this.handleChange("password")} required type="password" name="pass" placeholder="Enter password" />
                <span className="focus-input100"></span>
              </div>

              <div className="container-login100-form-btn">
                <button className="login100-form-btn" disabled={this.validDialog()} onClick={this.clickSubmit}>
                  Sign Up
              </button> OR
                <button className="login100-form-btn" onClick={this.handleChangeViewState}>
                  Sign In
              </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    )
  }
}
