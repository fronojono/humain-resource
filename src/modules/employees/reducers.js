import { GET_EMPLOYEES_LIST }from "./constants"

export default function(state = {}, action) {
    switch (action.type) {

      case GET_EMPLOYEES_LIST:
      case GET_EMPLOYEES_LIST + "_FULFILLED": {
        const productionMonthList = action.payload
        return { ...state, productionMonthList }
      }

    default:
      return { ...state }
    }
}
