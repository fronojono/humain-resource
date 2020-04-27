import React, { Component } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import loadable from "react-loadable"


const HomePage = loadable({
  loader: () => import("./header/"),
  loading: () => { return <div>Loading ...</div> },
})

export default class Home extends Component {

  renderRoute = () => {

    return (
      <Switch>
        <Route
          exact
          path="/home"
          render={() => <Redirect to="/home/a" />}
        />
        <Route
          exact
          path="/home/a"
          component={HomePage}
        />
      </Switch>
    )
  }
  render() {
    return this.renderRoute()
  }
}

