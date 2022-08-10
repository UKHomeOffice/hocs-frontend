const { isNotProd } = require('./config');
const { fetchTenantConfiguration } = require('./config/tenant/tenantConfiguration');

const tenant = fetchTenantConfiguration(process.env.TENANT);

async function renderConfig() {
    return {
        clientSide: process.env.USE_CLIENTSIDE || true,
        js: ['runtime', 'vendor'],
        css: ['main'],
        react: 'main',
        title: tenant.displayName,
    };
}

async function layoutConfig() {
    const defaultTimeoutSeconds = Number(process.env.DEFAULT_TIMEOUT_SECONDS);
    const countDownForSeconds = Number(process.env.COUNTDOWN_FOR_SECONDS);
    return {
        header: {
            service: tenant.displayName,
            serviceLink: '/',
            logoLinkTitle: '',
            propositionHeader: '',
            propositionHeaderLink: '/',
            bulkCreateEnabled: tenant.bulkCreate,
            viewStandardLinesEnabled: tenant.viewStandardLines
        },
        body: {
            phaseBanner: {
                isVisible: true,
                phase: 'BETA',
                feedback: 'mailto:DECSLiveSupport@digital.homeoffice.gov.uk',
                isNotProd: isNotProd
            },
        },
        footer: {
            isVisible: true,
            showOGL: false,
            links: getFooterLinks()
        },
        maxSearchResults: 500,
        maxUploadSize: process.env.MAX_UPLOAD_SIZE || 10485760,
        autoCreateAndAllocateEnabled: tenant.autoCreateAndAllocate,
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

module.exports = {
    renderConfig, layoutConfig
};
