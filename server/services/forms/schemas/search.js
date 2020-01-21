const Form = require('../form-builder');
const { Component } = require('../component-builder');
const uuid = require('uuid/v4');
const listService = require('../../list');

const search = async (options = {}) => {
    const { submissionUrl } = options;

    const form = Form();

    const listServiceInstance = listService.getInstance(uuid(), null);
    const fieldsFromServer = (await listServiceInstance.fetch('S_SYSTEM_CONFIGURATION')).searchFields;

    fieldsFromServer.map(field => form.withField(Component(field.component, field.name, field).build()));

    return form.withTitle('Search')
        .withPrimaryActionLabel('Search')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', '/')
                .build()
        )
        .withSubmissionUrl(submissionUrl);
};

module.exports = search;