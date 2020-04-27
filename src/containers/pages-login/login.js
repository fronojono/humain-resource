import React, { Component } from 'react';
import { TextField, Paper,Button } from "react-md"
import i18n from "i18n-js"
import * as cookies from "tiny-cookie"
import query from "react-hoc-query"
import { connect } from "react-redux"
import * as act from "../../app/actions"
import queryString from "query-string"

import { withRouter } from "react-router-dom"
import {login} from '../../libs/api/'
import './style.css'
import l from "../../langs/keys"


@withRouter
@connect(null, {
  addToast: act.addToast,
})
@query({
  key: "me",
  op: login,
})
 class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: "",
    }    
  }
  

  handleUsernameInput = value => {
    this.setState(() => ({ username: value }))
  }

  handlePasswordInput = value => {
    this.setState(() => ({ password: value }))
  }
  handleSubmit = async () => {
    const { username, password } = this.state
    const { addToast,me } = this.props

    try {
      const res = await me.login(username, password)
      if (res) {
        // eslint-disable-next-line camelcase
        const { access_token, refresh_token } = res
        cookies.set("access_token", access_token)
        cookies.set("refresh_token", refresh_token)
        await this.props.query.refetch()
        this.handleSuccess()
      } else {
        addToast(i18n.t(l.loginInvalid))
      }
    } catch (e) {
      addToast(i18n.t(l.loginInvalid))
    }
  }
  handleSuccess() {
    const { url } = queryString.parse(this.props.location.search)
    if (url != null) {
      this.props.history.replace(url)
    } else {
      this.props.history.replace("/")
    }
  }
  render() {
    
    return (
      <div className="place-login-page">
        <Paper zDepth={2} className="place-login-paper">
          <h1 className="place-login-paper-title">{i18n.t(l.loginTitle)}</h1>
          <TextField
            id="username"
            className="place-login-textfield"
            label={i18n.t(l.loginUserName)}
            onChange={this.handleUsernameInput}
          />
          <TextField
            id="password"
            className="place-login-textfield"
            label={i18n.t(l.loginPassword)}
            type="password"
            onChange={this.handlePasswordInput}
          />
          <Button
            primary
            raised
            className="place-login-loginbtn"
            onClick={this.handleSubmit}
          >
            
            {i18n.t(l.loginBtn)}
          </Button>
          <div className="place-login-deco" />
        </Paper>
      </div>
    )
  }
}

export default  withRouter(Login)
 