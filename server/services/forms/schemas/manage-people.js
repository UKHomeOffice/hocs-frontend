const Form = require('../form-builder');
const { Component } = require('../component-builder');
const listService = require('../../list/service');
const { v4: uuid } = require('uuid');

module.exports = async (options) => {

    async function fetchCorrespondentData() {
        const listServiceInstance = listService.getInstance(uuid(), options.user);
        return listServiceInstance.fetch('CASE_CORRESPONDENTS', options);
    }

    const correspondents = await fetchCorrespondentData();

    const person = correspondents.find(person => person.isPrimary === true) || '';

    return Form()
        .withTitle('Manage People')
        .withField(
            Component('entity-list', 'Correspondents')
                .withValidator('required', 'At least one person is required')
                .withProp('entity', 'correspondent')
                .withProp('label', 'Person we will write back to')
                .withProp('choices', 'CASE_CORRESPONDENTS')
                .withProp('hasEditLink', true)
                .withProp('hasAddLink', true)
                .withProp('hasRemoveLink', true)
                .withProp('hideRemovePrimary', true)
                .withProp('action', 'MANAGE_PEOPLE')
                .withProp('type', 'radio')
                .withProp('checkedValue', person.value)
                .withProp('hideSidebar', false)
                .build()
        )
        .withPrimaryAction('Finish')
        .build();
};
