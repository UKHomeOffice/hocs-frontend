const React = require('react');
const { StaticRouter } = require('react-router-dom');
const { renderToString } = require('react-dom/server');
const { default: App } = require('../../build/server/app.server');
const logger = require('../libs/logger');
const html = require('../layout/html');

const render = (req, res, next) => {
    logger.debug('RENDER MIDDLEWARE');

    const renderConfig = require('../config').forContext('render');

    const config = {
        layout: require('../config').forContext('case'),
        form: req.form,
        error: req.error
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
        res.status(context.status || 200);
        res.rendered = html.render({
            ...renderConfig,
            props: config,
            markup
        });
    }
    next();
};

module.exports = render;