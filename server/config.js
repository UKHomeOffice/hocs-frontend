const isProduction = process.env.NODE_ENV === 'production';
const workflowAuth = (process.env.WORKFLOW_BASIC_AUTH || 'UNSET:UNSET').split(':');

const config = {
    applications: {
        server: {
            WORKFLOW_SERVICE: process.env.WORKFLOW_SERVICE || 'http://localhost:8091',
            WORKFLOW_BASIC_AUTH: process.env.WORKFLOW_BASIC_AUTH ?
                { username: workflowAuth[0], password: workflowAuth[1] } : null,
            CASEWORK_SERVICE: process.env.CASEWORK_SERVICE || 'http://localhost:8082',
            INFO_SERVICE: process.env.INFO_SERVICE || 'http://localhost:8085',
            TEMPLATES_SERVICE: process.env.TEMPLATES_SERVICE || 'http://localhost:8090',
            DOCUMENT_WHITELIST: (process.env.ALLOWED_FILE_EXTENSIONS || 'txt,doc,docx,tiff,tif,xlsx,pdf').split(',').map(extension => extension.trim()),
            DOCUMENT_BULK_LIMIT: process.env.DOCUMENT_BULK_LIMIT || 40,
            VALID_DAYS_RANGE: process.env.VALID_DAYS_RANGE || 180
        },
        AWS: {
            S3: {
                BUCKET_NAME: process.env.S3_BUCKET || 'untrusted-bucket',
                ACCESS_KEY: process.env.S3_ACCESS_KEY || 'UNSET',
                SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || 'UNSET',
                ENDPOINT: isProduction ? null : process.env.S3_ENDPOINT || 'http://localhost:4572',
                PROXY: isProduction ? process.env.OUTBOUND_PROXY : null,
                REGION: isProduction ? process.env.S3_REGION : null,
                SSL_ENABLED: isProduction,
                FORCE_PATH_STYLE: !isProduction,
                SSE_KEY: isProduction ? process.env.S3_SSE_KEY : null
            }
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
    isProduction
};
