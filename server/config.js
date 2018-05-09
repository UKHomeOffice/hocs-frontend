const config = {
    applications: {
        server: {
            port: process.env.PORT || 8080
        },
        render: {
            clientSide: process.env.USE_CLIENTSIDE || true,
            js: ['vendor'],
            css: ['main'],
            react: 'main',
            title: 'Home Office Correspondence System',
        },
        case: {
            header: {
                service: 'Home Office Correspondence System',
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
                isVisible: false
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
    }
};