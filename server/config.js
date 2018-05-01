module.exports = {
    applications: {
        application: {
            header: {
                service: 'HOCS',
                serviceLink: 'https://www.gov.uk',
                logoLinkTitle: '',
                propositionHeader: 'Application Title',
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
                isVisible: false,
                links: [
                    {target: '/', label: 'Test Link'}
                ]
            }
        }
    }
}