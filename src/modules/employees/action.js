import {SET_EMPLOYEES_LIST} from "./constants"
export function setEmpolyees(employees) {
    return {
      type: SET_EMPLOYEES_LIST,
      payload: employees,
    }
  }
