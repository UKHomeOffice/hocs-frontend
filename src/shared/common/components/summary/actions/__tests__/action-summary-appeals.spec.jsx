import React from 'react';
import ActionSummaryAppeals from '../action-summary-appeals';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('action-summary-appeals.jsx', () => {

    it('should render one completed and one pending appeal', () => {

        const props = {
            items: [
                {
                    title: 'Appeal Type A',
                    outcome: null,
                    officerDirectorate: 'Directorate 2',
                    officer: 'Officer\'s Name',
                    status: 'No',
                    complexCase: null,
                    note: null,
                    dateSentRMS: null
                },{
                    title: 'Appeal Type B',
                    outcome: 'Decision upheld in part',
                    officerDirectorate: 'Directorate 2',
                    officer: 'Officer\'s Name',
                    status: 'Yes',
                    complexCase: 'Yes',
                    note: 'Some note detailing things',
                    dateSentRMS: '09/11/2021'
                },
            ]
        };

        expect(render(
            <>
                <ActionSummaryAppeals items={props.items} />
            </>
        )).toMatchSnapshot();
    });
});
