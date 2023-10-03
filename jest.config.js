module.exports = {
    'testEnvironment': 'jsdom',
    'moduleNameMapper': {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        // https://stackoverflow.com/a/77067972
        '^uuid$': require.resolve('uuid')
    },
    'testPathIgnorePatterns': [
        '\\.spec.utils.(js|jsx|ts|tsx)$'
    ],
    'collectCoverage': true,
    'collectCoverageFrom': [
        'src/**/*.{js,jsx,ts,tsx}',
        'server/**/*.{js,ts}'
    ]
};
