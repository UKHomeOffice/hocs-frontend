import React from 'react';
import Form from '../form.jsx';

/* eslint-disable react/display-name*/
jest.mock('../form-repository.jsx', () => {
    return {
        formComponentFactory: (field, { key }) => {
            return(
                <div id={field} key={key} />
            );
        },
        secondaryActionFactory: (field, { key }) => {
            return (
                <div id={field} key={key} />
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
        }
    };

    const mockSubmitHandler = jest.fn();

    beforeEach(() => {
        mockSubmitHandler.mockReset();
    });

    it('should render with default props', () => {
        const wrapper = mount(<Form schema={mockFormSchema}/>);
        expect(wrapper).toBeDefined();
    });

    it('should render form fields when passed in props', () => {
        const mockFormSchemaWithFields = {
            fields: [
                { component: 'text', props: { name: 'Text Area' } }
            ]
        };
        const wrapper = shallow(<Form {...mockProps} schema={mockFormSchemaWithFields} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('#text').length).toEqual(1);
    });

    it('should render secondary actions when passed in props', () => {
        const mockFormSchemaWithSecondaryAction = {
            secondaryActions: [
                { component: 'button', props: { name: 'Click Me' } }
            ]
        };
        const wrapper = shallow(<Form {...mockProps} schema={mockFormSchemaWithSecondaryAction} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('#button').length).toEqual(1);
    });

    it('should render with error summary when errors passed in props', () => {
        const errors = {
            field: 'Failed validation'
        };
        const wrapper = shallow(<Form {...mockProps} schema={mockFormSchema} errors={errors} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('ErrorSummary').length).toEqual(1);
    });

    it('should handle submit using provided callback method', async () => {
        const wrapper = mount(<Form {...mockProps} schema={mockFormSchema} submitHandler={mockSubmitHandler}/>);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Submit').length).toEqual(1);
        wrapper.find('Submit').simulate('submit');
        expect(mockSubmitHandler).toHaveBeenCalled();
        expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    });

});