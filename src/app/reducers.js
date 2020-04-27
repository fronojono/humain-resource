import { handleActions } from "redux-actions"
import update from "immutability-helper"

import {
  addToast,
  dismissToast,
  
} from "./actions"

const initialState = {
 
  toasts: [],
 
}

export default handleActions(
  {
    
    

    [addToast](state, { payload }) {
      return update(state, {
        toasts: { $push: [payload] },
      })
    },

    [dismissToast](state) {
      return update(state, {
        toasts: { $splice: [[0, 1]] },
      })
    },

   
    
  },
  initialState,
)