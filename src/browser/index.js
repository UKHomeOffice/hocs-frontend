import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'react-app-polyfill/stable';
import App from '../shared/index.jsx';
import '../styles/app.scss';
/* eslint-disable no-undef*/
document.body.className = 'govuk-template__body js-enabled';
hydrate(
    <BrowserRouter>
        <App config={window.__INITIAL_DATA__} />
    </BrowserRouter>,
    document.getElementById('app')
);
/* eslint-enable no-undef*/