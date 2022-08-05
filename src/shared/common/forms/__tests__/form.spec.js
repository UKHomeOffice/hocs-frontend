import React from 'react';
import Form from '../form.jsx';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

/* eslint-disable react/display-name*/
jest.mock('../form-repository.jsx', () => {
    return {
        formComponentFactory: (field, { key }) => {
            return(
                <div id={field} key={key} />
            );
        },
        secondaryActionFactory: (field, { key, config }) => {
            return (
                <div id={field} key={key}>{config.value}</div>
            );
        }
    };
});
/* eslint-enable react/display-name*/

describe('Form component', () => {

    const mockFormSchema = {
        fields: []
    };

    const mockProps = {
        page: {
            caseId: 'CASE_ID',
            stageId: 'STAGE_ID'
        },
        baseUrl: 'gov.uk'
    };

    const mockSubmitHandler = jest.fn();

    beforeEach(() => {
        mockSubmitHandler.mockReset();
    });

    test('should render with default props', () => {
        const wrapper = render(<Form schema={mockFormSchema}/>);
        expect(wrapper).toBeDefined();
    });

    test('should render secondary actions when passed in props', () => {
        const mockFormSchemaWithSecondaryAction = {
            secondaryActions: [
                { component: 'button', props: { value: 'Click Me' } }
            ]
        };
        const wrapper = render(<Form {...mockProps} schema={mockFormSchemaWithSecondaryAction} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    test('should render with error summary when errors passed in props', () => {
        const errors = {
            field: 'Failed validation'
        };
        const wrapper = render(<Form {...mockProps} schema={mockFormSchema} errors={errors} />);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Failed validation')).toBeInTheDocument();
    });

    test('should handle submit using provided callback method', async () => {
        const wrapper = render(<Form {...mockProps} schema={mockFormSchema} submitHandler={mockSubmitHandler}/>);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Submit')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Submit'));
        expect(mockSubmitHandler).toHaveBeenCalled();
        expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    });

    test('should render form as collapsable when passed in props', async () => {
        const mockFormSchemaWithCollapsableProp = {
            props: {
                collapsable: {
                    hintText: 'Test Expand'
                }
            }
        };

        const wrapper = render(<Form {...mockProps} schema={mockFormSchemaWithCollapsableProp}/>);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Test Expand')).toBeInTheDocument();
    });

    test('should render form as collapsable with default text when hintText not provided', async () => {
        const mockFormSchemaWithCollapsableProp = {
            props: {
                collapsable: {}
            }
        };

        const wrapper = render(<Form {...mockProps} schema={mockFormSchemaWithCollapsableProp}/>);
        expect(wrapper).toBeDefined();
        expect(screen.getByText('Expand')).toBeInTheDocument();
    });

});
