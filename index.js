const express = require('express');
const path = require('path');
const applicationRouter = require('./server/routes/index');
const logger = require('./server/libs/logger');
const listService = require('./server/services/list');

const app = express();
const port = process.env.PORT || 7890;

app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend')));
app.use('/public', express.static(path.join(__dirname, 'build', 'public')));

listService.initialise();
app.use('/', applicationRouter);

app.listen(port, () => {
    logger.info(`Application listening on port ${port}`);
});

