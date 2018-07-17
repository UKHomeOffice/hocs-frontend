const isProduction = process.env.NODE_ENV === 'production';
const workflowAuth = (process.env.WORKFLOW_BASIC_AUTH || 'UNSET:UNSET').split(':');

const config = {
    applications: {
        render: {
            clientSide: process.env.USE_CLIENTSIDE || true,
            js: ['vendor'],
            css: ['main'],
            react: 'main',
            title: 'Correspondence System',
        },
        case: {
            header: {
                service: 'Correspondence System',
                serviceLink: '/',
                logoLinkTitle: '',
                propositionHeader: '',
                propositionHeaderLink: '/'
            },
            body: {
                phaseBanner: {
                    isVisible: true,
                    phase: 'ALPHA',
                    feedbackUrl: '#'
                }
            },
            footer: {
                isVisible: true
            }
        },
        server: {
            WORKFLOW_SERVICE: process.env.WORKFLOW_SERVICE || 'http://localhost:8081',
            WORKFLOW_BASIC_AUTH: process.env.WORKFLOW_BASIC_AUTH ?
                { username: workflowAuth[0], password: workflowAuth[1] } : null,
            DOCUMENT_WHITELIST: process.env.ALLOWED_FILE_EXTENSIONS || 'txt,doc,docx',
        },
        AWS: {
            S3: {
                BUCKET_NAME: process.env.S3_BUCKET || 'hocs-untrusted-bucket',
                ACCESS_KEY: process.env.S3_ACCESS_KEY || 'UNSET',
                SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || 'UNSET',
                ENDPOINT: isProduction ? null : process.env.S3_ENDPOINT || 'http://localhost:4572',
                PROXY: isProduction ? process.env.OUTBOUND_PROXY : null,
                REGION: isProduction ? process.env.S3_REGION : null,
                SSL_ENABLED: isProduction,
                FORCE_PATH_STYLE: !isProduction
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
