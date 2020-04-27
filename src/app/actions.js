
import { createAction } from "redux-actions"


export const addToast = createAction("APP_ADD_TOAST", (text, action) => ({
  text,
  action,
}))

export const dismissToast = createAction("APP_DISMISS_TOAST")