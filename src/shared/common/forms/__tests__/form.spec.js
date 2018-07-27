import React from 'react';
import Form from '../form.jsx';
import ActionTypes from '../../../contexts/actions/types';
import {
    ENDPOINT_FAIL,
    ENDPOINT_SUCCEED,
    ENDPOINT_SUCCEED_NO_REDIRECT,
    ENDPOINT_SUCCEED_VALIDATION_ERROR,
    MULTIPART_FORM_HEADER,
    mockRequestClientFailure,
    mockRequestClientSuccess,
    mockRequestClientNoRedirect,
    mockRequestClientValidationError
} from './form.spec.utils';

const mockRequestClient = jest.fn();

jest.mock('axios', () => {
    return {
        post: (url, body, headers) => {
            mockRequestClient(url, body, headers);
            switch (url) {
            case require('./form.spec.utils').ENDPOINT_SUCCEED:
                return require('./form.spec.utils').mockRequestClientSuccess;
            case require('./form.spec.utils').ENDPOINT_SUCCEED_VALIDATION_ERROR:
                return require('./form.spec.utils').mockRequestClientValidationError;
            case require('./form.spec.utils').ENDPOINT_SUCCEED_NO_REDIRECT:
                return require('./form.spec.utils').mockRequestClientNoRedirect;
            case require('./form.spec.utils').ENDPOINT_FAIL:
                return require('./form.spec.utils').mockRequestClientFailure;
            }
        }
    };
});
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

    const mockFormData = {
        field: 'value',
        fieldArray: ['one', 'two', 'three']
    };

    const mockDispatch = jest.fn();
    const mockGetForm = jest.fn();

    beforeEach(() => {
        mockDispatch.mockReset();
        mockGetForm.mockReset();
        mockRequestClient.mockReset();
    });

    it('should render with default props', () => {
        const outer = shallow(<Form getForm={mockGetForm} schema={mockFormSchema} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
    });

    it('should pass form data in to state when data passed in props', () => {
        const outer = shallow(<Form getForm={mockGetForm} schema={mockFormSchema} data={mockFormData} />);
        const Children = outer.props().children;
        const wrapper = mount(shallow(<Children dispatch={mockDispatch} />).get(0));
        expect(wrapper).toBeDefined();
        expect(wrapper.state().field).toBeDefined();
        expect(wrapper.state().fieldArray).toBeDefined();
    });

    it('should render form fields when passed in props', () => {
        const mockFormSchemaWithFields = {
            fields: [
                { component: 'text', props: { name: 'Text Area' } }
            ]
        };
        const outer = shallow(<Form getForm={mockGetForm} schema={mockFormSchemaWithFields} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('#text').length).toEqual(1);
    });

    it('should render secondary actions when passed in props', () => {
        const mockFormSchemaWithSecondaryAction = {
            secondaryActions: [
                { component: 'button', props: { name: 'Click Me' } }
            ]
        };
        const outer = shallow(<Form getForm={mockGetForm} schema={mockFormSchemaWithSecondaryAction} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('#button').length).toEqual(1);
    });

    it('should render with error summary when errors passed in props', () => {
        const errors = {
            field: 'Failed validation'
        };
        const outer = shallow(<Form schema={mockFormSchema} getForm={mockGetForm} errors={errors} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('ErrorSummary').length).toEqual(1);
    });

    it('should handle submit event and dispatch UPDATE_FORM and REDIRECT actions', async () => {
        const outer = shallow(<Form schema={mockFormSchema} action={ENDPOINT_SUCCEED} getForm={mockGetForm} data={mockFormData} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Submit').length).toEqual(1);
        wrapper.find('Submit').simulate('submit');
        await mockRequestClientSuccess;
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient.mock.calls[0][0]).toEqual(ENDPOINT_SUCCEED);
        expect(typeof mockRequestClient.mock.calls[0][1]).toEqual('object');
        expect(mockRequestClient.mock.calls[0][2]).toEqual(MULTIPART_FORM_HEADER);
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.UPDATE_FORM).length).toEqual(1);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.REDIRECT).length).toEqual(1);
    });

    it('should handle submit and dispatch UPDATE_FORM_ERRORS when validation fails', async () => {
        const outer = shallow(<Form schema={mockFormSchema} action={ENDPOINT_SUCCEED_VALIDATION_ERROR} getForm={mockGetForm} data={mockFormData} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Submit').length).toEqual(1);
        wrapper.find('Submit').simulate('submit');
        await mockRequestClientValidationError;
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient.mock.calls[0][0]).toEqual(ENDPOINT_SUCCEED_VALIDATION_ERROR);
        expect(typeof mockRequestClient.mock.calls[0][1]).toEqual('object');
        expect(mockRequestClient.mock.calls[0][2]).toEqual(MULTIPART_FORM_HEADER);
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.UPDATE_FORM_ERRORS).length).toEqual(1);
    });

    it('should handle submit and dispatch UPDATE_FORM when redirect is current path', async () => {
        const outer = shallow(<Form schema={mockFormSchema} action={ENDPOINT_SUCCEED_NO_REDIRECT} getForm={mockGetForm} data={mockFormData} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Submit').length).toEqual(1);
        wrapper.find('Submit').simulate('submit');
        await mockRequestClientNoRedirect;
        expect(mockRequestClient).toHaveBeenCalledTimes(1);
        expect(mockRequestClient.mock.calls[0][0]).toEqual(ENDPOINT_SUCCEED_NO_REDIRECT);
        expect(typeof mockRequestClient.mock.calls[0][1]).toEqual('object');
        expect(mockRequestClient.mock.calls[0][2]).toEqual(MULTIPART_FORM_HEADER);
        expect(mockDispatch).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.UPDATE_FORM).length).toEqual(1);
        expect(mockGetForm).toHaveBeenCalled();
        expect(mockGetForm).toHaveBeenCalledTimes(1);
    });

    it('should handle submit and dispatch an SET_ERROR action when submit fails', async () => {
        const outer = shallow(<Form schema={mockFormSchema} action={ENDPOINT_FAIL} getForm={mockGetForm} data={mockFormData} />);
        const Children = outer.props().children;
        const wrapper = mount(<Children dispatch={mockDispatch} />);
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Submit').length).toEqual(1);
        wrapper.find('Submit').simulate('submit');
        try {
            expect(mockRequestClient).toHaveBeenCalledTimes(1);
            expect(mockRequestClient.mock.calls[0][0]).toEqual(ENDPOINT_FAIL);
            expect(typeof mockRequestClient.mock.calls[0][1]).toEqual('object');
            expect(mockRequestClient.mock.calls[0][2]).toEqual(MULTIPART_FORM_HEADER);
        } catch (e) {
            await mockRequestClientFailure;
            expect(mockDispatch).toHaveBeenCalled();
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch.mock.calls.filter(call => call[0].type === ActionTypes.SET_ERROR).length).toEqual(1);
        }
    });

});