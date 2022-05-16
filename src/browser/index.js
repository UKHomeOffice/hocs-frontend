import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-app-polyfill/stable';
import App from '../shared/index.jsx';
import { HelmetProvider } from 'react-helmet-async';
import '../styles/app.scss';
import { hydrateRoot } from 'react-dom/client';
/* eslint-disable no-undef*/
document.body.className = 'govuk-template__body js-enabled';



const container = document.getElementById('app');
// eslint-disable-next-line no-unused-vars
const root = hydrateRoot(container,
    <BrowserRouter>
        <HelmetProvider>
            <App config={window.__INITIAL_DATA__} />
        </HelmetProvider>
    </BrowserRouter>
);
