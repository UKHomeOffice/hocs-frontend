const express = require('express');
const path = require('path');
const render = require('./server/layout/renderer');
const bodyparser = require('body-parser');
const apiRouter = require('./server/routes/api');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'build', 'public')));
app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk_frontend_toolkit')));
app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk_template_mustache', 'assets')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.get('*', render);

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

