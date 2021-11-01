import { ApplicationProvider } from '../../../contexts/application';
import { MemoryRouter } from 'react-router-dom';
import Extensions from '../extensions';
import React from 'react';


const page = {
    params: {
        caseId: 'some_case_id',
        stageId: 'some_stage_id',
    }
};

describe('Extensions Component', function () {

    it('Should show case deadline WITHOUT extend link', () => {

        const config = {
            page
        };

        const props = {
            'APPEAL': [
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

        expect(render(
            <ApplicationProvider config={config}>
                <MemoryRouter>
                    <Extensions props={props}/>
                </MemoryRouter>
            </ApplicationProvider>
        )).toMatchSnapshot();
    });

    it('Should show case deadline WITH extend link', () => {

        const config = {
            page
        };

        const props = {
            'APPEAL': [
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

        expect(render(
            <ApplicationProvider config={config}>
                <MemoryRouter>
                    <Extensions props={props}/>
                </MemoryRouter>
            </ApplicationProvider>
        )).toMatchSnapshot();
    });
});