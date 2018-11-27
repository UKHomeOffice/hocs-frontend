const spdy = require('spdy');
const express = require('express');
const fs = require('fs');
const path = require('path');
const applicationRouter = require('./server/routes/index');
const logger = require('./server/libs/logger');
const listService = require('./server/services/list');

const app = express();
const port = process.env.PORT || 8080;

app.use('/public', express.static(path.join(__dirname, 'node_modules', 'govuk-frontend'), { maxAge: 36000000 }));
app.use('/public', express.static(path.join(__dirname, 'build', 'public'), { maxAge: 36000000 }));

listService.initialise();
app.use('/', applicationRouter);

const isProduction = process.env.NODE_ENV === 'production';
let options;

if(isProduction) {
    options = {
        cert: fs.readFileSync('/certs/tls.pem'),
        key: fs.readFileSync('/certs/tls-key.pem'),
    };
    logger.info('Production: using SPDY/H2 and SSL if possible');
} else {
    options = {
        spdy: {
            ssl: false,
            plain: true
        }
    };
    logger.info('Not production: Using HTTP/1.1');
}

spdy.createServer(options, app).listen(port, () => {
    logger.info(`Application listening on port ${port}`);
});
