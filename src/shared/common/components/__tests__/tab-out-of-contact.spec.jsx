import React from 'react';
import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import TabOutOfContact from '../tab-out-of-contact';
import axios from 'axios';
import { Context } from '../../../contexts/application';

jest.mock('axios', () => ({
    get: jest.fn((url) => {
        switch (url) {
            case '/api/form/TAB_OUT_OF_CONTACT/case/__caseId__':
                return Promise.resolve({ data: {
                    schema: {
                        title: 'title'
                    },
                    data: {}
                } });
        }
    })
}));


describe('Out of contact', async () => {
    const customRender = (Component) => {
        const providerProps = {
            dispatch: () => { return Promise.resolve(); },
            page: {
                params: {
                    caseId: '__caseId__',
                    stageId: '__stageId__'
                }
            }
        };

        return render(
            <Context.Provider value={ { ...providerProps } }>{Component}</Context.Provider>,
        );
    };

    it('can be rendered', async () => {
        let wrapper;
        await act(async () => {
            wrapper = customRender(<TabOutOfContact screen={'TAB_OUT_OF_CONTACT'} history={{}} />);
        });

        expect(axios.get).toHaveBeenCalled();
        expect(wrapper.getByText('title')).toBeInTheDocument();
    });
});
