import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'react-app-polyfill/stable';
import App from '../shared/index.jsx';
import { HelmetProvider } from 'react-helmet-async';
import '../styles/app.scss';

/* eslint-disable no-undef*/
/* eslint-disable no-unused-vars*/
const container = document.getElementById('app');
const root = hydrateRoot(container, <BrowserRouter>
    <HelmetProvider>
        <App config={window.__INITIAL_DATA__} />
    </HelmetProvider>
</BrowserRouter>);
/* eslint-enable no-unused-vars*/
/* eslint-enable no-undef*/

