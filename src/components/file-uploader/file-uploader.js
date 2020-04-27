/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import './styles.scss'

export default class FileUpload extends Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop = files => {
    const { onUpload } = this.props
    this.setState({
      files
    })
    onUpload && onUpload(files)
  }

  renderUploadMsg = () => {
    const { files } = this.state
    if (!files.length) {
      return (
        <p className="dropzone-text">
          <b>Choose File</b> Or <b> Drag</b> it here
        </p>
      )
    } else {
      return (
        <p className="dropzone-text">
          <b>
            {files.length}
            {files.length === 1 ? 'File Uploaded' : `File Uploaded`}
          </b>
        </p>
      )
    }
  }
  render() {
    const { className } = this.props
    return (
      <div className={`dropzone ${className || ''}`}>
        <Dropzone onDrop={this.onDrop} >
          {this.renderUploadMsg()}
        </Dropzone>
      </div>
    )
  }
}
