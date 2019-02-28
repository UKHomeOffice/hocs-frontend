module.exports = (options) => {
    options = options || { schema: {}, data: {} };
    const schema = {
        title: options.schema.title || 'Form',
        defaultActionLabel: options.schema.primaryActionLabel || 'Submit',
        fields: options.schema.fields || [],
        showPrimaryAction: options.schema.showPrimaryAction || true
    };
    let data = options.data;
    return {
        build: () => ({ schema, data }),
        withTitle: function (title) {
            if (title) {
                schema.title = title;
            }
            return this;
        },
        withField: function (field) {
            if (field) {
                schema.fields.push(field);
            }
            return this;
        },
        withPrimaryActionLabel: function (label) {
            if (label) {
                schema.defaultActionLabel = label;
            }
            return this;
        },
        withSecondaryAction: function (action) {
            if (!schema.secondaryActions) {
                schema.secondaryActions = [];
            }
            if (action) {
                schema.secondaryActions.push(action);
            }
            return this;
        },
        withNoPrimaryAction: function () {
            schema.showPrimaryAction = false;
            return this;
        },
        withSubmissionUrl: function (submissionUrl) {
            schema.action = submissionUrl;
            return this;
        },
        withData: function (newData) {
            data = Object.assign({}, data, newData);
            return this;
        },
        getFields: function () {
            return schema.fields.reduce((reducer, field) => {
                if (field.component === 'date') {
                    reducer.push(`${field.props.name}-day`, `${field.props.name}-month`, `${field.props.name}-year`);
                    return reducer;
                }
                reducer.push({ name: field.props.name });
                return reducer;
            }, []);
        }
    };
};