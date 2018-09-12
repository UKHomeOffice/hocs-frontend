module.exports = (options) => {
    options = options || {};
    const schema = {
        title: options.title || 'Form',
        defaultActionLabel: options.primaryActionLabel || 'Submit',
        fields: options.fields || [],
        showPrimaryAction: true
    };
    return {
        build: () => schema,
        withTitle: function(title) {
            if (title) {
                schema.title = title;
            }
            return this;
        },
        withField: function(field) {
            if (field) {
                schema.fields.push(field);
            }
            return this;
        },
        withPrimaryActionLabel: function(label) {
            if (label) {
                schema.defaultActionLabel = label;
            }
            return this;
        },
        withSecondaryAction: function(action) {
            if (!schema.secondaryActions) {
                schema.secondaryActions = [];
            }
            if (action) {
                schema.secondaryActions.push(action);
            }
            return this;
        },
        withNoPrimaryAction: function() {
            schema.showPrimaryAction = false;
            return this;
        }
    };
};