const React = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { default: App } = require('../../build/server/app.server');
const html = require('../layout/html');

async function renderMiddleware(req, res, next) {
    let renderConfig;
    let layoutConfig;
    try {
        const tenantConfig = require('../tenantConfig');
        renderConfig = await tenantConfig.renderConfig();
        layoutConfig = await tenantConfig.layoutConfig();
    }
    catch (error) {
        return next(new Error('Failed to retrieve configuration from server'));
    }

    const { form, data } = req;
    const config = {
        ...res.locals,
        ...req.query,
        data,
        form,
        layout: layoutConfig,
        page: { url: req.baseUrl, params: req.params },
        csrf: req.csrfToken()
    };

    const status = res.locals.error ? res.locals.error.status : 200;

    const context = {
        status
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

function renderResponseMiddleware(req, res) {
    return res.send(res.rendered);
}


module.exports = {
    renderMiddleware,
    renderResponseMiddleware
};