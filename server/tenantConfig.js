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
    const defaultTimeoutSeconds = Number(process.env.DEFAULT_TIMEOUT_SECONDS);
    const countDownForSeconds = Number(process.env.COUNTDOWN_FOR_SECONDS);
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
        maxUploadSize: process.env.MAX_UPLOAD_SIZE || 10485760,
        autoCreateAndAllocateEnabled: configuration.autoCreateAndAllocateEnabled,
        defaultTimeoutSeconds: isNaN(defaultTimeoutSeconds) ? 300 : defaultTimeoutSeconds,
        countDownForSeconds: isNaN(countDownForSeconds) ? 60 : countDownForSeconds
    };
}

async function fetchConfiguration() {
    const listServiceInstance = listService.getInstance(uuid(), null);
    return listServiceInstance.fetch('S_SYSTEM_CONFIGURATION');
}


module.exports = {
    renderConfig, layoutConfig
};
