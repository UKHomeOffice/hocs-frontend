export default {
  server: {
    port: process.env.PORT || 8081,
    react: {
      clientside: true
    }
  },
  applications: {
    application: {
      header: {
        service: 'HOCS',
        serviceLink: 'https://www.gov.uk',
        logoLinkTitle: '',
        propositionHeader: 'Application Title',
        propositionHeaderLink: '/',
        menu: {
          isVisible: false
        }
      },
      body: {
        phaseBanner: {
          isVisible: true,
          phase: 'ALPHA',
          feedbackUrl: '#'
        }      
      },
      footer: {
        isVisible: true,
        links: [
          { target: '/', label: 'Test Link' }
        ]
      }
    }
  }
}