import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import reportWebVitals from './reportWebVitals';
import Home from './Home';
import View from "./View";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path={'/'} component={Home} />
            <Route exact path={'/view'} component={View} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
