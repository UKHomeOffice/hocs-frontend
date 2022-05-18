import React from 'react';
import Summary from '../stage-summary.jsx';
import { ApplicationProvider } from '../../../contexts/application';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const config = {
    summary: {
        case: {
            created: '__created__',
            deadline: '__deadline__',
            received: '__received__'
        },
        primaryCorrespondent: {
            address: {
                address1: '__address1__',
                address2: '__address2__',
                address3: '__address3__',
                country: '__country__',
                postcode: '__postcode__',
            },
            fullname: '__fullname__',
            organisation: '__organisation__',
            telephone: '__telephone__',
            reference: '__reference__'
        },
        primaryTopic: '__primaryTopic__',
        additionalFields: [
            { label: '__label__', value: '__value__' },
            { label: '__label__', value: '__value__' }
        ],
        deadlinesEnabled: true,
        deadlines: [
            { label: '__label__', value: '__value__' },
            { label: '__label__', value: '__value__' }
        ],
        stages: [{
            assignedTeam: '__assignedTeam__',
            assignedUser: '__assignedUser__',
            stage: '__stage1__'
        }, {
            assignedTeam: '__assignedTeam__',
            assignedUser: '__assignedUser__',
            stage: '__stage2__'
        }],
        previousCase: {
            uuid: '__previousCaseUuid__',
            reference: '__previousCaseReference__',
            stageUuid: '__previousCaseStage__'
        }
    },
    page:{
        params: {
            caseId: 'some_case_id',
            stageId: 'some_stage_id',
        }
    }
};

describe('Stage summary component', () => {

    it('should render when summary provided in context', () => {
        const wrapper = render(
            <ApplicationProvider config={config}>
                <BrowserRouter>
                    <Summary/>
                </BrowserRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should not show the previous case table when not provided', () => {
        const myConfig = deepCopy(config);
        myConfig.summary.previousCase = undefined;

        const wrapper = render(
            <ApplicationProvider config={myConfig}>
                <BrowserRouter>
                    <Summary/>
                </BrowserRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();

        config.summary.previousCase = {
            uuid: '__previousCaseUuid__',
            reference: '__previousCaseReference__',
            stageUuid: '__previousCaseStage__'
        };
    });

    it('should not show the empty address lines', () => {
        const myConfig = deepCopy(config);
        myConfig.summary.primaryCorrespondent.address.address2 = undefined;
        myConfig.summary.primaryCorrespondent.address.address3 = undefined;

        const wrapper = render(
            <ApplicationProvider config={myConfig}>
                <BrowserRouter>
                    <Summary/>
                </BrowserRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should not show the empty organisation', () => {
        const myConfig = deepCopy(config);
        myConfig.summary.primaryCorrespondent.organisation = undefined;

        const wrapper = render(
            <ApplicationProvider config={myConfig}>
                <BrowserRouter>
                    <Summary/>
                </BrowserRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should not render the "Active Stage" title, when there are no active stages', () => {
        const myConfig = deepCopy(config);
        myConfig.summary.stages = [];
        const wrapper = render(
            <ApplicationProvider config={myConfig}>
                <BrowserRouter>
                    <Summary/>
                </BrowserRouter>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}
