const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { infoService } = require('../../../clients');
const User = require('../../../models/user');
const { fetchSearchFieldsForCaseTypes } = require('../../../config/searchFields/searchFields');

const search = async (options = {}) => {
    const { submissionUrl, user } = options;

    let headers = {
        headers: User.createHeaders(user)
    };

    const { data: caseTypes } = await infoService.get('/profileNames?initialCaseType=false', headers);

    const fields = fetchSearchFieldsForCaseTypes(caseTypes);

    const form = Form()
        .withTitle('Search')
        .withPrimaryActionLabel('Search')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', '/')
                .build()
        )
        .withSubmissionUrl(submissionUrl);

    fields.map(field => form.withField(Component(field.component, field.name, field).build()));

    return form;
};

module.exports = search;
