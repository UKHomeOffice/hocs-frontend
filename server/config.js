const isProduction = process.env.NODE_ENV === 'production';
const isNotProd = process.env.IS_NOTPROD === '1';
const showStackTraceInErrorPage = process.env.SHOW_STACKTRACE_ON_ERROR_PAGE === '1';

const config = {
    applications: {
        server: {
            WORKFLOW_SERVICE: process.env.WORKFLOW_SERVICE || 'http://localhost:8091',
            CASEWORK_SERVICE: process.env.CASEWORK_SERVICE || 'http://localhost:8082',
            INFO_SERVICE: process.env.INFO_SERVICE || 'http://localhost:8085',
            TEMPLATES_SERVICE: process.env.TEMPLATES_SERVICE || 'http://localhost:8090',
            DOCUMENT_SERVICE: process.env.DOCUMENT_SERVICE || 'http://localhost:8083',
            DOCUMENT_WHITELIST: (process.env.ALLOWED_FILE_EXTENSIONS || 'txt,doc,docx,tiff,tif,xlsx,pdf').split(',').map(extension => extension.trim()),
            DOCUMENT_BULK_LIMIT: process.env.DOCUMENT_BULK_LIMIT || 40,
            VALID_DAYS_RANGE: process.env.VALID_DAYS_RANGE || 180
        },
        AWS: {
            S3: {
                BUCKET_NAME: process.env.S3_BUCKET || 'untrusted-bucket',
                ACCESS_KEY: process.env.S3_ACCESS_KEY || 'UNSET',
                SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || 'UNSET',
                ENDPOINT: isProduction ? null : process.env.S3_ENDPOINT || 'http://localhost:4566',
                PROXY: isProduction ? process.env.OUTBOUND_PROXY : null,
                REGION: isProduction ? process.env.S3_REGION : 'eu-west-2',
                SSL_ENABLED: isProduction,
                FORCE_PATH_STYLE: !isProduction,
                SSE_KEY: isProduction ? process.env.S3_SSE_KEY : null
            }
        },
        AUTH: {
            ISSUER: process.env.KEYCLOAK_ISSUER || 'http://localhost:9081/auth/realms/hocs',
            CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || 'test-client',
            CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET || '',
            //TODO: the following 2 values are application specific, should they be here?
            REDIRECT_URI: process.env.REDIRECT_URI || 'http://localhost:8080/auth/callback',
            LOGIN_URI: process.env.LOGIN_URI || 'http://localhost:8080/login',
        }
    }
};

module.exports = {
    forContext: context => {
        try {
            return config.applications[context];
        } catch (e) {
            throw new Error('Specified application configuration does not exist');
        }
    },
    isProduction,
    isNotProd,
    showStackTraceInErrorPage
};
