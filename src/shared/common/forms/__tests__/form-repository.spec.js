import { formComponentFactory, secondaryActionFactory } from '../form-repository';

const mockCallback = jest.fn();

const mockChoices = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
];

const supportedFormComponents = [
    { component: 'text', props: { name: 'text-component' } },
    { component: 'radio', props: { name: 'radio-component', type: 'radio', choices: mockChoices } },
    { component: 'date', props: { name: 'date-component' } },
    { component: 'checkbox', props: { name: 'checkbox-component', type: 'checkbox', choices: mockChoices } },
    { component: 'text-area', props: { name: 'text-area-component' } },
    { component: 'dropdown', props: { name: 'dropdown-component', choices: mockChoices } },
    { component: 'button', props: { name: 'button-component' } },
    { component: 'add-document', props: { name: 'add-document-component' } },
    { component: 'entity-list', props: { name: 'entity-list-component' } },
    { component: 'heading', props: { name: 'heading', label: 'label' } },
    { component: 'panel', props: { name: 'panel' } },
    { component: 'inset', props: { name: 'inset' } },
    { component: 'paragraph', props: { name: 'paragraph' } },
    { component: 'hidden', props: { name: 'hidden' } },
];

const supportedSecondaryActions = [
    { component: 'backlink', props: { action: '/', dispatch: jest.fn() } },
    { component: 'button', props: { action: '/', dispatch: jest.fn() } },
];

const testData = {
    'text-component': 'TEST',
    'checkbox-component-A': true,
    'checkbox-component-B': false
};

const testValidationErrors = {
    'text-component': 'VALIDATION_ERROR'
};

describe('Form repository', () => {

    beforeEach(() => {
        mockCallback.mockReset();
    });

    it('should export factory methods for creating components', () => {
        expect(formComponentFactory).toBeDefined();
        expect(typeof formComponentFactory).toEqual('function');
        expect(secondaryActionFactory).toBeDefined();
        expect(typeof secondaryActionFactory).toEqual('function');
    });

    it('should return null if form component is not supported', () => {
        const Component = formComponentFactory('SOME_UNSUPPORTED_COMPONENT', {});
        expect(Component).toBeNull();
    });

    xit('should support components in the supportedFormComponents list', () => {
        supportedFormComponents.map(({ component, props }) => {
            const Component = formComponentFactory(component, {
                key: 1,
                config: props,
                callback: mockCallback
            });
            const wrapper = shallow(Component);
            expect(wrapper).toBeDefined();
        });
    });

    it('should pass errors when passed in options', () => {
        const componentConfiguration = supportedFormComponents
            .filter(field => field.component === 'text')
            .reduce((reducer, field) => reducer = field, null);
        const Component = formComponentFactory(componentConfiguration.component, {
            key: 1,
            config: componentConfiguration.props,
            errors: testValidationErrors,
            callback: mockCallback
        });
        const wrapper = mount(Component);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Text').length).toEqual(1);
        expect(wrapper.props().error).toEqual('VALIDATION_ERROR');
    });

    it('should pass data using the defaultDataAdapter when no other adapter passed', () => {
        const componentConfiguration = supportedFormComponents
            .filter(field => field.component === 'text')
            .reduce((reducer, field) => reducer = field, null);
        const Component = formComponentFactory(componentConfiguration.component, {
            key: 1,
            config: componentConfiguration.props,
            data: testData,
            callback: mockCallback
        });
        const wrapper = mount(Component);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Text').length).toEqual(1);
        expect(wrapper.props().value).toEqual(testData[componentConfiguration.props.name]);
    });

    it('should pass data using the checkboxDataAdapter when passed in options', () => {
        const componentConfiguration = supportedFormComponents
            .filter(field => field.component === 'checkbox')
            .reduce((reducer, field) => reducer = field, null);
        const Component = formComponentFactory(componentConfiguration.component, {
            key: 1,
            config: componentConfiguration.props,
            data: testData,
            callback: mockCallback
        });
        expect(Component).toBeDefined();
        const wrapper = mount(Component);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Checkbox').length).toEqual(1);
        expect(wrapper.props().value).toEqual(['checkbox-component-A']);
    });

    it('should support components in the supportedSecondaryActions list', () => {
        supportedSecondaryActions.map(({ component, props }) => {
            const Component = secondaryActionFactory(component, {
                key: 1,
                config: props,
                callback: mockCallback
            });
            const wrapper = shallow(Component);
            expect(wrapper).toBeDefined();
        });
    });

    it('should return null if secondary action component is not supported', () => {
        const Component = secondaryActionFactory('SOME_UNSUPPORTED_COMPONENT', {});
        expect(Component).toBeNull();
    });

});