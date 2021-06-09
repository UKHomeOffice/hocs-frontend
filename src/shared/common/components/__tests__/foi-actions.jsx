import React from 'react';
import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import FoiActions from '../foi-actions';


const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};


describe('The FoiActions component', () => {
    it('should show the extend option when no extension applied', () => {
        const summary = {
            case: {
                deadline: '05/07/2021',
                deadLineExtensions: []
            }
        };

        const config = {
            page,
            summary
        };
        expect(
            render(<ApplicationProvider config={config}>
                <MemoryRouter>
                    <FoiActions />
                </MemoryRouter>
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should hide the extend option when FOI_PIT extension applied', () => {
        const summary = {
            case: {
                deadline: '05/07/2021',
                deadLineExtensions: { 'FOI_PIT':20 }
            }
        };

        const config = {
            page,
            summary
        };
        expect(
            render(<ApplicationProvider config={config}>
                <MemoryRouter>
                    <FoiActions />
                </MemoryRouter>
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });
});
