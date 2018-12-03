const serialize = require('serialize-javascript');

let assets = {
    js: [],
    css: []
};

const render = ({
    assetPath = '/public',
    css = [],
    js = [],
    react = 'main', // eslint-disable-line no-unused-vars
    title = 'My React Application',
    propositionHeader = '',
    markup = '',
    props = {},
    clientSide = true
}) => {

    return (`<!DOCTYPE html>
<html lang="en" class="govuk-template ">

<head>
    <meta charset="utf-8" />
    <title>${title || propositionHeader}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0b0c0c" />

    <link rel="shortcut icon" href="${assetPath}/assets/images/favicon.ico" type="image/x-icon" />
    <link rel="mask-icon" href="${assetPath}/assets/images/govuk-mask-icon.svg" color="#0b0c0c">
    <link rel="apple-touch-icon" sizes="180x180" href="${assetPath}/assets/images/govuk-apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon" sizes="167x167" href="${assetPath}/assets/images/govuk-apple-touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="152x152" href="${assetPath}/assets/images/govuk-apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" href="${assetPath}/assets/images/govuk-apple-touch-icon.png">
    ${css.map(style => `<link rel="stylesheet" media="screen" href="${assetPath}/styles/${assets.css[style]}" />`).join('\n')}
    ${clientSide ? js.map(script => `<script defer src="${assetPath}/js/${assets.js[script]}"></script>`).join('\n') : ''}
    ${clientSide ? `<script defer >window.__INITIAL_DATA__ = ${serialize(props)}</script>` : ''}
    ${clientSide ? `<script defer src="${assetPath}/js/${assets.js[react]}"></script>` : ''}
    <script defer src="${assetPath}/all.js"></script>
    <meta property="og:image" content="${assetPath}/assets/images/govuk-opengraph-image.png">
</head>

<body class="govuk-template__body ">

    <div id="app">${markup}</div>

</body>

</html>`);

};

module.exports = {
    use: (a) => assets = a,
    render
};