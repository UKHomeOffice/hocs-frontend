import React from 'react';
import ActionSummaryInterests from '../summary/actions/action-summary-interests';

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
                <ActionSummaryInterests props={props} />
            </>
        )).toMatchSnapshot();
    });
});