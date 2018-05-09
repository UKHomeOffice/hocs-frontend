const html = require('../layout/html');
const {StaticRouter} = require('react-router-dom');
const {renderToString} = require('react-dom/server');
const React = require('react');
const {default: App} = require('../../build/server/app.server');

const render = (req, res, next) => {
    console.log('RENDER MIDDLEWARE');

    const props = require('../config').forContext('case');
    const config = require('../config').forContext('render');

    const context = {
        status: 200
    };

    const markup = renderToString(
        React.createElement(StaticRouter, {location: req.originalUrl, context},
            React.createElement(App, {config: props})
        )
    );

    if (context.url) {
        res.redirect(context.status, context.url);
    } else {
        res.status(context.status || 200);
        res.rendered = html.render({
            ...config,
            props,
            markup
        });
    }
    next();
};

module.exports = render;