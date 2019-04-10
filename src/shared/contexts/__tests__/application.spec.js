import { ApplicationProvider, ApplicationConsumer } from '../application.jsx';
import React from 'react';
import ActionTypes from '../actions/types';

describe('Application Provider', () => {

    it('should take configuration and add to component state', () => {
        const testConfig = {
            A: 'A',
            B: 'B'
        };
        const wrapper = shallow(<ApplicationProvider config={testConfig} />);
        expect(wrapper.state().A).toEqual('A');
        expect(wrapper.state().B).toEqual('B');
    });

    it('should provide a dispatch method', () => {
        const wrapper = shallow(<ApplicationProvider config={null} />);
        expect(wrapper.state().dispatch).toBeDefined();
        expect(typeof wrapper.state().dispatch).toEqual('function');
    });

});

describe('Application Consumer', () => {

    it('should export the consumer component', () => {
        expect(ApplicationConsumer).toBeDefined();
        expect(typeof ApplicationConsumer).toEqual('object');
    });

});

describe('Application context', () => {

    it('should default when passed an unsupported action', () => {
        const action = { type: 'SOME_UNSUPPORTED_ACTION' };
        const defaultState = {};
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
    });

    it('should handle the UPDATE_FORM action', () => {
        const action = { type: ActionTypes.UPDATE_FORM, payload: 'NEW_FORM' };
        const defaultState = { form: 'OLD_FORM' };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().form).toBeDefined();
        expect(wrapper.state().form).toEqual(action.payload);
    });

    it('should handle the UPDATE_FORM_DATA action', () => {
        const action = {
            type: ActionTypes.UPDATE_FORM_DATA,
            payload: {
                fieldToBeUpdated: 'NEW_FIELD_VALUE'
            }
        };
        const defaultState = {
            form: {
                data: {
                    fieldToBeUpdated: 'OLD_FIELD_VALUE',
                    fieldToRemainUnchanged: 'UNCHANGED'
                }
            }
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().form).toBeDefined();
        const formData = wrapper.state().form.data;
        expect(formData.fieldToBeUpdated).toEqual(action.payload.fieldToBeUpdated);
        expect(formData.fieldToRemainUnchanged).toEqual('UNCHANGED');
    });

    it('should handle the UPDATE_FORM_ERRORS action', () => {
        const action = {
            type: ActionTypes.UPDATE_FORM_ERRORS,
            payload: {
                second: 'VALIDATION_ERROR'
            }
        };
        const defaultState = {
            form: {
                errors: {
                    first: 'VALIDATION_ERROR',
                }
            }
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().form).toBeDefined();
        const formErrors = wrapper.state().form.errors;
        expect(formErrors.first).toBeUndefined();
        expect(formErrors.second).toEqual('VALIDATION_ERROR');
    });

    it('should handle the UPDATE_LOCATION action', () => {
        const action = {
            type: ActionTypes.UPDATE_LOCATION,
            payload: 'LOCATION_B'
        };
        const defaultState = {
            location: 'LOCATION_A'
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().location).toBeDefined();
        expect(wrapper.state().location).toEqual('LOCATION_B');
    });

    it('should handle the CANCEL action', () => {
        const action = {
            type: ActionTypes.CANCEL
        };
        const defaultState = {
            redirect: null,
            form: {}
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().redirect).toBeDefined();
        expect(wrapper.state().redirect).toEqual('/');
        expect(wrapper.state().form).toBeNull();
    });

    it('should handle the REDIRECT action', () => {
        const action = {
            type: ActionTypes.REDIRECT,
            payload: '/TEST/URL'
        };
        const defaultState = {
            redirect: null,
            form: {}
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().redirect).toBeDefined();
        expect(wrapper.state().redirect).toEqual('/TEST/URL');
        expect(wrapper.state().form).toBeNull();
    });

    it('should handle the REDIRECTED action', () => {
        const action = {
            type: ActionTypes.REDIRECTED
        };
        const defaultState = {
            redirect: '/TEST/URL'
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().redirect).toBeNull();
    });

    it('should handle the SET_ERROR action', () => {
        const action = {
            type: ActionTypes.SET_ERROR,
            payload: 'ERROR'
        };
        const defaultState = {
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().error).toBeDefined();
        expect(wrapper.state().error).toEqual('ERROR');
    });

    it('should handle the UNSET_ERROR action', () => {
        const action = {
            type: ActionTypes.UNSET_ERROR
        };
        const defaultState = {
            payload: 'ERROR'
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().error).toBeNull();
    });

    it('should handle the UNSET_FORM action', () => {
        const action = {
            type: ActionTypes.UNSET_FORM
        };
        const defaultState = {
            form: null
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().form).toBeNull();
    });

    it('should handle the UPDATE_API_STATUS action', () => {
        const action = {
            type: ActionTypes.UPDATE_API_STATUS,
            payload: 'TEST_STATUS'
        };
        const defaultState = {
            apiStatus: null
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().apiStatus).toEqual('TEST_STATUS');
    });

    it('should handle the CLEAR_API_STATUS action', () => {
        const action = {
            type: ActionTypes.CLEAR_API_STATUS
        };
        const defaultState = {
            apiStatus: 'TEST_STATUS'
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().apiStatus).toBeNull();
    });

    it('should handle the UPDATE_PAGE_META action', () => {
        const pageMeta = {
            TEST_KEY: 'TEST_VALUE'
        };
        const action = {
            type: ActionTypes.UPDATE_PAGE_META,
            payload: pageMeta
        };
        const defaultState = {
            page: {}
        };
        const wrapper = shallow(<ApplicationProvider config={defaultState} />);
        wrapper.state().dispatch(action);
        expect(wrapper.state().page.TEST_KEY).toEqual('TEST_VALUE');
    });

});