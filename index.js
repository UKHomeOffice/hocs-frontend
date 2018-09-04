const express = require('express');
const path = require('path');
const applicationRouter = require('./server/routes/index');
const logger = require('./server/libs/logger');
const listService = require('./server/services/list');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend')));
app.use('/public', express.static(path.join(__dirname, 'build', 'public')));

listService.initialise();
app.use('/', applicationRouter);

app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
});

