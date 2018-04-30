import express from 'express';
import path from 'path';
import html from './layout/html';
import { StaticRouter, matchPath } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import React from 'react';
import App from '../shared/index.jsx';
import config from './config';
import assets from "../../public/assets.json";

html.use(assets);

const app = express();
const port = config.server.port;

app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use('/public', express.static(path.join(process.cwd(), 'node_modules', 'govuk_frontend_toolkit')));
app.use('/public', express.static(path.join(process.cwd(), 'node_modules', 'govuk_template_mustache', 'assets')));

app.get('*', (req, res, next) => {
  const appConfiguration = config.applications['application'];
  const context = {
    status: 200
  };
  const markup = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App config={appConfiguration} />
    </StaticRouter>
  );
  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(context.status);
    res.send(html.render({
      js: ['vendor'],
      css: ['main'],
      react: 'main',
      title: 'My React App',
      props: appConfiguration,
      markup,
      clientside: config.server.react.clientside
    }));
  } 
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

