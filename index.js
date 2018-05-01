const express = require('express');
const path = require('path');
const render = require('./server/index');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'build', 'public')));
app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk_frontend_toolkit')));
app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk_template_mustache', 'assets')));

app.get('*', render);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

