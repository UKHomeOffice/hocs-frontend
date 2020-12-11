const Form = require('../form-builder');
const { Component } = require('../component-builder');

module.exports = async options => {
    const { schema, items, uuid } = options.context;
    const RemoveRenderer = {
        MPAM_REMOVE: 'MpamRemove'
    };
    var item = null;
    for(let i = 0; i < items.length; i++){
        if (items[i].uuid === uuid){
            item = items[i];
        }
    }
    var form = Form().withTitle('Remove');
    switch (schema.renderers.remove) {
        case RemoveRenderer.MPAM_REMOVE:
            form = form
                .withField(
                    Component('paragraph')
                        .withProp('children', `Remove contribution ${item.BusinessArea} / ${item.Team} from case?`)
                        .build()
                );
            break;
        default:
            form = form
                .withField(
                    Component('paragraph')
                        .withProp('children', `Remove ${item.displayName} from case?`)
                        .build()
                );
    }
    return form
        .withPrimaryActionLabel('Remove')
        .withSecondaryAction(
            Component('backlink')
                .withProp('label', 'Back')
                .withProp('action', `/case/${options.caseId}/stage/${options.stageId}`)
                .build()
        )
        .build();
};