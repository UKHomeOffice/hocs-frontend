import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'react-app-polyfill/stable';
import App from '../shared/index.jsx';
import { HelmetProvider } from 'react-helmet-async';
import '../styles/app.scss';
/* eslint-disable no-undef*/
document.body.className = 'govuk-template__body js-enabled';
hydrate(
    <BrowserRouter>
        <HelmetProvider>
            <App config={window.__INITIAL_DATA__} />
        </HelmetProvider>
    </BrowserRouter>,
    document.getElementById('app')
);
/* eslint-enable no-undef*/