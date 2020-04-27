import React, { Component } from 'react'
import {Button,DialogContainer} from "react-md"
export default class DialogDelete extends Component {
    handelCancelRow=()=>{
        const {handelCancelRow}=this.props
        handelCancelRow&&handelCancelRow()
    }
    handelCancelRow=(obj)=>{
    const {handelCancelRow}=this.props
    handelCancelRow&&handelCancelRow(obj)
    }
    hideDeleteDialogue=()=>{
        const {hideDeleteDialogue}=this.props
        hideDeleteDialogue&&hideDeleteDialogue()
    }
    render() {
        const {visibleDeleteDialogue}=this.props
        const actionsDeleteDialogue = []
        actionsDeleteDialogue.push(
            <Button
              className="DialogContainer-button-discard"
              flat
              onClick={this.hideDeleteDialogue}
            >
              Discard
            </Button>,
          )
          actionsDeleteDialogue.push(
            <Button flat primary onClick={this.handelCancelRow}>
              Confirm
            </Button>,
          )
        return (
            <DialogContainer
          id="delete-dialogue"
          className="worningDialog"
          disableScrollLocking={true}
          visible={visibleDeleteDialogue}
          onHide={this.hideDeleteDialogue}
          actions={actionsDeleteDialogue}
          title="Warning"
        >
          Are you sure you want to delete this row ?
        </DialogContainer>
        )
    }
}
