const Form = require('../form-builder');

describe('Form builder', () => {
    it('should create a form object with the build method', () => {
        const result = Form()
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.data).toBeDefined();
    });

    it('should allow a title to be added to the form', () => {
        const result = Form()
            .withTitle('My Form')
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.schema.title).toEqual('My Form');
        expect(result.schema.defaultActionLabel).toEqual('Submit');
        expect(result.schema.fields.length).toEqual(0);
    });

    xit('should not allow a title to be added to the form if null', () => {
        const defaultFormTitle = 'Form';
        const result = Form()
            .withTitle()
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.schema.title).toEqual(defaultFormTitle);
    });

    it('should allow a field to be added to the form', () => {
        const result = Form()
            .withField({ component: 'text', props: { name: 'test_field' } })
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.fields.length).toEqual(1);
        expect(result.schema.fields[0].component).toEqual('text');
        expect(result.schema.fields[0].props.name).toEqual('test_field');
    });

    it('should not allow a field to be added to the form if null', () => {
        const result = Form()
            .withField()
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.fields.length).toEqual(0);
    });

    it('should allow the label of the submit button to be configured', () => {
        const result = Form()
            .withPrimaryActionLabel('Next')
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.defaultActionLabel).toEqual('Next');
    });

    it('should not allow the label of the submit button to be configured if null', () => {
        const result = Form()
            .withPrimaryActionLabel()
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.defaultActionLabel).toEqual('Submit');
    });

    it('should allow the secondary actions of the form to be configured', () => {
        const result = Form()
            .withSecondaryAction({
                component: 'link',
                props: { name: 'back' }
            })
            .withSecondaryAction({
                component: 'link',
                props: { name: 'reject' }
            })
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.secondaryActions).toBeDefined();
        expect(result.schema.secondaryActions.length).toEqual(2);
    });

    it('should not allow the secondary actions of the form to be configured if null', () => {
        const result = Form()
            .withSecondaryAction()
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.secondaryActions).toBeDefined();
        expect(result.schema.secondaryActions.length).toEqual(0);
    });

    it('should allow the submit action of the form to be hidden', () => {
        const result = Form()
            .withNoPrimaryAction()
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.showPrimaryAction).toBeDefined();
        expect(result.schema.showPrimaryAction).toEqual(false);
    });

    it('should allow the initial form data to be set', () => {
        const result = Form()
            .withData({ first: '1', second: '2' })
            .build();

        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.data.first).toBeDefined();
        expect(result.data.first).toEqual('1');
        expect(result.data.second).toBeDefined();
        expect(result.data.second).toEqual('2');
    });

    it('should allow the subsequent form data to be applied', () => {
        const result = Form()
            .withData({ first: '1', second: '2' })
            .withData({ first: 'ONE' })
            .build();

        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        expect(result.data.first).toBeDefined();
        expect(result.data.first).toEqual('ONE');
        expect(result.data.second).toBeDefined();
        expect(result.data.second).toEqual('2');
    });

    it('should allow the extension of forms by passing in options', () => {
        const template = Form()
            .withTitle('Template Form')
            .withField({ component: 'text', props: { name: 'test_field' } })
            .build();
        const result = Form(template)
            .withField({ component: 'test_field_2', props: { name: 'test_field_2' } })
            .withPrimaryActionLabel('Next')
            .build();

        expect(result).toBeDefined();
        expect(result.schema).toBeDefined();
        expect(result.schema.title).toEqual('Template Form');
        expect(result.schema.fields).toBeDefined();
        expect(result.schema.fields.length).toEqual(2);
        expect(result.schema.defaultActionLabel).toEqual('Next');
    });
});