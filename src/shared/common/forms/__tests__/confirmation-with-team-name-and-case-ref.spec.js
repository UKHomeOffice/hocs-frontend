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
        },
        {
            key: 'abc92480-922f-11eb-a8b3-0242ac130003',
            value: 'Another Team'
        }
    ];
    const hasHeader = true;
    const defaultData = {};
    const name = 'variableName';
    const data = {
        variableName: '4ef92480-922f-11eb-a8b3-0242ac130003'
    };

    it('should render with default props', () => {
        expect(
            render(<ApplicationProvider config={config}>
                <ConfirmationWithTeamNameAndCaseRef data={defaultData}/>
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });


    it('should render with title and team name when passed', () => {
        expect(
            render(<ApplicationProvider config={config} >
                <ConfirmationWithTeamNameAndCaseRef data={data} choices={choices} name={name} label="completed" caseRef={'test-case-ref'} />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

    it('should render with title, team name and header box when passed', () => {
        expect(
            render(<ApplicationProvider config={config} >
                <ConfirmationWithTeamNameAndCaseRef data={data} choices={choices} name={name} label="completed" caseRef={'test-case-ref'} hasHeader={hasHeader} />
            </ApplicationProvider>)
        ).toMatchSnapshot();
    });

});
