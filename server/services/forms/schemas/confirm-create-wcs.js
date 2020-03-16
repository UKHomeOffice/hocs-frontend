const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = () => {
    const now = new Date();
    return Form()
        .withTitle('Record a new claim')
        .withField(
            Component('hidden', 'DateReceived')
                .build()
        )
        .withData({
            DateReceived: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
        })
        .withPrimaryActionLabel('Create claim')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Cancel')
                .build()
        )
        .build();
};
