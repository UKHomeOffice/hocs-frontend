const listService = require('./services/list');
const uuid = require('uuid/v4');

async function renderConfig() {
    const configuration = await fetchConfiguration();
    return {
        clientSide: process.env.USE_CLIENTSIDE || true,
        js: ['runtime', 'vendor'],
        css: ['main'],
        react: 'main',
        title: configuration.displayName,
    };
}

async function layoutConfig() {
    const configuration = await fetchConfiguration();
    return {
        header: {
            service: configuration.displayName,
            serviceLink: '/',
            logoLinkTitle: '',
            propositionHeader: '',
            propositionHeaderLink: '/',
            bulkCreateEnabled: configuration.bulkCreateEnabled
        },
        body: {
            phaseBanner: {
                isVisible: true,
                phase: 'BETA',
                feedback: 'mailto:HOCS@homeoffice.gov.uk'
            }
        },
        footer: {
            isVisible: false
        },
        maxSearchResults: 500,
        maxUploadSize: process.env.MAX_UPLOAD_SIZE || 100000
    };
}

async function fetchConfiguration() {
    const listServiceInstance = listService.getInstance(uuid(), null);
    return listServiceInstance.fetch('S_SYSTEM_CONFIGURATION');
}


module.exports = {
    renderConfig, layoutConfig
};
