module.exports = {

    Component: (component, name, options = {}) => {
        const validation = options.validation || [];
        const props = { ...options.props, name };

        return {
            build: () => ({ component, validation, props }),
            withValidator: function (type, message, summary, props) {
                if (type) {
                    validation.push({ type, message, summary, props });
                }
                return this;
            },
            withProp: function (prop, value) {
                if (prop && value) {
                    props[prop] = value;
                }
                return this;
            }
        };
    },
    Choice: (label, value, options) => ({ label, value, ...options }),
    ConditionChoice: (conditionPropertyName, conditionPropertyValue, choices, ...options) => ({ conditionPropertyName, conditionPropertyValue, choices, ...options })
};
