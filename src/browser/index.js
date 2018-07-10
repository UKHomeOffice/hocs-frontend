import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from '../shared/index.jsx';
/* eslint-disable-next-line  no-unused-vars*/
import Styles from '../styles/app.scss';

/* eslint-disable no-undef*/
hydrate(
    <BrowserRouter>
        <App config={window.__INITIAL_DATA__} />
    </BrowserRouter>,
    document.getElementById('app')
);
/* eslint-enable no-undef*/