const serialize = require('serialize-javascript');

let assets = {
    js: [],
    css: []
};

const render = ({
                    assetPath = '/public',
                    css = [],
                    js = [],
                    react = 'main',
                    title = 'My React Application',
                    propositionHeader = '',
                    markup = '',
                    props = {},
                    clientSide = true
                }) => {
    return (`<!DOCTYPE html>
                <html>
                <head>
                    <meta charSet="utf-8"/>
                    <title>${title || propositionHeader}</title>                            
                
                    <link rel="shortcut icon" href="${assetPath}/images/favicon.ico" type="image/x-icon"/>
                    <link rel="stylesheet" media="screen" href="${assetPath}/stylesheets/govuk-template.css?0.23.0"/>
                    <link rel="stylesheet" media="print" href="${assetPath}/stylesheets/govuk-template-print.css?0.23.0"/>
                    <link rel="stylesheet" media="all" href="${assetPath}/stylesheets/fonts.css?0.23.0"/>
                    <link rel="mask-icon" href="${assetPath}/images/gov.uk_logotype_crown.svg" color="#0b0c0c">
                    <link rel="apple-touch-icon" sizes="180x180" href="${assetPath}/images/apple-touch-icon-180x180.png?0.23.0">
                    <link rel="apple-touch-icon" sizes="167x167" href="${assetPath}/images/apple-touch-icon-167x167.png?0.23.0">
                    <link rel="apple-touch-icon" sizes="152x152" href="${assetPath}/images/apple-touch-icon-152x152.png?0.23.0">
                    <link rel="apple-touch-icon" href="${assetPath}/images/apple-touch-icon.png?0.23.0">            
                    ${css.map(style => `<link rel="stylesheet" media="screen" href="${assetPath}/styles/${assets.css[style]}" />`).join('\n')}
                    ${clientSide ? js.map(script => `<script src="${assetPath}/js/${assets.js[script]}"></script>`).join('\n') : ''}
                    ${clientSide ? `<script>window.__INITIAL_DATA__ = ${serialize(props)}</script>` : ''}
                    
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:image" content=${assetPath}/images/opengraph-image.png?0.23.0/>                    
                </head>
                
                <body>
                    <script>
                        document.body.className = ((document.body.className) ? 
                        document.body.className + ' js-enabled' :
                        'js-enabled');
                    </script>
                    
                    <div id="skiplink-container">
                        <div>
                            <a href="#content" class="skiplink">Skip to main content</a>
                        </div>
                    </div>
                    
                    <div id="global-cookie-message">
                        <p>
                            GOV.UK uses cookies to make the site simpler.
                            <a href="https://www.gov.uk/help/cookies">Find out more about cookies</a>
                        </p>
                    </div>
                        
                    <div id="app">${markup}</div>
                    ${clientSide ? `<script src="${assetPath}/js/${assets.js[react]}" defer></script> `: ''}
                    
                    <div id="global-app-error" className="app-error hidden"></div>
                
                    <script src=${assetPath}/javascripts/govuk-template.js></script>
                    <script src="${assetPath}/javascripts/ie.js"></script>
                    <script>
                        if (typeof window.GOVUK === 'undefined') 
                        document.body.className = document.body.className.replace('js-enabled', '');
                    </script>
                </body>
                </html>`);
};

module.exports = {
    use: (a) => assets = a,
    render
};