const isProduction = process.env.NODE_ENV === 'production';

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
                    isVisible: false,
                    phase: 'ALPHA',
                    feedbackUrl: '#'
                }
            },
            footer: {
                isVisible: false
            }
        },
        server: {
            WORKFLOW_SERVICE: process.env.WORKFLOW_SERVICE || 'http://localhost:8081',
            DOCUMENT_WHITELIST: process.env.ALLOWED_FILE_EXTENSIONS || 'txt,doc,docx',
        },
        AWS: {
            S3: {
                BUCKET_NAME: process.env.S3_BUCKET || 'hocs-untrusted-bucket',
                ACCESS_KEY: process.env.S3_ACCESS_KEY || 'UNSET',
                SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || 'UNSET',
                ENDPOINT: isProduction ? null : 'http://localhost:4572',
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