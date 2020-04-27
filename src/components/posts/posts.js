import React from 'react';
import { TextField, Button } from 'react-md';

import mutate from "../../libs/hoc/mutate"
import { newPosts } from '../../libs/api'

@mutate({
  moduleName: "newPosts",
  mutations: {
    newPosts: newPosts,
  },
})
export default class PostsAdd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: ''
    }

  }

  componentWillReceiveProps(newProps) {
    console.log('new Props', newProps)
  }
  handleSubmit = () => {
    const { title, body } = this.state
    const {
      mutations: { newPosts },
    } = this.props
    newPosts(title, body, 1)
  }
  render() {
    const { title, body } = this.state
    return (
      <div className="md-grid">
        <TextField
          id="floating-center-title"
          label="Title"
          lineDirection="center"
          className="md-cell md-cell--bottom"
          value={title}
          onChange={title => this.setState({ title })}
        />
        <TextField
          id="floating-multiline"
          label="Type many letters"
          lineDirection="right"
          rows={2}
          className="md-cell md-cell--bottom"
          value={body}
          onChange={body => this.setState({ body })}
        />
        <Button raised onClick={this.handleSubmit}>Save</Button>
      </div>
    )
  }
}
