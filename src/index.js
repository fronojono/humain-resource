import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './langs/'
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store from './store'
import 'babel-polyfill'
import "regenerator-runtime/runtime"
ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>,
document.getElementById('root'));
registerServiceWorker();
