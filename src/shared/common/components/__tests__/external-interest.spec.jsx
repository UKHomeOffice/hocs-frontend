import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import ExternalInterests from '../external-interest';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

describe('Appeals Component', () => {

    it('should Render with table of existing external interests', () => {

        const config = {
            page
        };

        const props = {
            'EXTERNAL_INTEREST': [
                {
                    'id': '81ed796d-819c-46ce-bf50-beca3abe0845',
                    'typeInfo': {
                        'uuid': '81ed796d-819c-46ce-bf50-beca3abe0845',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'EXTERNAL_INTEREST',
                        'actionLabel': 'External Interest',
                        'maxConcurrentEvents': 99999,
                        'sortOrder': 10,
                        'active': true,
                        'props': ''
                    },
                    'typeData': [
                        {
                            'actionType': 'EXTERNAL_INTEREST',
                            'caseTypeActionUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                            'caseTypeActionLabel': 'External Interest',
                            'interestedPartyEntity': {
                                title: 'TEST_PARTY_TYPE'
                            },
                            'interestDetails': 'first test element'
                        },
                        {
                            'actionType': 'EXTERNAL_INTEREST',
                            'caseTypeActionUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                            'caseTypeActionLabel': 'External Interest',
                            'interestedPartyEntity': {
                                title: 'TEST_PARTY_TYPE_2'
                            },
                            'interestDetails': 'second test element'
                        },
                    ]
                }
            ],
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <ExternalInterests props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });

    it('should Render with NO table of external interests', () => {

        const config = {
            page
        };

        const props = {
            'EXTERNAL_INTEREST': [
                {
                    'id': '81ed796d-819c-46ce-bf50-beca3abe0845',
                    'typeInfo': {
                        'uuid': '81ed796d-819c-46ce-bf50-beca3abe0845',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'EXTERNAL_INTEREST',
                        'actionLabel': 'External Interest',
                        'maxConcurrentEvents': 99999,
                        'sortOrder': 10,
                        'active': true,
                        'props': ''
                    },
                    'typeData': [
                    ]
                }
            ],
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <ExternalInterests props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });
});
