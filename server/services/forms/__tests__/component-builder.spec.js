const { Component, Choice } = require('../component-builder');

describe('Component builder', () => {
    it('should create a form component object with the build method', () => {
        const result = Component('text', 'my_test_field')
            .build();

        expect(result).toBeDefined();
        expect(result.component).toBeDefined();
        expect(result.component).toEqual('text');
        expect(result.validation).toBeDefined();
        expect(result.validation).toEqual([]);
        expect(result.props).toBeDefined();
        expect(result.props).toEqual({ name: 'my_test_field' });
    });

    it('should allow additional properties to be added to the component', () => {
        const result = Component('text', 'my_test_field')
            .withProp('label', 'My test field')
            .withProp('hint', 'This is a text box')
            .build();

        expect(result).toBeDefined();
        expect(result.component).toBeDefined();
        expect(result.component).toEqual('text');
        expect(result.validation).toBeDefined();
        expect(result.validation).toEqual([]);
        expect(result.props).toBeDefined();
        expect(result.props.name).toEqual('my_test_field');
        expect(result.props.label).toEqual('My test field');
        expect(result.props.hint).toEqual('This is a text box');
    });

    it('should not add a property that does not specify a type or value', () => {
        const result = Component('text', 'my_test_field')
            .withProp('label')
            .withProp(null, 'Some Value')
            .build();

        expect(result).toBeDefined();
        expect(result.props.label).toBeUndefined();
    });

    it('should allow validators to be added to the component', () => {
        const result = Component('text', 'my_test_field')
            .withValidator('required', 'Field is required')
            .build();

        expect(result).toBeDefined();
        expect(result.validation).toBeDefined();
        expect(result.validation.length).toEqual(1);
        expect(result.validation[0].type).toEqual('required');
        expect(result.validation[0].message).toEqual('Field is required');
    });

    it('should not add a validator that does not specify a type', () => {
        const result = Component('text', 'my_test_field')
            .withValidator()
            .build();

        expect(result).toBeDefined();
        expect(result.validation).toBeDefined();
        expect(result.validation.length).toEqual(0);
    });

    it('should allow the extension of components by passing in options', () => {
        const template = Component('text', 'my_template_field')
            .withProp('testProperty', true)
            .build();
        const result = Component('text', 'my_test_field', template)
            .build();

        expect(result).toBeDefined();
        expect(result.component).toBeDefined();
        expect(result.component).toEqual('text');
        expect(result.validation).toBeDefined();
        expect(result.validation).toEqual([]);
        expect(result.props).toBeDefined();
        expect(result.props.name).toEqual('my_test_field');
        expect(result.props.testProperty).toEqual(true);
    });
});

describe('Choice function', () => {
    it('should return a choice element for choice fields', () => {
        const result = Choice('Option 1', 'OPTION_1');
        expect(result).toBeDefined();
        expect(result.label).toEqual('Option 1');
        expect(result.value).toEqual('OPTION_1');
    });
});