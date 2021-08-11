import React from 'react';
import ConfirmationWithTeamNameAndCaseRef from '../confirmation-with-team-name-and-case-ref.jsx';
import { ApplicationProvider } from '../../../contexts/application.jsx';

describe('Panel component', () => {
    const config = {
        csrf: '__token__'
    };

    const choices = [
        {
            key: '4ef92480-922f-11eb-a8b3-0242ac130003',
            value: 'FOI BICSPI Acceptance Team'
        }
    ];

    const data = {
        AcceptanceTeam: '4ef92480-922f-11eb-a8b3-0242ac130003'
    };

    xit('should render with default props', () => {
        expect(
            render(<ApplicationProvider>
                <ConfirmationWithTeamNameAndCaseRef />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });


    it('should render with title and team name when passed', () => {
        expect(
            render(<ApplicationProvider config={config} data={data}>
                <ConfirmationWithTeamNameAndCaseRef data={data} choices={choices} label="completed" caseRef={'test-case-ref'} />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

});
