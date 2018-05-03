const express = require('express');
const html = require('./html');
const {StaticRouter} = require('react-router-dom');
const {renderToString} = require('react-dom/server');
const React = require('react');
const {default: App} = require('../../build/server/app.server');
const assets = require('../../build/assets.json');

html.use(assets);

const render = (req, res) => {
    const config = require('../config').applications['application'];
    const context = {
        status: 200
    };
    const markup = renderToString(
        React.createElement(StaticRouter, {location: req.url, context},
            React.createElement(App, {config})
        )
    );

    if (context.url) {
        res.redirect(context.status, context.url);
    } else {
        res.status(context.status || 200);
        res.send(html.render({
            js: ['vendor'],
            css: ['main'],
            react: 'main',
            title: 'Home Office Correspondence System',
            props: {...config},
            markup,
            clientside: process.env.USE_CLIENTSIDE || true
        }));
    }
};

module.exports = render;
