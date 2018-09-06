const React = require('react');
const { StaticRouter } = require('react-router-dom');
const { renderToString } = require('react-dom/server');
const { default: App } = require('../../build/server/app.server');
const html = require('../layout/html');

function renderMiddleware (req, res, next) {
    const renderConfig = require('../config').forContext('render');

    const { form, data } = req;
    const config = {
        ...res.locals,
        data,
        form,
        layout: require('../config').forContext('case'),
    };

    const context = {
        status: 200
    };

    const markup = renderToString(
        React.createElement(StaticRouter, { location: req.originalUrl, context },
            React.createElement(App, { config })
        )
    );

    if (context.url) {
        res.redirect(context.status, context.url);
    } else {
        res.status(context.status);
        res.rendered = html.render({
            ...renderConfig,
            props: config,
            markup
        });
    }
    next();
}

function renderResponseMiddleware (req, res) {
    return res.status(200).send(res.rendered);
}


module.exports = {
    renderMiddleware,
    renderResponseMiddleware
};