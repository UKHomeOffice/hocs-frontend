import serialize from 'serialize-javascript';
import assets from '../../../public/assets.json';

const html = ({
  assetPath = 'public',
  css = [],
  js = [],
  react = 'main',
  title = 'My React Application',
  propositionHeader = '',
  markup = '',
  props = {},
  clientside = true
}) => {
  return `<!DOCTYPE html>
  <html>
      <head>
          <meta charSet="utf-8"/>
          <title>${title || propositionHeader}</title>                            
      
          <link rel="shortcut icon" href="${assetPath}/images/favicon.ico" type="image/x-icon"/>
          <link rel="stylesheet" media="screen" href="${assetPath}/stylesheets/govuk-template.css"/>
          <link rel="stylesheet" media="print" href="${assetPath}/stylesheets/govuk-template-print.css"/>
          <link rel="stylesheet" media="all" href="${assetPath}/stylesheets/fonts.css"/>
          <link rel="mask-icon" href="${assetPath}/images/gov.uk_logotype_crown.svg" color="#0b0c0c">
          <link rel="apple-touch-icon" sizes="180x180" href="${assetPath}/images/apple-touch-icon-180x180.png">
          <link rel="apple-touch-icon" sizes="167x167" href="${assetPath}/images/apple-touch-icon-167x167.png">
          <link rel="apple-touch-icon" sizes="152x152" href="${assetPath}/images/apple-touch-icon-152x152.png">
          <link rel="apple-touch-icon" href="${assetPath}/images/apple-touch-icon.png">            
          ${css.map(style => `<link rel="stylesheet" media="screen" href="${assetPath}/${assets.css[style]}" />`).join('')}
          ${clientside ? js.map(script => `<script src="${assetPath}/${assets.js[script]}"></script>`).join('') : ''}
          ${clientside ? `<script>window.__INITIAL_DATA__ = ${serialize(props)}</script>` : ''}
          
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta property="og:image" content=${assetPath}/images/opengraph-image.png/>                    
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
          ${clientside ? `<script src="${assetPath}/${assets.js[react]}" defer></script>` : ''}
          
          <div id="global-app-error" className="app-error hidden"></div>
  
          <script src=${assetPath}/javascripts/govuk-template.js></script>
          <script src="${assetPath}/javascripts/ie.js"></script>
          <script>
              if (typeof window.GOVUK === 'undefined') 
              document.body.className = document.body.className.replace('js-enabled', '');
          </script>
      </body>
  </html>`;
};

export default html;