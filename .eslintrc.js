module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "object-curly-spacing": [
            "error", "always"
        ]
    },
    "overrides": [
        {
            "files": [ "**/__tests__/**" ],
            "env": {
                "jest": true
            },
            "globals": {
                "render": false,
                "shallow": false,
                "wrapper": false,
                "mount": false
            }
        },
        {
            "files": [ "**/__snapshots__/**" ],
            "excludedFiles": "*.js.snap"
        },
        {
            "files": [ "src/**" ],
            "env": {
                "commonjs": true
            }
        }
    ]
};
