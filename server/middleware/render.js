const html = require('../layout/html');
const {StaticRouter} = require('react-router-dom');
const {renderToString} = require('react-dom/server');
const React = require('react');
const {default: App} = require('../../build/server/app.server');
const logger = require('../libs/logger');

const render = (req, res, next) => {
    logger.info('RENDER MIDDLEWARE');

    const renderConfig = require('../config').forContext('render');

    const config = {
        layout: require('../config').forContext('case'),
        form:  res.locals.form
    };

    const context = {
        status: 200
    };

    const markup = renderToString(
        React.createElement(StaticRouter, {location: req.originalUrl, context},
            React.createElement(App, {config})
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