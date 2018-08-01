import React from 'react';
import Action from '../action.jsx';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../common/forms/form.jsx', () => 'MOCK_FORM');
jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
        case '/forms/valid':
            return Promise.resolve({
                data: {}
            });
        default:
            return Promise.reject({
                response: {
                    data: {}
                }
            });
        }
    })
}));

import axios from 'axios';

describe('Action page component', () => {

    const mockDispatch = jest.fn();
    let mockMatch = {};
    const mockForm = {
        schema: {
            title: 'MY_FORM'
        }
    };

    beforeEach(() => {
        mockDispatch.mockReset();
        mockMatch = {
            url: '/'
        };
    });

    it('should render with default props', () => {
        const outer = shallow(<Action match={mockMatch} />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Action')).toMatchSnapshot();
        expect(axios.get).toHaveBeenCalled();
    });

    it('should render with caption when passed in props', () => {
        const outer = shallow(<Action match={mockMatch} caption='MY_CAPTION' />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(axios.get).toHaveBeenCalled();
        expect(wrapper.find('Action')).toMatchSnapshot();
    });

    it('should render with form when passed in props', () => {
        const outer = shallow(<Action match={mockMatch} />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} form={mockForm} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(axios.get).toHaveBeenCalled();
    });

    it('should disatch UPDATE_LOCATION and UPDATE_FORM on mount', async () => {
        mockMatch.url = '/valid';
        const outer = shallow(<Action match={mockMatch} />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(axios.get).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalled();
        await mockDispatch;
        await mockDispatch;
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch.mock.calls[0][0].type).toEqual('UPDATE_LOCATION');
        expect(mockDispatch.mock.calls[1][0].type).toEqual('UPDATE_FORM');
    });

    it('should disatch UPDATE_LOCATION and SET_ERROR if getForm fails', async () => {
        mockMatch.url = '/invalid';
        const outer = shallow(<Action match={mockMatch} />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(axios.get).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalled();
        await mockDispatch;
        await mockDispatch;
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch.mock.calls[0][0].type).toEqual('UPDATE_LOCATION');
        expect(mockDispatch.mock.calls[1][0].type).toEqual('SET_ERROR');
    });

});