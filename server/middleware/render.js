const React = require('react');
const { StaticRouter } = require('react-router-dom');
const { renderToString } = require('react-dom/server');
const { default: App } = require('../../build/server/app.server');
const logger = require('../libs/logger');
const html = require('../layout/html');

const renderMiddleware = (req, res, next) => {
    logger.debug('RENDER MIDDLEWARE');

    const renderConfig = require('../config').forContext('render');

    const { form, data, error } = req;
    const config = {
        layout: require('../config').forContext('case'),
        form,
        error,
        data
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
};

const renderResponseMiddleware = (req, res) => {
    return res.status(200).send(res.rendered);
};


module.exports = {
    renderMiddleware,
    renderResponseMiddleware
};