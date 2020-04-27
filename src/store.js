import { createStore, combineReducers, compose } from "redux"
import app from './app/reducers'
import query from "react-hoc-query/lib/reducers"
import mutation from "./modules/mutate/reducers"
import employees from "./modules/employees/reducers"

const store = createStore(
  combineReducers({

    // form,
    app,
    query,
    mutation,
    employees

  }),
  compose(

    //TODO: this is deprecated
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
)

export const dispatch = store.dispatch.bind(store)
export const getState = store.getState.bind(store)

export default store
