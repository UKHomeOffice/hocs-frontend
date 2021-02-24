import React from 'react';
import Summary from '../stage-summary.jsx';
import { ApplicationProvider } from '../../../contexts/application';

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
            fullname: '__fullname__'
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
        }]
    }
};

describe('Stage summary component', () => {

    it('should render when summary provided in context', () => {

        const wrapper = render(
            <ApplicationProvider config={config}>
                <Summary/>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });

    it('should not show the empty address lines', () => {
        config.summary.primaryCorrespondent.address.address2 = undefined;
        config.summary.primaryCorrespondent.address.address3 = undefined;

        const wrapper = render(
            <ApplicationProvider config={config}>
                <Summary/>
            </ApplicationProvider>
        );
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    });
});
