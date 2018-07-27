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
];

const testData = {
    'text-component': 'TEST',
    'radio-component': 'A',
    'date-component': '19-01-1989',
    'checkBoxComponentA': true,
    'checkBoxComponentB': false,
    'text-area-component': 'TEST',
    'dropdown-component': 'A'
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

    it('should support components in the supportedFormComponents list', () => {
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

});