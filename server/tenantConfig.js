const listService = require('./services/list');
const { runtimeEnvironment } = require('./config');
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
            bulkCreateEnabled: configuration.bulkCreateEnabled,
            viewStandardLinesEnabled: configuration.viewStandardLinesEnabled
        },
        body: {
            phaseBanner: {
                isVisible: true,
                phase: 'BETA',
                feedback: 'mailto:HOCS@homeoffice.gov.uk',
                environment: runtimeEnvironment
            },
        },
        footer: {
            isVisible: true,
            showOGL: false,
            links: getFooterLinks()
        },
        maxSearchResults: 500,
        maxUploadSize: process.env.MAX_UPLOAD_SIZE || 10485760,
        autoCreateAndAllocateEnabled: configuration.autoCreateAndAllocateEnabled,
        defaultTimeoutSeconds: isNaN(defaultTimeoutSeconds) ? 1200 : defaultTimeoutSeconds,
        countDownForSeconds: isNaN(countDownForSeconds) ? 60 : countDownForSeconds
    };
}

function getFooterLinks() {
    const links = [];
    if (process.env.ACCESSIBILITY_STATEMENT_URL) {
        links.push({
            target: process.env.ACCESSIBILITY_STATEMENT_URL,
            label: 'Accessibility'
        });
    }
    return links;
}

async function fetchConfiguration() {
    const listServiceInstance = listService.getInstance(uuid(), null);
    return listServiceInstance.fetch('S_SYSTEM_CONFIGURATION');
}

module.exports = {
    renderConfig, layoutConfig
};
