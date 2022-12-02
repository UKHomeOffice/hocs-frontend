import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'react-app-polyfill/stable';
import App from '../shared/index.jsx';
import { HelmetProvider } from 'react-helmet-async';
import '../styles/app.scss';

const container = document.getElementById('app');
/* eslint-disable no-undef*/
const root = hydrateRoot(container, <BrowserRouter>
    <HelmetProvider>
        <App config={window.__INITIAL_DATA__} />
    </HelmetProvider>
</BrowserRouter>);
/* eslint-enable no-undef*/

