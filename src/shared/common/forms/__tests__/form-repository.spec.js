import { formComponentFactory, secondaryActionFactory } from '../form-repository';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const mockCallback = jest.fn();

const mockChoices = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
];

const supportedFormComponents = [
    { component: 'text', props: { name: 'text-component' } },
    { component: 'mapped-text', props: { name: 'mapped-text-component', choices: mockChoices } },
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
    { component: 'confirmation-with-case-ref', props: { name: 'confirmation-with-case-ref' } },
    { component: 'hidden', props: { name: 'hidden', defaultValue: 'TEST_VALUE', populateFromCaseData: false } },
    { component: 'hidden', props: { name: 'hidden' } },
    { component: 'expandable-checkbox', props: { choice: { label: '__label__', value: '__value__' }, name: 'expandable' } },
    { component: 'review-field', props: { child: { props: { name: 'Test', label: 'Test Label' } }, name: 'TEST' } }
];

const supportedSecondaryActions = [
    { component: 'backlink', props: { action: '/', dispatch: jest.fn() } },
    { component: 'button', props: { action: '/', dispatch: jest.fn() } },
    { component: 'backButton', props: { action: '/', dispatch: jest.fn() } },
];

const testData = {
    'text-component': 'TEST',
    'checkbox-component-A': true,
    'checkbox-component-B': false,
    'hidden': 'TEST'
};

const testDataReviewField = {
    'Test': 'Test Value'
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

    it('should support components in the supportedFormComponents list', () => {
        supportedFormComponents.map(({ component, props }) => {
            const Component = formComponentFactory(component, {
                key: 1,
                config: props,
                callback: mockCallback
            });
            expect(Component).not.toBeNull();
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
        render(Component);
        expect(screen.getByText('VALIDATION_ERROR')).toBeInTheDocument();
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
        render(Component);
        expect(screen.getByRole('textbox')).toHaveValue('TEST');
    });

    it('should support components in the supportedSecondaryActions list', () => {
        supportedSecondaryActions.map(({ component, props }) => {
            const Component = secondaryActionFactory(component, {
                key: 1,
                config: props,
                callback: mockCallback,
                page: {
                    caseId: 'caseId1234',
                    stageId: 'stageId1234'
                }
            });
            expect(Component).not.toBeNull();
        });
    });

    it('should return null if secondary action component is not supported', () => {
        const Component = secondaryActionFactory('SOME_UNSUPPORTED_COMPONENT', {});
        expect(Component).toBeNull();
    });

    it('should pass "review-field" case whereby config object HAS child.props', () => {
        const componentConfiguration = supportedFormComponents
            .filter(field => field.component === 'review-field')
            .reduce((reducer, field) => reducer = field, null);
        const Component = formComponentFactory(componentConfiguration.component, {
            key: 1,
            config: componentConfiguration.props,
            data: testDataReviewField,
            name: 'TEST'
        });

        render(Component);
        expect(screen.getAllByText('Test Label')[0]).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
    });
});
