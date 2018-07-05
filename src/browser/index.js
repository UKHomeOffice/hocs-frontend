import React from 'react';
import {hydrate} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from '../shared/index.jsx';
import Styles from '../styles/app.scss';

hydrate(
    <BrowserRouter>
        <App config={window.__INITIAL_DATA__}/>
    </BrowserRouter>,
    document.getElementById('app')
);