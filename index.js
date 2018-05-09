const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const apiRouter = require('./server/routes/api');
const caseRouter = require('./server/routes/case');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'build', 'public')));
app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk_frontend_toolkit')));
app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk_template_mustache', 'assets')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use('/*', caseRouter);
app.use('/api', apiRouter);

app.post('*', (req, res) => {
   res.redirect('/error');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

