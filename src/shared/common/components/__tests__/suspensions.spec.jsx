import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Suspensions from '../suspensions';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';


const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

describe('Suspensions Component', () => {

    const config = {
        page
    };

    it('should render component with link to submit suspension', () => {

        const props = {
            'SUSPENSION': [
                {
                    'id': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                    'typeInfo': {
                        'uuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                        'caseTypeUuid': '95a8c850-571c-447f-a581-8cd0e82b2398',
                        'caseType': 'SMC',
                        'actionType': 'SUSPENSION',
                        'actionSubtype': 'SUSPENSION',
                        'actionLabel': 'Case Suspensions',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': []
                }
            ],
            'currentDeadline': '19/04/2022',
            'remainingDays': 20
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <Suspensions props={props} page={page} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });


    it('should render component with link to submit suspension and historic suspension', () => {

        const props = {
            'SUSPENSION': [
                {
                    'id': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                    'typeInfo': {
                        'uuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                        'caseTypeUuid': '95a8c850-571c-447f-a581-8cd0e82b2398',
                        'caseType': 'SMC',
                        'actionType': 'SUSPENSION',
                        'actionSubtype': 'SUSPENSION',
                        'actionLabel': 'Case Suspensions',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': [
                        {
                            'actionType': 'SUSPEND',
                            'dateSuspensionApplied': '2022-04-02',
                            'dateSuspensionRemoved': '2022-04-10',
                            'uuid': 'b4f686e9-d052-4e0d-8c1b-ab024791e01f',
                            'caseTypeActionUuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                            'caseSubtype': 'SUSPENSION',
                            'caseTypeActionLabel': 'Case Suspension'
                        }
                    ]
                }
            ],
            'currentDeadline': '31/12/9999',
            'remainingDays': 20
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <Suspensions props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });

    it('should render component with link to remove suspension but not add a new one.', () => {

        const props = {
            'SUSPENSION': [
                {
                    'id': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                    'typeInfo': {
                        'uuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                        'caseTypeUuid': '95a8c850-571c-447f-a581-8cd0e82b2398',
                        'caseType': 'SMC',
                        'actionType': 'SUSPENSION',
                        'actionSubtype': 'SUSPENSION',
                        'actionLabel': 'Case Suspensions',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': [
                        {
                            'actionType': 'SUSPEND',
                            'dateSuspensionApplied': '2022-04-02',
                            'dateSuspensionRemoved': '',
                            'uuid': 'b4f686e9-d052-4e0d-8c1b-ab024791e01f',
                            'caseTypeActionUuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                            'caseSubtype': 'SUSPENSION',
                            'caseTypeActionLabel': 'Case Suspension'
                        }
                    ]
                }
            ],
            'currentDeadline': '31/12/9999',
            'remainingDays': 999999
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <Suspensions props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });


    it('should render component with link to remove suspension but not add a new one. And show historic', () => {

        const props = {
            'SUSPENSION': [
                {
                    'id': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                    'typeInfo': {
                        'uuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                        'caseTypeUuid': '95a8c850-571c-447f-a581-8cd0e82b2398',
                        'caseType': 'SMC',
                        'actionType': 'SUSPENSION',
                        'actionSubtype': 'SUSPENSION',
                        'actionLabel': 'Case Suspensions',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': [
                        {
                            'actionType': 'SUSPEND',
                            'dateSuspensionApplied': '2022-04-02',
                            'dateSuspensionRemoved': '',
                            'uuid': 'b4f686e9-d052-4e0d-8c1b-ab024791e01f',
                            'caseTypeActionUuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                            'caseSubtype': 'SUSPENSION',
                            'caseTypeActionLabel': 'Case Suspension'
                        },{
                            'actionType': 'SUSPEND',
                            'dateSuspensionApplied': '2022-04-19',
                            'dateSuspensionRemoved': '2022-04-19',
                            'uuid': 'aa868eab-ce49-4957-8a58-07fe1bc7d3be',
                            'caseTypeActionUuid': '3a50fa6d-0221-40b6-ae53-1cbac4896221',
                            'caseSubtype': 'SUSPENSION',
                            'caseTypeActionLabel': 'Case Suspensions'
                        }
                    ]
                }
            ],
            'currentDeadline': '31/12/9999',
            'remainingDays': 999999
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <Suspensions props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });

});


