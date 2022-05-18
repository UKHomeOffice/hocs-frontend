import React from 'react';
import ActionSummaryInterests from '../action-summary-interests';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

describe('action-summary-interests.jsx', () => {

    it('should render one with details and one without', () => {

        const props = {
            items: [
                {
                    interestedPartyTitle: 'Interested party 1',
                    detailsOfInterest: 'Details of interest',
                },{
                    interestedPartyTitle: 'Interested party 1',
                },
            ]
        };

        expect(render(
            <>
                <ActionSummaryInterests items={props.items} />
            </>
        )).toMatchSnapshot();
    });
});
