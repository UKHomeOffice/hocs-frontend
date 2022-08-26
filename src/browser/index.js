import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'react-app-polyfill/stable';
import App from '../shared/index.jsx';
import { HelmetProvider } from 'react-helmet-async';
import '../styles/app.scss';
import { hydrateRoot } from 'react-dom/client';

/* eslint-disable no-undef*/
const container = document.getElementById('app');
const root = hydrateRoot(container,
    <BrowserRouter>
        <HelmetProvider>
            <App config={window.__INITIAL_DATA__} />
        </HelmetProvider>
    </BrowserRouter>
);
/* eslint-enable no-undef*/



