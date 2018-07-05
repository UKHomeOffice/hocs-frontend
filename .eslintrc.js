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
        "ecmaVersion": 6,
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
            "files": [ "src/**" ],
            "env": {
                "commonjs": true
            }
        }
    ]
};
