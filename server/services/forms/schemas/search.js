const Form = require('../form-builder');
const { Component } = require('../component-builder');
const { infoService } = require('../../../clients');
const User = require('../../../models/user');


const search = async (options = {}) => {
    const { submissionUrl, user, listService } = options;

    let headers = {
        headers: User.createHeaders(user)
    };
    const userProfileNames = (await infoService.get('/profileNames', headers)).data;
    const form = Form();

    let fields = [];
    const systemConfiguration = await listService.fetch('S_SYSTEM_CONFIGURATION');
    systemConfiguration.profiles.map(profile => {
        if (userProfileNames.includes(profile.profileName)) {
            profile.searchFields.map(searchField => {
                if (!fields.some(field => field.name === searchField.name && field.component === searchField.component)) {
                    fields.push(searchField);
                }
            });
        }
    });

    fields.map(field => form.withField(Component(field.component, field.name, field).build()));

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
