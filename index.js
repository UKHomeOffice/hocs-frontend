const express = require('express');
const path = require('path');
const applicationRouter = require('./server/routes/index');
const logger = require('./server/libs/logger');
const listService = require('./server/services/list');
const listConfiguration = require('./server/lists');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend'), { maxAge: 36000000 }));
app.use('/public', express.static(path.join(__dirname, 'build', 'public'), { maxAge: 36000000 }));

app.use('/', applicationRouter);

listService.initialise(listConfiguration.lists, listConfiguration.clients);

app.listen(port, () => {
    logger().debug('SERVER_START', { port });
});
