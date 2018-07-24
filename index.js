const express = require('express');
const session = require('@lennym/redis-session');
const path = require('path');
const caseRouter = require('./server/routes/index');
const logger = require('./server/libs/logger');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend')));
app.use('/public', express.static(path.join(__dirname, 'build', 'public')));


app.use(session({ secret: 'SOME SUPER SECRET' }));

app.use('/', caseRouter);

app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
});

