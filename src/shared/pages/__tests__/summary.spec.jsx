import React from 'react';
import Summary from '../summary.jsx';
import { MemoryRouter } from 'react-router-dom';

const mockCaseData = {
    uuid: 'CASE_UUID',
    type: 'CASE_TYPE',
    reference: 'CASE_REF',
    timestamp: 'CASE_TIMESTAMP',
    stages: [
        {
            type: 'STAGE_TYPE',
            data: {
                field: 'VALUE'
            }
        }
    ],
    documents: [
        {
            type: 'DOCUMENT_TYPE',
            name: 'DOCUMENT_NAME',
            status: 'DOCUMENT_STATUS',
            document_uuid: 'DOCUMENT_UUID',
            timestamp: 'DOCUMENT_TIMESTAMP'
        }
    ]
};

jest.mock('../../common/forms/form.jsx', () => 'MOCK_FORM');
jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
        case '/case/summary/api':
            return Promise.resolve({
                data: { summary: { mockCaseData } }
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

describe('Summary page component', () => {

    const mockDispatch = jest.fn();
    let mockMatch = {};

    beforeEach(() => {
        mockDispatch.mockReset();
        mockMatch = {
            url: '/case/summary'
        };
    });

    it('should render with default props', () => {
        const outer = shallow(<Summary match={mockMatch} />);
        const Children = outer.props().children;
        const wrapper = mount(
            <MemoryRouter>
                <Children dispatch={mockDispatch} />
            </MemoryRouter>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper.find('Summary')).toMatchSnapshot();
        expect(axios.get).toHaveBeenCalled();
    });

    it('should disatch UPDATE_LOCATION and UPDATE_FORM on mount', async () => {
        mockMatch.url = '/valid';
        const outer = shallow(<Summary match={mockMatch} />);
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
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch.mock.calls[0][0].type).toEqual('UPDATE_LOCATION');
    });

    it('should disatch UPDATE_LOCATION and SET_ERROR if getForm fails', async () => {
        mockMatch.url = '/invalid';
        const outer = shallow(<Summary match={mockMatch} />);
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