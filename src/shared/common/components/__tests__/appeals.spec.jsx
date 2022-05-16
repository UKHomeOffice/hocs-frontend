import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Appeals from '../appeals';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

describe('Appeals Component', () => {

    it('should Render with table of existing appeals', () => {

        const config = {
            page
        };

        const props = {
            'APPEAL': [
                {
                    'id': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                    'typeInfo': {
                        'uuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'Court of Appeal',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 50,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': [
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-12',
                            'outcome': 'ComplaintUpheld',
                            'complexCase': 'Yes',
                            'note': 'sdcasdc',
                            'appealOfficerData': null,
                            'uuid': 'e2e033ef-a819-4ea8-b793-aa1b9eadf3e2',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-12',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdcasd',
                            'appealOfficerData': null,
                            'uuid': '50792f80-3f74-4eab-be86-a96e0e0749da',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-12',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'sdcasdc',
                            'appealOfficerData': null,
                            'uuid': '5fcad74b-3577-49eb-893d-5923c771c2f4',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        },
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-26',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdcasdc',
                            'appealOfficerData': null,
                            'uuid': '08d3bdb9-44bc-4b76-b4b6-52e10876a81d',
                            'caseTypeActionUuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                            'caseTypeActionLabel': 'Court of Appeal'
                        }
                    ]
                },
                {
                    'id': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                    'typeInfo': {
                        'uuid': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'First Tier Tribunal',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 30,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': [
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-26',
                            'outcome': 'DecisionUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdfasdf',
                            'appealOfficerData': null,
                            'uuid': 'f5868426-fdaa-4148-89ba-aa93c6989919',
                            'caseTypeActionUuid': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                            'caseTypeActionLabel': 'First Tier Tribunal'
                        }
                    ]
                },
                {
                    'id': '268277ef-6b44-4cb3-a0f9-1a717322685b',
                    'typeInfo': {
                        'uuid': '268277ef-6b44-4cb3-a0f9-1a717322685b',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'ICO Review',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 20,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': []
                },
                {
                    'id': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                    'typeInfo': {
                        'uuid': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'Internal Review',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{"appealOfficerData": {"officer": {"label": "Internal review officer name", "value": "IROfficerName", "choices": "S_FOI_KIMU_TEAM_MEMBERS"}, "directorate": {"label": "Internal review officer directorate", "value": "IROfficerDirectorate", "choices": "S_FOI_DIRECTORATES"}}}'
                    },
                    'typeData': [
                        {
                            'actionType': 'APPEAL',
                            'status': 'Complete',
                            'dateSentRMS': '2021-10-26',
                            'outcome': 'ComplaintUpheld',
                            'complexCase': 'Yes',
                            'note': 'asdcasdc',
                            'appealOfficerData': '{"IROfficerName": "638b31bc-6004-4f51-8394-45c3141e1f8a", "IROfficerDirectorate": "FOI_DIRECTORATE_HMPO_ACCEPTANCE_TEAMS"}',
                            'uuid': '72fd3cf4-f15a-4c20-90d4-90d1a663e2f5',
                            'caseTypeActionUuid': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                            'caseTypeActionLabel': 'Internal Review'
                        }
                    ]
                },
                {
                    'id': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
                    'typeInfo': {
                        'uuid': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'Upper Tribunal',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 40,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': [
                        {
                            'actionType': 'APPEAL',
                            'status': 'Pending',
                            'dateSentRMS': null,
                            'outcome': null,
                            'complexCase': null,
                            'note': null,
                            'appealOfficerData': null,
                            'uuid': 'c328ca43-1bc8-40d8-a52e-e15684ad83f3',
                            'caseTypeActionUuid': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
                            'caseTypeActionLabel': 'Upper Tribunal'
                        }
                    ]
                }
            ],
            'EXTENSION': [
                {
                    'id': 'dd84d047-853b-428a-9ed7-94601623f344',
                    'typeInfo': {
                        'uuid': 'dd84d047-853b-428a-9ed7-94601623f344',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'EXTENSION',
                        'actionLabel': 'PIT Extension',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{"extendFrom": "TODAY", "extendByMaximumDays": 20}'
                    },
                    'typeData': [
                        {
                            'actionType': 'EXTENSION_OUT',
                            'originalDeadline': '2021-11-24',
                            'updatedDeadline': '2021-11-24',
                            'note': 'Whatever you want to write here',
                            'uuid': '8ffa52b9-1e31-4412-ac50-ce086cec1b51',
                            'caseTypeActionUuid': 'dd84d047-853b-428a-9ed7-94601623f344',
                            'caseTypeActionLabel': 'PIT Extension'
                        }
                    ]
                }
            ],
            'currentDeadline': '24/11/2021'
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <Appeals props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });

    it('should Render with NO table of existing appeals', () => {

        const config = {
            page
        };

        const props = {
            'APPEAL': [
                {
                    'id': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                    'typeInfo': {
                        'uuid': 'f84262c4-3b9e-4d1c-83c4-2ceacce5851d',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'Court of Appeal',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 50,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': []
                },
                {
                    'id': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                    'typeInfo': {
                        'uuid': 'e8313044-d0b1-4510-96e4-17af7fdaf754',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'First Tier Tribunal',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 30,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': []
                },
                {
                    'id': '268277ef-6b44-4cb3-a0f9-1a717322685b',
                    'typeInfo': {
                        'uuid': '268277ef-6b44-4cb3-a0f9-1a717322685b',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'ICO Review',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 20,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': []
                },
                {
                    'id': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                    'typeInfo': {
                        'uuid': 'f2b625c9-7250-4293-9e68-c8f515e3043d',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'Internal Review',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{"appealOfficerData": {"officer": {"label": "Internal review officer name", "value": "IROfficerName", "choices": "S_FOI_KIMU_TEAM_MEMBERS"}, "directorate": {"label": "Internal review officer directorate", "value": "IROfficerDirectorate", "choices": "S_FOI_DIRECTORATES"}}}'
                    },
                    'typeData': []
                },
                {
                    'id': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
                    'typeInfo': {
                        'uuid': 'a3c5091c-bd19-4c13-824e-1a38ce3f275d',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'APPEAL',
                        'actionLabel': 'Upper Tribunal',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 40,
                        'active': true,
                        'props': '{}'
                    },
                    'typeData': []
                }
            ],
            'EXTENSION': [
                {
                    'id': 'dd84d047-853b-428a-9ed7-94601623f344',
                    'typeInfo': {
                        'uuid': 'dd84d047-853b-428a-9ed7-94601623f344',
                        'caseTypeUuid': '406a142c-c519-4fd3-9723-e61b6e3e395d',
                        'caseType': 'FOI',
                        'actionType': 'EXTENSION',
                        'actionLabel': 'PIT Extension',
                        'maxConcurrentEvents': 1,
                        'sortOrder': 10,
                        'active': true,
                        'props': '{"extendFrom": "TODAY", "extendByMaximumDays": 20}'
                    },
                    'typeData': []
                }
            ],
            'currentDeadline': '24/11/2021'
        };

        expect(
            render(
                <ApplicationProvider config={config}>
                    <MemoryRouter>
                        <Appeals props={props} />
                    </MemoryRouter>
                </ApplicationProvider>
            )
        ).toMatchSnapshot();
    });
});
