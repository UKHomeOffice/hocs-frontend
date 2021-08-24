const Form = require('../form-builder');
const { Component } = require('../component-builder');
const listService = require('../../list/service');
const uuid = require('uuid/v4');

module.exports = async options => {
    // APPEAL
    const listServiceInstance = listService.getInstance(uuid(), options.user);

    const somuType = await listServiceInstance.getFromStaticList(
        'SOMU_TYPES',
        ['FOI', 'APPEAL']
    );

    const choices = await listServiceInstance.fetch(
        'FOI_APPEAL_TYPES',
    );

    console.log('CHOICES: ' + JSON.stringify(choices));

    const appeals = listServiceInstance.fetch('CASE_SOMU_ITEM', { caseId: options.caseId, somuTypeId: somuType.uuid });

    return Form()
        .withTitle('Appeals')
        .withField(
            Component('somu-list', 'appeals-somu-list')
                .withProp('label', 'Current appeals')
                .withProp('itemLinks', [{ 'action':'EDIT_APPEAL','label':'Update' }])
                .withProp('primaryLink', { 'action':'ADD_APPEAL','label':'Record an appeal' })
                .withProp('somuType', somuType)
                .withProp('somuItems', appeals)
                .withProp('choices', choices)
                .build()
        )
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                .build()
        )
        .withPrimaryAction('Finish')
        .build();
};
